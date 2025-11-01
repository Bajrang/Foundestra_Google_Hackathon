import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  MapPin, 
  Calendar, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  RefreshCw,
  Wifi,
  WifiOff,
  Clock,
  Star,
  Navigation,
  Camera,
  Utensils
} from 'lucide-react';
import { useApiCall } from '../hooks/useApiCall';

interface RealtimeData {
  location: {
    name: string;
    coordinates: [number, number];
    currentWeather: {
      temperature: number;
      condition: string;
      humidity: number;
      windSpeed: number;
    };
    crowdLevel: 'low' | 'medium' | 'high';
    alerts: string[];
  };
  events: Array<{
    id: string;
    name: string;
    type: 'cultural' | 'music' | 'food' | 'sports' | 'festival';
    date: string;
    location: string;
    price: number;
    popularity: number;
  }>;
  localInsights: Array<{
    type: 'hidden_gem' | 'local_tip' | 'budget_hack' | 'photo_spot';
    title: string;
    description: string;
    rating: number;
    verifiedBy: 'local_guide' | 'ai' | 'traveler';
  }>;
  transportation: {
    trafficLevel: 'low' | 'medium' | 'high';
    alternativeRoutes: number;
    estimatedDelay: number;
    publicTransportStatus: 'normal' | 'delayed' | 'disrupted';
  };
  accommodationTrends: {
    averagePrice: number;
    availability: 'high' | 'medium' | 'low';
    bestDeals: Array<{
      name: string;
      originalPrice: number;
      discountedPrice: number;
      rating: number;
    }>;
  };
}

interface RealtimeDataIntegrationProps {
  destination: string;
  onDataUpdate: (data: RealtimeData) => void;
  isActive: boolean;
}

