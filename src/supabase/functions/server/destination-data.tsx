// Live Destination Data Service with RAG Storage
// Fetches real-time destination data from Google Maps API and stores for RAG

import * as kv from './kv_store.tsx';

interface DestinationData {
  id: string;
  name: string;
  state?: string;
  country: string;
  type: 'city' | 'region' | 'beach' | 'heritage' | 'mountain' | 'temple' | 'monument' | 'wildlife' | 'general';
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  tags: string[];
  attractions: Attraction[];
  travelInfo: {
    bestSeason: string;
    avgDuration: string;
    estimatedBudget: number;
    accessibility: string;
  };
  metadata: {
    rating?: number;
    totalReviews?: number;
    photoUrls?: string[];
    popularWith?: string[];
    climate?: string;
    languages?: string[];
  };
  sources: {
    googlePlaceId?: string;
    fetchedAt: string;
    lastUpdated: string;
  };
}

interface Attraction {
  name: string;
  type: string;
  rating?: number;
  description?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  estimatedCost?: number;
  duration?: string;
  tags?: string[];
}

export class DestinationDataService {
  private googleMapsApiKey: string;
  private cacheExpiry = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  constructor() {
    this.googleMapsApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY') || '';
    
    if (!this.googleMapsApiKey) {
      console.warn('⚠️  GOOGLE_MAPS_API_KEY not set - Live destination data disabled');
      console.log('   Set in Supabase: Edge Functions → Secrets → GOOGLE_MAPS_API_KEY');
    } else {
      console.log('✓ Destination Data Service initialized with Google Maps API');
    }
  }

  /**
   * Get or fetch destination data (with caching)
   */
  async getDestinationData(query: string): Promise<DestinationData[]> {
    console.log(`📍 Getting destination data for: "${query}"`);

    // Check cache first
    const cacheKey = `destination:${query.toLowerCase().trim()}`;
    const cached = await kv.get(cacheKey);

    if (cached && this.isCacheValid(cached)) {
      console.log('✓ Using cached destination data');
      return cached.data;
    }

    // Fetch fresh data
    console.log('→ Fetching live destination data from Google Maps...');
    const destinations = await this.fetchLiveDestinationData(query);

    // Store in database for RAG
    if (destinations.length > 0) {
      await this.storeDestinationData(query, destinations);
    }

    return destinations;
  }

  /**
   * Fetch live destination data from Google Maps API
   */
  private async fetchLiveDestinationData(query: string): Promise<DestinationData[]> {
    if (!this.googleMapsApiKey) {
      console.log('⚠️  Using fallback data - Google Maps API key not configured');
      return this.getFallbackDestinationData(query);
    }

    try {
      // Step 1: Text Search to find places
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + ' India tourism')}&key=${this.googleMapsApiKey}`;
      
      const searchResponse = await fetch(searchUrl);
      if (!searchResponse.ok) {
        throw new Error(`Google Maps API error: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();
      
