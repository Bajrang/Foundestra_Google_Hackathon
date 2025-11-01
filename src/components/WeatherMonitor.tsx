import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  AlertTriangle,
  Thermometer,
  Wind,
  Droplets,
  Eye,
  Umbrella,
  Snowflake,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  uvIndex: number;
  alert?: string;
  icon: string;
}

interface ForecastDay {
  date: string;
  dayName: string;
  condition: string;
  highTemp: number;
  lowTemp: number;
  humidity: number;
  windSpeed: number;
  chanceOfRain: number;
  icon: string;
  alerts?: string[];
}

interface WeatherMonitorProps {
  destination: string;
  itineraryId?: string;
  onWeatherAlert?: (alertData: any) => void;
}

export function WeatherMonitor({ 
  destination, 
  itineraryId, 
  onWeatherAlert 
}: WeatherMonitorProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    fetchWeatherData();
    
    // Set up polling for weather updates every 30 minutes
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [destination]);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      
      // Simulate weather API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockWeatherData: WeatherData = {
        location: destination,
        temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
        condition: getRandomWeatherCondition(),
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
        visibility: Math.floor(Math.random() * 5) + 5, // 5-10 km
        uvIndex: Math.floor(Math.random() * 8) + 1, // 1-8
        icon: 'sunny'
      };

      // Generate 7-day forecast
      const mockForecast: ForecastDay[] = [];
      const days = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        
        const condition = getRandomWeatherCondition();
        const baseTemp = 20 + Math.floor(Math.random() * 15);
        const alerts = [];
        
        // Add weather alerts for specific conditions
        if (condition.includes('Heavy Rain')) {
          alerts.push('Heavy rainfall expected - consider indoor activities');
        } else if (condition.includes('Thunder')) {
          alerts.push('Thunderstorm warning - avoid outdoor activities');
        } else if (baseTemp > 35) {
          alerts.push('Heat wave warning - stay hydrated');
        }
        
        mockForecast.push({
          date: date.toISOString().split('T')[0],
          dayName: i < 2 ? days[i] : date.toLocaleDateString('en-US', { weekday: 'long' }),
          condition,
          highTemp: baseTemp + Math.floor(Math.random() * 5),
          lowTemp: baseTemp - Math.floor(Math.random() * 8),
          humidity: Math.floor(Math.random() * 40) + 40,
          windSpeed: Math.floor(Math.random() * 20) + 5,
          chanceOfRain: condition.includes('Rain') ? Math.floor(Math.random() * 60) + 40 : Math.floor(Math.random() * 30),
          icon: getWeatherIcon(condition),
          alerts: alerts.length > 0 ? alerts : undefined
        });
      }

      // Simulate weather alerts (10% chance for current weather)
      if (Math.random() < 0.1 && !alertShown) {
        mockWeatherData.alert = "Heavy rain expected in the afternoon. Consider indoor activities.";
        
        if (onWeatherAlert && itineraryId) {
          onWeatherAlert({
            itineraryId,
            weatherData: {
              alert: mockWeatherData.alert,
              condition: mockWeatherData.condition
            }
          });
          setAlertShown(true);
        }
      }

      setWeather(mockWeatherData);
      setForecast(mockForecast);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRandomWeatherCondition = () => {
    const conditions = [
      'Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain', 
      'Thunderstorms', 'Drizzle', 'Overcast', 'Clear', 'Scattered Clouds'
    ];
    return conditions[Math.floor(Math.random() * conditions.length)];
  };

  const getWeatherIcon = (condition: string) => {
    if (condition.includes('Thunder')) {
      return <CloudLightning className="w-6 h-6 text-purple-500" />;
    } else if (condition.includes('Heavy Rain')) {
      return <CloudRain className="w-6 h-6 text-blue-600" />;
    } else if (condition.includes('Light Rain') || condition.includes('Drizzle')) {
      return <CloudDrizzle className="w-6 h-6 text-blue-500" />;
    } else if (condition.includes('Snow')) {
      return <CloudSnow className="w-6 h-6 text-blue-300" />;
    } else if (condition.includes('Cloud') || condition.includes('Overcast')) {
      return <Cloud className="w-6 h-6 text-gray-500" />;
    } else {
      return <Sun className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getConditionColor = (condition: string) => {
    if (condition.includes('Thunder')) return 'destructive';
    if (condition.includes('Heavy Rain')) return 'destructive';
    if (condition.includes('Rain')) return 'secondary';
    return 'default';
  };

  const getUVIndexColor = (uvIndex: number) => {
    if (uvIndex <= 2) return 'text-green-600';
    if (uvIndex <= 5) return 'text-yellow-600';
    if (uvIndex <= 7) return 'text-orange-600';
    return 'text-red-600';
  };

  const getUVIndexLabel = (uvIndex: number) => {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 7) return 'High';
    return 'Very High';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-5 h-5" />
            Weather & Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-5 h-5" />
            Weather & Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Unable to load weather data</p>
          <Button variant="outline" size="sm" onClick={fetchWeatherData} className="mt-2">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Weather Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Current Weather - {weather.location}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {weather.alert && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-orange-800 font-medium">Weather Alert</p>
                  <p className="text-orange-700 text-sm">{weather.alert}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getWeatherIcon(weather.condition)}
              <div>
                <p className="text-3xl font-bold">{weather.temperature}°C</p>
                <Badge variant={getConditionColor(weather.condition)}>
                  {weather.condition}
                </Badge>
              </div>
            </div>
            
            <div className="text-right space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Droplets className="w-4 h-4" />
                  {weather.humidity}%
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Wind className="w-4 h-4" />
                  {weather.windSpeed} km/h
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  {weather.visibility} km
                </div>
                <div className={`flex items-center gap-1 ${getUVIndexColor(weather.uvIndex)}`}>
                  <Sun className="w-4 h-4" />
                  UV {weather.uvIndex} ({getUVIndexLabel(weather.uvIndex)})
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
            <Button variant="ghost" size="sm" onClick={fetchWeatherData}>
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 7-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            7-Day Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed">Detailed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                {forecast.map((day, index) => (
                  <div key={index} className="p-3 rounded-lg border bg-card hover:shadow-md transition-shadow">
                    <div className="text-center space-y-2">
                      <p className="text-sm font-medium">{day.dayName}</p>
                      <div className="flex justify-center">{getWeatherIcon(day.condition)}</div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">{day.highTemp}°</p>
                        <p className="text-xs text-muted-foreground">{day.lowTemp}°</p>
                      </div>
                      {day.chanceOfRain > 30 && (
                        <div className="flex items-center justify-center gap-1 text-xs text-blue-600">
                          <Umbrella className="w-3 h-3" />
                          {day.chanceOfRain}%
                        </div>
                      )}
                      {day.alerts && day.alerts.length > 0 && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full mx-auto"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="detailed" className="space-y-4">
              {forecast.map((day, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getWeatherIcon(day.condition)}
                      <div>
                        <h4 className="font-semibold">{day.dayName}</h4>
                        <p className="text-sm text-muted-foreground">{day.condition}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">{day.highTemp}°</span>
                        <TrendingUp className="w-4 h-4 text-red-500" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{day.lowTemp}°</span>
                        <TrendingDown className="w-4 h-4 text-blue-500" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span>{day.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wind className="w-4 h-4 text-gray-500" />
                      <span>{day.windSpeed} km/h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Umbrella className="w-4 h-4 text-blue-600" />
                      <span>{day.chanceOfRain}% rain</span>
                    </div>
                  </div>
                  
                  {day.alerts && (
                    <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded">
                      {day.alerts.map((alert, alertIndex) => (
                        <div key={alertIndex} className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-orange-700">{alert}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}