export function RealtimeDataIntegration({ 
  destination, 
  onDataUpdate, 
  isActive 
}: RealtimeDataIntegrationProps) {
  const [data, setData] = useState<RealtimeData | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { call: apiCall, loading } = useApiCall();

  const fetchRealtimeData = async () => {
    if (!destination || !isActive) return;

    try {
      await apiCall('realtime-data', {
        body: { destination, timestamp: new Date().toISOString() },
        onSuccess: (response) => {
          if (response.data) {
            setData(response.data);
            setLastUpdate(new Date());
            setIsConnected(true);
            onDataUpdate(response.data);
          }
        },
        onError: (error) => {
          console.error('realtime-data error:', error);
          setIsConnected(false);
          // Set mock data as fallback
          setData(getMockRealtimeData(destination));
          setLastUpdate(new Date());
        }
      });
    } catch (error) {
      console.error('Realtime data fetch failed:', error);
      setIsConnected(false);
      // Set mock data as fallback
      setData(getMockRealtimeData(destination));
      setLastUpdate(new Date());
    }
  };

  const getMockRealtimeData = (destination: string): RealtimeData => {
    return {
      location: {
        name: destination,
        coordinates: [26.9124, 75.7873],
        currentWeather: {
          temperature: 28,
          condition: 'Clear',
          humidity: 45,
          windSpeed: 12
        },
        crowdLevel: 'medium' as const,
        alerts: []
      },
      events: [
        {
          id: 'mock_event_1',
          name: 'Local Cultural Event',
          type: 'cultural',
          date: new Date().toISOString(),
          location: 'City Center',
          price: 300,
          popularity: 75
        }
      ],
      localInsights: [
        {
          type: 'local_tip',
          title: 'Best Time to Visit',
          description: 'Visit early morning for fewer crowds',
          rating: 4.5,
          verifiedBy: 'ai'
        }
      ],
      transportation: {
        trafficLevel: 'low' as const,
        alternativeRoutes: 3,
        estimatedDelay: 5,
        publicTransportStatus: 'normal' as const
      },
      accommodationTrends: {
        averagePrice: 3500,
        availability: 'high' as const,
        bestDeals: [
          {
            name: 'Heritage Hotel',
            originalPrice: 4000,
            discountedPrice: 3200,
            rating: 4.3
          }
        ]
      }
    };
  };

  useEffect(() => {
    if (isActive && destination) {
      // Use mock data initially to avoid blocking
      setData(getMockRealtimeData(destination));
      setLastUpdate(new Date());
      
      // Try to fetch real data in the background
      const timeoutId = setTimeout(() => {
        fetchRealtimeData();
      }, 1000); // Delay initial fetch by 1 second
      
      // Set up real-time updates every 5 minutes
      const interval = setInterval(fetchRealtimeData, 5 * 60 * 1000);
      
      return () => {
        clearTimeout(timeoutId);
        clearInterval(interval);
      };
    }
  }, [destination, isActive]);

  if (!isActive || !data) {
    return (
      <Card className="bg-gray-50 border-dashed">
        <CardContent className="p-6 text-center">
          <WifiOff className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Real-time data will load when trip planning begins</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`} />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Live Data' : 'Demo Mode'} • 
            {lastUpdate && ` Updated ${lastUpdate.toLocaleTimeString()}`}
          </span>
          {!isConnected && (
            <Badge variant="outline" className="text-xs">
              Using sample data
            </Badge>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchRealtimeData}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Current Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Current Conditions - {data.location.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {data.location.currentWeather.temperature}°C
              </div>
              <div className="text-sm text-gray-600">
                {data.location.currentWeather.condition}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {data.location.crowdLevel.toUpperCase()}
              </div>
              <div className="text-sm text-gray-600">Crowd Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {data.transportation.trafficLevel.toUpperCase()}
              </div>
              <div className="text-sm text-gray-600">Traffic</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ₹{data.accommodationTrends.averagePrice}
              </div>
              <div className="text-sm text-gray-600">Avg. Hotel Price</div>
            </div>
          </div>

          {/* Active Alerts */}
          {data.location.alerts.length > 0 && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 text-orange-800 font-medium mb-2">
                <AlertTriangle className="w-4 h-4" />
                Active Alerts
              </div>
              <div className="space-y-1">
                {data.location.alerts.map((alert, index) => (
                  <div key={index} className="text-sm text-orange-700">
                    • {alert}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Happening Now & Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.events.slice(0, 4).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{event.name}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-4">
                    <span>{event.location}</span>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <Badge variant="secondary" className="text-xs">
                      {event.type}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">₹{event.price}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {event.popularity}% popular
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Local Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Local Insights & Hidden Gems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.localInsights.slice(0, 3).map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  {insight.type === 'hidden_gem' && <Camera className="w-4 h-4 text-blue-600" />}
                  {insight.type === 'local_tip' && <Users className="w-4 h-4 text-blue-600" />}
                  {insight.type === 'budget_hack' && <TrendingUp className="w-4 h-4 text-blue-600" />}
                  {insight.type === 'photo_spot' && <Camera className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-blue-900">{insight.title}</div>
                  <div className="text-sm text-blue-700 mt-1">{insight.description}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">{insight.rating}/5</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Verified by {insight.verifiedBy.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transportation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Transportation Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Traffic Level</span>
                <Badge variant={
                  data.transportation.trafficLevel === 'low' ? 'default' :
                  data.transportation.trafficLevel === 'medium' ? 'secondary' : 'destructive'
                }>
                  {data.transportation.trafficLevel}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Estimated Delay</span>
                <span className="text-sm font-medium">
                  {data.transportation.estimatedDelay} mins
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Alternative Routes</span>
                <span className="text-sm font-medium">
                  {data.transportation.alternativeRoutes} available
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Public Transport</span>
                <Badge variant={
                  data.transportation.publicTransportStatus === 'normal' ? 'default' :
                  data.transportation.publicTransportStatus === 'delayed' ? 'secondary' : 'destructive'
                }>
                  {data.transportation.publicTransportStatus}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Deals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Live Deals & Offers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.accommodationTrends.bestDeals.slice(0, 3).map((deal, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-green-900">{deal.name}</div>
                  <div className="text-sm text-green-700 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {deal.rating}/5 rating
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 line-through">₹{deal.originalPrice}</div>
                  <div className="font-bold text-green-600">₹{deal.discountedPrice}</div>
                  <div className="text-xs text-green-700">
                    Save ₹{deal.originalPrice - deal.discountedPrice}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}