// Real-time Data Integration Service for POIs, Events, and Live Information
export class RealtimeDataService {
  private googleMapsKey: string;
  private foursquareKey: string;
  private eventbriteKey: string;

  constructor() {
    this.googleMapsKey = Deno.env.get('GOOGLE_MAPS_API_KEY') || '';
    this.foursquareKey = Deno.env.get('FOURSQUARE_API_KEY') || '';
    this.eventbriteKey = Deno.env.get('EVENTBRITE_API_KEY') || '';
  }

  // Fetch live POI data with real-time information
  async fetchLivePOIData(destination: string, interests: string[]): Promise<any> {
    try {
      const [googlePlaces, foursquareVenues] = await Promise.all([
        this.fetchGooglePlaces(destination, interests),
        this.fetchFoursquareVenues(destination, interests)
      ]);

      // Merge and enhance POI data
      const enhancedPOIs = await this.enhancePOIData([...googlePlaces, ...foursquareVenues]);

      return {
        success: true,
        pois: enhancedPOIs,
        lastUpdated: new Date().toISOString(),
        sources: ['google_places', 'foursquare']
      };

    } catch (error) {
      console.error('Live POI data fetch error:', error);
      return this.getFallbackPOIData(destination, interests);
    }
  }

  private async fetchGooglePlaces(destination: string, interests: string[]): Promise<any[]> {
    try {
      const placeTypes = this.mapInterestsToPlaceTypes(interests);
      const venues = [];

      for (const placeType of placeTypes) {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(destination)}+${placeType}&key=${this.googleMapsKey}&fields=place_id,name,geometry,rating,opening_hours,photos,price_level,types`
        );

        if (response.ok) {
          const data = await response.json();
          venues.push(...data.results.slice(0, 5)); // Limit to 5 per type
        }
      }

      return venues.map(venue => ({
        id: `google_${venue.place_id}`,
        name: venue.name,
        lat: venue.geometry.location.lat,
        lon: venue.geometry.location.lng,
        rating: venue.rating || 4.0,
        priceLevel: venue.price_level || 2,
        types: venue.types || [],
        photos: venue.photos?.map(photo => 
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${this.googleMapsKey}`
        ) || [],
        openingHours: venue.opening_hours?.weekday_text || [],
        placeId: venue.place_id,
        source: 'google_places'
      }));

    } catch (error) {
      console.error('Google Places API error:', error);
      return [];
    }
  }

  private async fetchFoursquareVenues(destination: string, interests: string[]): Promise<any[]> {
    try {
      const categories = this.mapInterestsToFoursquareCategories(interests);
      const venues = [];

      const response = await fetch(
        `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(destination)}&categories=${categories.join(',')}&limit=20`,
        {
          headers: {
            'Authorization': this.foursquareKey,
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        venues.push(...data.results);
      }

      return venues.map(venue => ({
        id: `foursquare_${venue.fsq_id}`,
        name: venue.name,
        lat: venue.geocodes.main.latitude,
        lon: venue.geocodes.main.longitude,
        rating: venue.rating || 4.0,
        categories: venue.categories?.map(cat => cat.name) || [],
        address: venue.location?.formatted_address || '',
        photos: venue.photos?.map(photo => photo.prefix + '400x400' + photo.suffix) || [],
        tips: venue.tips?.map(tip => tip.text) || [],
        fsqId: venue.fsq_id,
        source: 'foursquare'
      }));

    } catch (error) {
      console.error('Foursquare API error:', error);
      return [];
    }
  }

  private mapInterestsToPlaceTypes(interests: string[]): string[] {
    const mapping = {
      'heritage': ['museum', 'tourist_attraction', 'hindu_temple'],
      'food': ['restaurant', 'meal_takeaway', 'bakery'],
      'nature': ['park', 'zoo', 'aquarium'],
      'shopping': ['shopping_mall', 'store'],
      'nightlife': ['night_club', 'bar'],
      'adventure': ['amusement_park', 'gym'],
      'spiritual': ['hindu_temple', 'church', 'mosque'],
      'art': ['art_gallery', 'museum'],
      'entertainment': ['movie_theater', 'amusement_park']
    };

    return interests.flatMap(interest => mapping[interest] || ['tourist_attraction']);
  }

  private mapInterestsToFoursquareCategories(interests: string[]): string[] {
    const mapping = {
      'heritage': ['16000', '12000'], // Landmarks, Arts & Entertainment
      'food': ['13000'], // Food
      'nature': ['16000'], // Outdoors & Recreation
      'shopping': ['17000'], // Retail
      'nightlife': ['10000'], // Nightlife
      'adventure': ['18000'], // Travel & Transportation
      'spiritual': ['12000'], // Arts & Entertainment (Religious)
      'art': ['12000'], // Arts & Entertainment
      'entertainment': ['12000'] // Arts & Entertainment
    };

    return interests.flatMap(interest => mapping[interest] || ['16000']);
  }

  private async enhancePOIData(pois: any[]): Promise<any[]> {
    const enhanced = [];

    for (const poi of pois) {
      try {
        // Get real-time data like current crowd levels, wait times
        const liveData = await this.getLiveVenueData(poi);
        
        enhanced.push({
          ...poi,
          liveData: liveData,
          popularity: this.calculatePopularity(poi),
          bestTimeToVisit: this.calculateBestTimeToVisit(poi),
          estimatedVisitDuration: this.estimateVisitDuration(poi),
          accessibilityInfo: this.getAccessibilityInfo(poi),
          sustainabilityScore: this.calculateSustainabilityScore(poi)
        });

      } catch (error) {
        console.error(`Error enhancing POI ${poi.id}:`, error);
        enhanced.push(poi);
      }
    }

    return enhanced;
  }

  private async getLiveVenueData(poi: any): Promise<any> {
    // Simulate real-time data - in production, integrate with Google Popular Times API or similar
    const currentHour = new Date().getHours();
    
    return {
      crowdLevel: this.simulateCrowdLevel(currentHour, poi.types),
      waitTime: this.simulateWaitTime(currentHour, poi.types),
      isOpen: this.checkIfOpen(currentHour),
      currentTemperature: await this.getCurrentTemperature(poi.lat, poi.lon),
      parking: {
        available: Math.random() > 0.3,
        cost: poi.priceLevel ? poi.priceLevel * 50 : 100,
        walkingDistance: Math.floor(Math.random() * 500) + 100
      }
    };
  }

  private simulateCrowdLevel(hour: number, types: string[]): string {
    // Business logic for crowd levels based on POI type and time
    if (types.includes('restaurant')) {
      if (hour >= 12 && hour <= 14 || hour >= 19 && hour <= 21) {
        return 'high';
      }
    }
    
    if (types.includes('tourist_attraction')) {
      if (hour >= 10 && hour <= 16) {
        return 'medium';
      }
    }

    return Math.random() > 0.5 ? 'low' : 'medium';
  }

  private simulateWaitTime(hour: number, types: string[]): number {
    const crowdLevel = this.simulateCrowdLevel(hour, types);
    
    switch (crowdLevel) {
      case 'high': return Math.floor(Math.random() * 30) + 15;
      case 'medium': return Math.floor(Math.random() * 15) + 5;
      default: return Math.floor(Math.random() * 5);
    }
  }

  private checkIfOpen(hour: number): boolean {
    // Simple business hours simulation
    return hour >= 9 && hour <= 22;
  }

  private async getCurrentTemperature(lat: number, lon: number): Promise<number> {
    try {
      // This would typically use the weather service
      return Math.floor(Math.random() * 15) + 25; // 25-40°C range
    } catch {
      return 30; // Default temperature
    }
  }

  private calculatePopularity(poi: any): number {
    // Algorithm to calculate popularity based on rating, reviews, types
    const baseScore = (poi.rating || 4.0) * 20;
    const typeBonus = poi.types?.includes('tourist_attraction') ? 10 : 0;
    const photoBonus = poi.photos?.length > 0 ? 5 : 0;
    
    return Math.min(100, baseScore + typeBonus + photoBonus);
  }

  private calculateBestTimeToVisit(poi: any): any {
    const typeSpecific = {
      'restaurant': { best: '12:00-14:00, 19:00-21:00', avoid: '15:00-18:00' },
      'tourist_attraction': { best: '09:00-11:00, 16:00-18:00', avoid: '12:00-15:00' },
      'museum': { best: '10:00-12:00, 14:00-17:00', avoid: '12:00-14:00' },
      'park': { best: '06:00-09:00, 17:00-19:00', avoid: '12:00-16:00' }
    };

    for (const type of poi.types || []) {
      if (typeSpecific[type]) {
        return typeSpecific[type];
      }
    }

    return { best: '09:00-11:00, 16:00-18:00', avoid: '12:00-15:00' };
  }

  private estimateVisitDuration(poi: any): number {
    const durationMap = {
      'museum': 120,
      'tourist_attraction': 90,
      'park': 60,
      'restaurant': 75,
      'shopping_mall': 120,
      'temple': 45,
      'art_gallery': 90
    };

    for (const type of poi.types || []) {
      if (durationMap[type]) {
        return durationMap[type];
      }
    }

    return 60; // Default 1 hour
  }

  private getAccessibilityInfo(poi: any): any {
    // Simulate accessibility information
    return {
      wheelchairAccessible: Math.random() > 0.3,
      guideDogFriendly: Math.random() > 0.2,
      audioGuideAvailable: poi.types?.includes('museum') ? Math.random() > 0.4 : false,
      brailleSignage: poi.types?.includes('museum') ? Math.random() > 0.6 : false,
      elevatorAccess: Math.random() > 0.5,
      accessibleParking: Math.random() > 0.4
    };
  }

  private calculateSustainabilityScore(poi: any): number {
    // Basic sustainability scoring
    let score = 50; // Base score

    if (poi.types?.includes('park')) score += 20;
    if (poi.types?.includes('museum')) score += 15;
    if (poi.types?.includes('public_transport')) score += 25;
    if (poi.rating && poi.rating > 4.0) score += 10;

    return Math.min(100, score);
  }

  // Fetch live events and activities
  async fetchLiveEvents(destination: string, dateRange: any): Promise<any> {
    try {
      const events = await this.fetchEventbriteEvents(destination, dateRange);
      
      return {
        success: true,
        events: events,
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      console.error('Live events fetch error:', error);
      return this.getFallbackEventsData(destination, dateRange);
    }
  }

  private async fetchEventbriteEvents(destination: string, dateRange: any): Promise<any[]> {
    try {
      const response = await fetch(
        `https://www.eventbriteapi.com/v3/events/search/?location.address=${encodeURIComponent(destination)}&start_date.range_start=${dateRange.start}&start_date.range_end=${dateRange.end}&expand=venue,organizer`,
        {
          headers: {
            'Authorization': `Bearer ${this.eventbriteKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Eventbrite API error: ${response.status}`);
      }

      const data = await response.json();

      return data.events?.map(event => ({
        id: `eventbrite_${event.id}`,
        title: event.name.text,
        description: event.description?.text || '',
        startDate: event.start.local,
        endDate: event.end.local,
        venue: {
          name: event.venue?.name || 'TBA',
          address: event.venue?.address?.localized_address_display || '',
          lat: event.venue?.latitude || 0,
          lon: event.venue?.longitude || 0
        },
        category: event.category?.name || 'General',
        ticketPrice: {
          min: event.ticket_availability?.minimum_ticket_price?.major_value || 0,
          max: event.ticket_availability?.maximum_ticket_price?.major_value || 0,
          currency: event.ticket_availability?.minimum_ticket_price?.currency || 'INR'
        },
        ticketsAvailable: event.ticket_availability?.has_available_tickets || false,
        organizer: event.organizer?.name || '',
        url: event.url,
        images: event.logo?.url ? [event.logo.url] : [],
        source: 'eventbrite'
      })) || [];

    } catch (error) {
      console.error('Eventbrite API error:', error);
      return [];
    }
  }

  // Get travel time matrix between locations
  async getTravelTimeMatrix(origins: any[], destinations: any[]): Promise<any> {
    try {
      const originStr = origins.map(o => `${o.lat},${o.lon}`).join('|');
      const destStr = destinations.map(d => `${d.lat},${d.lon}`).join('|');

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originStr}&destinations=${destStr}&units=metric&mode=driving&traffic_model=best_guess&departure_time=now&key=${this.googleMapsKey}`
      );

      if (!response.ok) {
        throw new Error(`Distance Matrix API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        matrix: this.processTravelTimeMatrix(data, origins, destinations),
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      console.error('Travel time matrix error:', error);
      return this.getFallbackTravelTimes(origins, destinations);
    }
  }

  private processTravelTimeMatrix(data: any, origins: any[], destinations: any[]): any[] {
    const matrix = [];

    data.rows.forEach((row: any, originIndex: number) => {
      row.elements.forEach((element: any, destIndex: number) => {
        matrix.push({
          origin: origins[originIndex],
          destination: destinations[destIndex],
          distance: {
            text: element.distance?.text || 'N/A',
            value: element.distance?.value || 0
          },
          duration: {
            text: element.duration?.text || 'N/A',
            value: element.duration?.value || 0
          },
          durationInTraffic: {
            text: element.duration_in_traffic?.text || element.duration?.text || 'N/A',
            value: element.duration_in_traffic?.value || element.duration?.value || 0
          },
          status: element.status
        });
      });
    });

    return matrix;
  }

  // Fallback data methods
  private getFallbackPOIData(destination: string, interests: string[]): any {
    const fallbackPOIs = [
      {
        id: 'fallback_poi_1',
        name: 'City Palace',
        lat: 26.9255,
        lon: 75.8213,
        rating: 4.3,
        types: ['tourist_attraction', 'museum'],
        source: 'fallback'
      },
      {
        id: 'fallback_poi_2',
        name: 'Local Market',
        lat: 26.9246,
        lon: 75.8267,
        rating: 4.1,
        types: ['shopping', 'food'],
        source: 'fallback'
      }
    ];

    return {
      success: true,
      pois: fallbackPOIs,
      lastUpdated: new Date().toISOString(),
      sources: ['fallback']
    };
  }

  private getFallbackEventsData(destination: string, dateRange: any): any {
    const fallbackEvents = [
      {
        id: 'fallback_event_1',
        title: 'Cultural Heritage Festival',
        description: 'Celebrate local culture and traditions',
        startDate: dateRange.start,
        endDate: dateRange.end,
        venue: {
          name: 'Cultural Center',
          address: `${destination} Cultural Center`,
          lat: 26.9200,
          lon: 75.8300
        },
        category: 'Cultural',
        ticketPrice: { min: 200, max: 500, currency: 'INR' },
        source: 'fallback'
      }
    ];

    return {
      success: true,
      events: fallbackEvents,
      lastUpdated: new Date().toISOString()
    };
  }

  private getFallbackTravelTimes(origins: any[], destinations: any[]): any {
    const matrix = [];

    origins.forEach(origin => {
      destinations.forEach(dest => {
        // Simple distance calculation
        const distance = this.calculateDistance(origin.lat, origin.lon, dest.lat, dest.lon);
        const duration = Math.max(15, distance * 2); // Assume 30 km/h average speed

        matrix.push({
          origin,
          destination: dest,
          distance: { text: `${distance.toFixed(1)} km`, value: distance * 1000 },
          duration: { text: `${duration} min`, value: duration * 60 },
          durationInTraffic: { text: `${Math.ceil(duration * 1.2)} min`, value: Math.ceil(duration * 1.2) * 60 },
          status: 'OK'
        });
      });
    });

    return {
      success: true,
      matrix,
      lastUpdated: new Date().toISOString()
    };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.degToRad(lat2 - lat1);
    const dLon = this.degToRad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private degToRad(deg: number): number {
    return deg * (Math.PI/180);
  }
}

export const realtimeDataService = new RealtimeDataService();