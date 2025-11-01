// Real-time Weather Monitoring and Itinerary Adjustment Service
export class WeatherService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = Deno.env.get('OPENWEATHER_API_KEY') || '';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  async getWeatherForecast(destination: string, days: number = 7): Promise<any> {
    try {
      // Get coordinates for destination
      const geoResponse = await fetch(
        `${this.baseUrl}/weather?q=${encodeURIComponent(destination)}&appid=${this.apiKey}&units=metric`
      );
      
      if (!geoResponse.ok) {
        throw new Error(`Weather API error: ${geoResponse.status}`);
      }

      const geoData = await geoResponse.json();
      const { lat, lon } = geoData.coord;

      // Get extended forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&cnt=${days * 8}`
      );

      if (!forecastResponse.ok) {
        throw new Error(`Forecast API error: ${forecastResponse.status}`);
      }

      const forecastData = await forecastResponse.json();

      return this.processWeatherData(forecastData, destination);

    } catch (error) {
      console.error('Weather service error:', error);
      return this.getFallbackWeatherData(destination);
    }
  }

  private processWeatherData(forecastData: any, destination: string): any {
    const dailyForecasts = this.groupForecastByDay(forecastData.list);
    
    return {
      destination,
      current: {
        temperature: forecastData.list[0].main.temp,
        condition: forecastData.list[0].weather[0].main,
        description: forecastData.list[0].weather[0].description,
        humidity: forecastData.list[0].main.humidity,
        windSpeed: forecastData.list[0].wind.speed,
        visibility: forecastData.list[0].visibility || 10000
      },
      forecast: dailyForecasts.map(day => ({
        date: day.date,
        temperature: {
          min: Math.min(...day.temps),
          max: Math.max(...day.temps),
          avg: day.temps.reduce((a, b) => a + b, 0) / day.temps.length
        },
        condition: day.mostCommonCondition,
        description: day.descriptions[0],
        precipitation: {
          probability: day.precipitationProb,
          amount: day.precipitationAmount
        },
        wind: {
          speed: day.avgWindSpeed,
          direction: day.windDirection
        },
        humidity: day.avgHumidity,
        alerts: this.generateWeatherAlerts(day),
        recommendations: this.generateActivityRecommendations(day)
      })),
      alerts: this.generateOverallAlerts(dailyForecasts),
      travelAdvisory: this.generateTravelAdvisory(dailyForecasts)
    };
  }

  private groupForecastByDay(forecastList: any[]): any[] {
    const grouped = new Map();

    forecastList.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      
      if (!grouped.has(date)) {
        grouped.set(date, {
          date,
          temps: [],
          conditions: [],
          descriptions: [],
          windSpeeds: [],
          humidity: [],
          precipitation: []
        });
      }

      const dayData = grouped.get(date);
      dayData.temps.push(item.main.temp);
      dayData.conditions.push(item.weather[0].main);
      dayData.descriptions.push(item.weather[0].description);
      dayData.windSpeeds.push(item.wind.speed);
      dayData.humidity.push(item.main.humidity);
      
      if (item.rain && item.rain['3h']) {
        dayData.precipitation.push(item.rain['3h']);
      }
    });

    return Array.from(grouped.values()).map(day => ({
      ...day,
      mostCommonCondition: this.getMostCommon(day.conditions),
      avgWindSpeed: day.windSpeeds.reduce((a, b) => a + b, 0) / day.windSpeeds.length,
      avgHumidity: day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length,
      precipitationProb: day.precipitation.length > 0 ? 0.8 : 0.2,
      precipitationAmount: day.precipitation.reduce((a, b) => a + b, 0)
    }));
  }

  private getMostCommon(array: string[]): string {
    const counts = array.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }

  private generateWeatherAlerts(dayData: any): string[] {
    const alerts = [];

    if (dayData.precipitationProb > 0.7) {
      alerts.push('High chance of rain - carry umbrella');
    }

    if (Math.max(...dayData.temps) > 40) {
      alerts.push('Extreme heat warning - plan indoor activities during midday');
    }

    if (Math.min(...dayData.temps) < 5) {
      alerts.push('Cold weather - dress warmly');
    }

    if (dayData.avgWindSpeed > 15) {
      alerts.push('Strong winds expected - avoid outdoor activities');
    }

    return alerts;
  }

  private generateActivityRecommendations(dayData: any): any {
    const recommendations = {
      indoor: [],
      outdoor: [],
      timing: []
    };

    if (dayData.precipitationProb > 0.6) {
      recommendations.indoor.push('Museums, shopping malls, cultural centers');
      recommendations.timing.push('Plan indoor activities for afternoon');
    } else {
      recommendations.outdoor.push('Sightseeing, heritage sites, gardens');
    }

    if (Math.max(...dayData.temps) > 35) {
      recommendations.timing.push('Early morning (6-10 AM) and evening (4-7 PM) best for outdoor activities');
      recommendations.indoor.push('Air-conditioned venues during 11 AM - 4 PM');
    }

    if (dayData.mostCommonCondition === 'Clear') {
      recommendations.outdoor.push('Perfect for photography, outdoor dining, walking tours');
    }

    return recommendations;
  }

  private generateOverallAlerts(dailyForecasts: any[]): string[] {
    const alerts = [];

    const rainyDays = dailyForecasts.filter(day => day.precipitationProb > 0.6).length;
    if (rainyDays > dailyForecasts.length * 0.4) {
      alerts.push('Monsoon season - pack rain gear and plan flexible indoor alternatives');
    }

    const hotDays = dailyForecasts.filter(day => Math.max(...day.temps) > 38).length;
    if (hotDays > 0) {
      alerts.push('Heat wave conditions expected - stay hydrated and avoid midday sun');
    }

    return alerts;
  }

  private generateTravelAdvisory(dailyForecasts: any[]): any {
    const advisory = {
      bestTravelDays: [],
      challengingDays: [],
      packingRecommendations: [],
      transportationNotes: []
    };

    dailyForecasts.forEach((day, index) => {
      if (day.precipitationProb < 0.3 && Math.max(...day.temps) < 38) {
        advisory.bestTravelDays.push(day.date);
      }

      if (day.precipitationProb > 0.7 || Math.max(...day.temps) > 40) {
        advisory.challengingDays.push(day.date);
      }
    });

    // Packing recommendations
    const maxTemp = Math.max(...dailyForecasts.flatMap(day => day.temps));
    const minTemp = Math.min(...dailyForecasts.flatMap(day => day.temps));
    const rainyDays = dailyForecasts.filter(day => day.precipitationProb > 0.6).length;

    if (maxTemp > 35) {
      advisory.packingRecommendations.push('Light cotton clothes, sun hat, sunscreen SPF 50+');
    }
    if (minTemp < 15) {
      advisory.packingRecommendations.push('Warm layers, light jacket');
    }
    if (rainyDays > 0) {
      advisory.packingRecommendations.push('Waterproof jacket, umbrella, quick-dry clothes');
    }

    // Transportation notes
    if (rainyDays > dailyForecasts.length * 0.3) {
      advisory.transportationNotes.push('Book covered transportation, allow extra travel time');
    }

    return advisory;
  }

  private getFallbackWeatherData(destination: string): any {
    // Provide seasonal average data for major Indian cities
    const seasonalData = {
      'jaipur': {
        winter: { temp: 20, condition: 'Clear', precipitation: 0.1 },
        summer: { temp: 38, condition: 'Hot', precipitation: 0.2 },
        monsoon: { temp: 30, condition: 'Rain', precipitation: 0.8 }
      },
      'goa': {
        winter: { temp: 28, condition: 'Clear', precipitation: 0.1 },
        summer: { temp: 32, condition: 'Humid', precipitation: 0.3 },
        monsoon: { temp: 26, condition: 'Heavy Rain', precipitation: 0.9 }
      }
    };

    const currentMonth = new Date().getMonth();
    let season = 'winter';
    if (currentMonth >= 3 && currentMonth <= 5) season = 'summer';
    if (currentMonth >= 6 && currentMonth <= 9) season = 'monsoon';

    const cityKey = destination.toLowerCase().split(',')[0];
    const cityData = seasonalData[cityKey] || seasonalData['jaipur'];
    const seasonData = cityData[season];

    return {
      destination,
      current: {
        temperature: seasonData.temp,
        condition: seasonData.condition,
        description: `Typical ${season} weather`,
        humidity: season === 'monsoon' ? 85 : 60,
        windSpeed: 10
      },
      forecast: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: {
          min: seasonData.temp - 5,
          max: seasonData.temp + 5,
          avg: seasonData.temp
        },
        condition: seasonData.condition,
        precipitation: { probability: seasonData.precipitation, amount: 0 },
        alerts: [],
        recommendations: { indoor: [], outdoor: [], timing: [] }
      })),
      alerts: [`Weather data unavailable - using seasonal averages for ${season}`],
      travelAdvisory: {
        bestTravelDays: [],
        challengingDays: [],
        packingRecommendations: [`Pack for ${season} season`],
        transportationNotes: []
      }
    };
  }

  async adjustItineraryForWeather(itinerary: any, weatherData: any): Promise<any> {
    const adjustedItinerary = JSON.parse(JSON.stringify(itinerary)); // Deep clone

    adjustedItinerary.days.forEach((day: any, dayIndex: number) => {
      const dayWeather = weatherData.forecast[dayIndex];
      if (!dayWeather) return;

      // Add weather consideration to day
      day.weather_consideration = `${dayWeather.condition} - ${dayWeather.description}`;

      // Adjust activities based on weather
      day.segments.forEach((segment: any) => {
        if (segment.activity_type === 'visit' || segment.activity_type === 'experience') {
          // High precipitation - suggest indoor alternatives
          if (dayWeather.precipitation.probability > 0.7) {
            if (!segment.notes) segment.notes = '';
            segment.notes += ' Weather note: Indoor alternative recommended due to rain forecast.';
            
            // Add indoor alternatives if it's an outdoor activity
            if (this.isOutdoorActivity(segment.title)) {
              segment.indoor_alternative = this.findIndoorAlternative(segment.title, segment.location);
            }
          }

          // Extreme heat - adjust timing
          if (dayWeather.temperature.max > 38) {
            const hour = parseInt(segment.start_time.split(':')[0]);
            if (hour >= 11 && hour <= 16) {
              if (!segment.notes) segment.notes = '';
              segment.notes += ' Weather note: Consider visiting early morning or evening due to extreme heat.';
              segment.heat_warning = true;
            }
          }

          // Add UV protection recommendations
          if (dayWeather.condition === 'Clear' && dayWeather.temperature.max > 30) {
            if (!segment.notes) segment.notes = '';
            segment.notes += ' UV protection recommended: sunscreen, hat, sunglasses.';
          }
        }
      });

      // Update day cost if alternatives are needed
      if (dayWeather.precipitation.probability > 0.7) {
        // Indoor alternatives might cost more
        day.day_total_cost = Math.ceil(day.day_total_cost * 1.1);
      }
    });

    // Update overall warnings
    if (!adjustedItinerary.weather_alerts) {
      adjustedItinerary.weather_alerts = [];
    }
    adjustedItinerary.weather_alerts.push(...weatherData.alerts);

    // Update total cost if adjustments were made
    const originalCost = adjustedItinerary.total_estimated_cost;
    const newTotalCost = adjustedItinerary.days.reduce((sum: number, day: any) => sum + day.day_total_cost, 0);
    
    if (newTotalCost !== originalCost) {
      adjustedItinerary.total_estimated_cost = newTotalCost;
      adjustedItinerary.cost_breakdown.activities = adjustedItinerary.cost_breakdown.activities + (newTotalCost - originalCost);
    }

    return adjustedItinerary;
  }

  private isOutdoorActivity(activityTitle: string): boolean {
    const outdoorKeywords = ['fort', 'garden', 'park', 'market', 'bazaar', 'beach', 'trek', 'safari', 'outdoor', 'monument'];
    return outdoorKeywords.some(keyword => activityTitle.toLowerCase().includes(keyword));
  }

  private findIndoorAlternative(originalActivity: string, location: any): any {
    const alternatives = {
      'fort': { title: 'Local Museum or Heritage Center', type: 'museum' },
      'garden': { title: 'Art Gallery or Cultural Center', type: 'gallery' },
      'market': { title: 'Shopping Mall or Covered Market', type: 'shopping' },
      'monument': { title: 'Indoor Heritage Site or Palace', type: 'heritage' }
    };

    for (const [keyword, alternative] of Object.entries(alternatives)) {
      if (originalActivity.toLowerCase().includes(keyword)) {
        return {
          title: alternative.title,
          type: alternative.type,
          location: { ...location, name: `${alternative.title} near ${location.name}` },
          reason: 'Weather-adjusted indoor alternative'
        };
      }
    }

    return {
      title: 'Local Indoor Cultural Experience',
      type: 'cultural',
      location,
      reason: 'General indoor alternative for weather protection'
    };
  }

  async getWeatherAlerts(destination: string): Promise<any[]> {
    try {
      // In production, this would call real weather alert APIs
      const alertsResponse = await fetch(
        `${this.baseUrl}/weather?q=${encodeURIComponent(destination)}&appid=${this.apiKey}&units=metric`
      );

      if (!alertsResponse.ok) {
        return [];
      }

      const data = await alertsResponse.json();
      const alerts = [];

      // Generate alerts based on current conditions
      if (data.main.temp > 40) {
        alerts.push({
          type: 'heat_wave',
          severity: 'high',
          message: 'Extreme heat warning in effect',
          recommendations: ['Stay hydrated', 'Avoid midday sun', 'Seek air-conditioned spaces']
        });
      }

      if (data.weather[0].main === 'Thunderstorm') {
        alerts.push({
          type: 'storm',
          severity: 'medium',
          message: 'Thunderstorm activity detected',
          recommendations: ['Stay indoors', 'Avoid outdoor activities', 'Monitor weather updates']
        });
      }

      return alerts;

    } catch (error) {
      console.error('Weather alerts error:', error);
      return [];
    }
  }
}

export const weatherService = new WeatherService();