      if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
        console.error('Google Maps API error:', searchData.status, searchData.error_message);
        return this.getFallbackDestinationData(query);
      }

      if (!searchData.results || searchData.results.length === 0) {
        console.log('No results from Google Maps, using fallback');
        return this.getFallbackDestinationData(query);
      }

      // Step 2: Get details for top results
      const destinations: DestinationData[] = [];
      const topResults = searchData.results.slice(0, 5); // Get top 5 results

      for (const place of topResults) {
        try {
          const destData = await this.enrichDestinationData(place, query);
          if (destData) {
            destinations.push(destData);
          }
        } catch (error) {
          console.error(`Error enriching destination ${place.name}:`, error);
        }
      }

      console.log(`✓ Fetched ${destinations.length} destinations from Google Maps`);
      return destinations;

    } catch (error) {
      console.error('Error fetching from Google Maps:', error);
      return this.getFallbackDestinationData(query);
    }
  }

  /**
   * Enrich destination data with place details
   */
  private async enrichDestinationData(place: any, originalQuery: string): Promise<DestinationData | null> {
    try {
      // Get detailed place information
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,geometry,rating,user_ratings_total,types,photos,reviews,price_level,opening_hours,website,editorial_summary&key=${this.googleMapsApiKey}`;
      
      const detailsResponse = await fetch(detailsUrl);
      if (!detailsResponse.ok) {
        console.warn(`Failed to fetch details for ${place.name}`);
        return this.createBasicDestinationData(place, originalQuery);
      }

      const detailsData = await detailsResponse.json();
      
      if (detailsData.status !== 'OK' || !detailsData.result) {
        return this.createBasicDestinationData(place, originalQuery);
      }

      const details = detailsData.result;

      // Determine destination type from Google types
      const destType = this.determineDestinationType(details.types || []);

      // Extract state from formatted_address
      const state = this.extractState(details.formatted_address || '');

      // Generate tags from types and query
      const tags = this.generateTags(details.types || [], originalQuery);

      // Get photo URLs
      const photoUrls = details.photos ? details.photos.slice(0, 5).map((photo: any) => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${this.googleMapsApiKey}`
      ) : [];

      // Create destination data
      const destination: DestinationData = {
        id: `dest_${place.place_id}`,
        name: details.name,
        state: state,
        country: 'India',
        type: destType,
        description: details.editorial_summary?.overview || this.generateDescription(details.name, destType, tags),
        coordinates: {
          lat: details.geometry.location.lat,
          lng: details.geometry.location.lng
        },
        tags: tags,
        attractions: await this.fetchNearbyAttractions(details.geometry.location.lat, details.geometry.location.lng, details.name),
        travelInfo: {
          bestSeason: this.determineBestSeason(state || '', destType),
          avgDuration: this.estimateDuration(destType),
          estimatedBudget: this.estimateBudget(details.price_level, destType),
          accessibility: 'Good'
        },
        metadata: {
          rating: details.rating,
          totalReviews: details.user_ratings_total,
          photoUrls: photoUrls,
          popularWith: this.determinePopularity(tags),
          climate: this.determineClimate(state || ''),
          languages: this.getRegionalLanguages(state || '')
        },
        sources: {
          googlePlaceId: place.place_id,
          fetchedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
      };

      return destination;

    } catch (error) {
      console.error('Error enriching destination:', error);
      return this.createBasicDestinationData(place, originalQuery);
    }
  }

  /**
   * Fetch nearby attractions for a destination
   */
  private async fetchNearbyAttractions(lat: number, lng: number, placeName: string): Promise<Attraction[]> {
    try {
      const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=tourist_attraction&key=${this.googleMapsApiKey}`;
      
      const response = await fetch(nearbyUrl);
      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      
      if (data.status !== 'OK' || !data.results) {
        return [];
      }

      // Get top 10 attractions
      const attractions: Attraction[] = data.results.slice(0, 10).map((place: any) => ({
        name: place.name,
        type: place.types?.[0] || 'attraction',
        rating: place.rating,
        description: place.vicinity,
        coordinates: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        },
        estimatedCost: this.estimateAttractionCost(place.types),
        duration: '2-3 hours',
        tags: place.types?.filter((t: string) => !t.includes('_')) || []
      }));

      console.log(`✓ Fetched ${attractions.length} attractions near ${placeName}`);
      return attractions;

    } catch (error) {
      console.error('Error fetching nearby attractions:', error);
      return [];
    }
  }

  /**
   * Store destination data in database for RAG
   */
  private async storeDestinationData(query: string, destinations: DestinationData[]): Promise<void> {
    try {
      const cacheKey = `destination:${query.toLowerCase().trim()}`;
      
      await kv.set(cacheKey, {
        query: query,
        data: destinations,
        fetchedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + this.cacheExpiry).toISOString()
      });

      // Also store individual destinations by ID for quick lookup
      for (const dest of destinations) {
        await kv.set(`destination:id:${dest.id}`, dest);
      }

      // Store in search index for RAG retrieval
      await this.addToSearchIndex(query, destinations);

      console.log(`✓ Stored ${destinations.length} destinations in database for RAG`);

    } catch (error) {
      console.error('Error storing destination data:', error);
    }
  }

  /**
   * Add destinations to search index for semantic search
   */
  private async addToSearchIndex(query: string, destinations: DestinationData[]): Promise<void> {
    try {
      // Create searchable text for each destination
      for (const dest of destinations) {
        const searchText = [
          dest.name,
          dest.state,
          dest.description,
          ...dest.tags,
          ...dest.attractions.map(a => a.name)
        ].join(' ').toLowerCase();

        const indexKey = `search_index:${dest.id}`;
        await kv.set(indexKey, {
          id: dest.id,
          name: dest.name,
          searchText: searchText,
          tags: dest.tags,
          type: dest.type,
          rating: dest.metadata.rating || 0,
          lastUpdated: new Date().toISOString()
        });
      }

      console.log(`✓ Added ${destinations.length} destinations to search index`);
    } catch (error) {
      console.error('Error adding to search index:', error);
    }
  }

  /**
   * Search stored destinations (RAG retrieval)
   */
  async searchStoredDestinations(query: string, filters?: {
    type?: string[];
    tags?: string[];
    minRating?: number;
    maxBudget?: number;
  }): Promise<DestinationData[]> {
    try {
      console.log(`🔍 Searching stored destinations for: "${query}"`);

      // Get all search index entries
      const indexEntries = await kv.getByPrefix('search_index:');
      
      if (!indexEntries || indexEntries.length === 0) {
        console.log('No stored destinations found');
        return [];
      }

      const searchTerms = query.toLowerCase().split(' ');
      const scored: Array<{ dest: any; score: number }> = [];

      // Score each destination based on relevance
      for (const entry of indexEntries) {
        let score = 0;
        const searchText = entry.searchText || '';
        const tags = entry.tags || [];

        // Calculate relevance score
        for (const term of searchTerms) {
          if (entry.name?.toLowerCase().includes(term)) score += 10;
          if (searchText.includes(term)) score += 5;
          if (tags.some((tag: string) => tag.toLowerCase().includes(term))) score += 3;
        }

        // Apply filters
        if (filters?.type && !filters.type.includes(entry.type)) continue;
        if (filters?.minRating && (entry.rating || 0) < filters.minRating) continue;

        if (score > 0) {
          // Get full destination data
          const fullDest = await kv.get(`destination:id:${entry.id}`);
          if (fullDest) {
            scored.push({ dest: fullDest, score });
          }
        }
      }

      // Sort by relevance score
      scored.sort((a, b) => b.score - a.score);

      const results = scored.slice(0, 10).map(s => s.dest);
      console.log(`✓ Found ${results.length} matching destinations from storage`);

      return results;

    } catch (error) {
      console.error('Error searching stored destinations:', error);
      return [];
    }
  }

  /**
   * Helper: Check if cached data is still valid
   */
  private isCacheValid(cached: any): boolean {
    if (!cached.expiresAt) return false;
    return new Date(cached.expiresAt) > new Date();
  }

  /**
   * Helper: Determine destination type from Google types
   */
  private determineDestinationType(types: string[]): DestinationData['type'] {
    if (types.includes('natural_feature')) return 'beach';
    if (types.includes('mountain')) return 'mountain';
    if (types.includes('hindu_temple') || types.includes('place_of_worship')) return 'temple';
    if (types.includes('museum') || types.includes('landmark')) return 'heritage';
    if (types.includes('park')) return 'wildlife';
    if (types.includes('locality') || types.includes('administrative_area_level_2')) return 'city';
    return 'general';
  }

  /**
   * Helper: Extract state from address
   */
  private extractState(address: string): string {
    const indianStates = [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
      'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
      'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
    ];

    for (const state of indianStates) {
      if (address.includes(state)) return state;
    }

    return 'India';
  }

  /**
   * Helper: Generate tags from types and query
   */
  private generateTags(types: string[], query: string): string[] {
    const tags = new Set<string>();

    // Add from Google types
    const tagMapping: Record<string, string[]> = {
      'tourist_attraction': ['tourism', 'sightseeing'],
      'natural_feature': ['nature', 'scenic'],
      'hindu_temple': ['spiritual', 'heritage', 'temple'],
      'museum': ['heritage', 'culture', 'history'],
      'park': ['nature', 'outdoor', 'relaxation'],
      'beach': ['beach', 'coastal', 'water sports'],
      'mountain': ['adventure', 'trekking', 'mountains']
    };

    for (const type of types) {
      if (tagMapping[type]) {
        tagMapping[type].forEach(tag => tags.add(tag));
      }
    }

    // Add from query
    const queryTags = ['heritage', 'beach', 'adventure', 'spiritual', 'nature', 'nightlife', 'food', 'shopping', 'wildlife'];
    for (const tag of queryTags) {
      if (query.toLowerCase().includes(tag)) {
        tags.add(tag);
      }
    }

    return Array.from(tags);
  }

  /**
   * Helper: Generate description
   */
  private generateDescription(name: string, type: string, tags: string[]): string {
    const templates: Record<string, string> = {
      beach: `${name} is a beautiful coastal destination known for its pristine beaches and water activities.`,
      mountain: `${name} is a scenic mountain destination perfect for trekking and adventure sports.`,
      heritage: `${name} is a historic site showcasing India's rich cultural heritage.`,
      temple: `${name} is a sacred spiritual destination with architectural beauty.`,
      city: `${name} is a vibrant city offering diverse experiences for travelers.`
    };

    return templates[type] || `${name} is a popular tourist destination in India, known for ${tags.slice(0, 3).join(', ')}.`;
  }

  /**
   * Helper: Determine best season
   */
  private determineBestSeason(state: string, type: string): string {
    const seasonMap: Record<string, string> = {
      'Goa': 'Nov-Feb',
      'Kerala': 'Sep-Mar',
      'Rajasthan': 'Oct-Mar',
      'Himachal Pradesh': 'Mar-Jun, Sep-Nov',
      'Uttarakhand': 'Apr-Jun, Sep-Nov',
      'Tamil Nadu': 'Nov-Mar'
    };

    return seasonMap[state] || 'Oct-Mar';
  }

  /**
   * Helper: Estimate duration
   */
  private estimateDuration(type: string): string {
    const durationMap: Record<string, string> = {
      beach: '4-5 days',
      mountain: '5-7 days',
      heritage: '2-3 days',
      temple: '1-2 days',
      city: '3-5 days'
    };

    return durationMap[type] || '3-4 days';
  }

  /**
   * Helper: Estimate budget
   */
  private estimateBudget(priceLevel: number | undefined, type: string): number {
    const base = 15000;
    const multiplier = priceLevel || 2;
    return base * multiplier;
  }

  /**
   * Helper: Estimate attraction cost
   */
  private estimateAttractionCost(types: string[]): number {
    if (types.includes('museum')) return 500;
    if (types.includes('park')) return 200;
    if (types.includes('hindu_temple')) return 0;
    return 300;
  }

  /**
   * Helper: Determine popularity
   */
  private determinePopularity(tags: string[]): string[] {
    const popularity = [];
    if (tags.includes('adventure')) popularity.push('Adventure seekers');
    if (tags.includes('heritage')) popularity.push('History buffs');
    if (tags.includes('beach')) popularity.push('Beach lovers');
    if (tags.includes('spiritual')) popularity.push('Spiritual travelers');
    if (tags.includes('nature')) popularity.push('Nature enthusiasts');
    return popularity.length > 0 ? popularity : ['All travelers'];
  }

  /**
   * Helper: Determine climate
   */
  private determineClimate(state: string): string {
    const climateMap: Record<string, string> = {
      'Goa': 'Tropical',
      'Kerala': 'Tropical',
      'Rajasthan': 'Arid',
      'Himachal Pradesh': 'Alpine',
      'Uttarakhand': 'Alpine'
    };

    return climateMap[state] || 'Moderate';
  }

  /**
   * Helper: Get regional languages
   */
  private getRegionalLanguages(state: string): string[] {
    const langMap: Record<string, string[]> = {
      'Goa': ['Konkani', 'Hindi', 'English'],
      'Kerala': ['Malayalam', 'Hindi', 'English'],
      'Rajasthan': ['Hindi', 'Rajasthani', 'English'],
      'Tamil Nadu': ['Tamil', 'Hindi', 'English'],
      'Karnataka': ['Kannada', 'Hindi', 'English']
    };

    return langMap[state] || ['Hindi', 'English'];
  }

  /**
   * Fallback destination data when API is unavailable
   */
  private getFallbackDestinationData(query: string): DestinationData[] {
    console.log('Using enhanced fallback destination data');

    const fallbackDestinations: Record<string, DestinationData> = {
      'arunachal pradesh': {
        id: 'dest_arunachal',
        name: 'Arunachal Pradesh',
        state: 'Arunachal Pradesh',
        country: 'India',
        type: 'region',
        description: 'Arunachal Pradesh is the land of rising sun, known for its pristine natural beauty, Buddhist monasteries, and diverse tribal culture.',
        coordinates: { lat: 28.2180, lng: 94.7278 },
        tags: ['nature', 'adventure', 'mountains', 'trekking', 'spiritual', 'wildlife'],
        attractions: [
          { name: 'Tawang Monastery', type: 'spiritual', rating: 4.7, duration: '2-3 hours', estimatedCost: 0, tags: ['heritage', 'spiritual'] },
          { name: 'Sela Pass', type: 'scenic', rating: 4.8, duration: '1-2 hours', estimatedCost: 0, tags: ['nature', 'photography'] },
          { name: 'Ziro Valley', type: 'nature', rating: 4.6, duration: '1 day', estimatedCost: 500, tags: ['nature', 'culture'] },
          { name: 'Namdapha National Park', type: 'wildlife', rating: 4.5, duration: '1-2 days', estimatedCost: 2000, tags: ['wildlife', 'nature'] }
        ],
        travelInfo: {
          bestSeason: 'Mar-Oct',
          avgDuration: '7-10 days',
          estimatedBudget: 35000,
          accessibility: 'Moderate (requires permits)'
        },
        metadata: {
          rating: 4.6,
          totalReviews: 1200,
          popularWith: ['Adventure seekers', 'Nature lovers', 'Photography enthusiasts'],
          climate: 'Alpine',
          languages: ['Hindi', 'English', 'Local dialects']
        },
        sources: {
          fetchedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
      }
    };

    const queryLower = query.toLowerCase();
    const matches: DestinationData[] = [];

    // Check for exact or partial matches
    for (const [key, dest] of Object.entries(fallbackDestinations)) {
      if (queryLower.includes(key) || key.includes(queryLower)) {
        matches.push(dest);
      }
    }

    return matches;
  }

  /**
   * Create basic destination data from minimal place info
   */
  private createBasicDestinationData(place: any, query: string): DestinationData {
    return {
      id: `dest_${place.place_id || Date.now()}`,
      name: place.name || query,
      country: 'India',
      type: 'general',
      description: `${place.name || query} is a destination in India.`,
      coordinates: place.geometry?.location || { lat: 0, lng: 0 },
      tags: this.generateTags(place.types || [], query),
      attractions: [],
      travelInfo: {
        bestSeason: 'Oct-Mar',
        avgDuration: '3-4 days',
        estimatedBudget: 20000,
        accessibility: 'Good'
      },
      metadata: {
        rating: place.rating
      },
      sources: {
        googlePlaceId: place.place_id,
        fetchedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }
    };
  }

  /**
   * Get statistics about stored destination data
   */
  async getStorageStats(): Promise<any> {
    try {
      const searchIndexEntries = await kv.getByPrefix('search_index:');
      const destinationCaches = await kv.getByPrefix('destination:');

      return {
        totalDestinations: searchIndexEntries.length,
        totalCaches: destinationCaches.length,
        storageHealthy: true,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return {
        totalDestinations: 0,
        totalCaches: 0,
        storageHealthy: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
export const destinationDataService = new DestinationDataService();
