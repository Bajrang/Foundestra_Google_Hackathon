import React from 'react';
import { ItineraryDisplay, Itinerary, Activity } from '../ItineraryDisplay';
import { WeatherMonitor } from '../WeatherMonitor';
import { ProfessionalFooter } from '../ProfessionalFooter';
import { RealtimeDataIntegration } from '../RealtimeDataIntegration';
import { EMTIntegration } from '../EMTIntegration';
import { AdvancedPersonalization } from '../AdvancedPersonalization';
import { AnalyticsDashboard } from '../AnalyticsDashboard';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { ArrowLeft, Globe, AlertTriangle, Zap, Brain, BarChart3, Plane } from 'lucide-react';
import { TripData } from '../TripPlanningForm';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';

interface ViewingPageProps {
  itinerary: Itinerary | null;
  currentTripData: TripData | null;
  itineraryId: string | null;
  weatherAlerts: Array<{
    timestamp: string;
    alert: string;
    adjustmentsMade: boolean;
  }>;
  onStartOver: () => void;
  onEditActivity: (activityId: string) => void;
  onBookActivity: (activity: Activity) => void;
  onBookCompleteItinerary: () => void;
  onWeatherAlert: (alertData: any) => void;
  selectedLanguage?: Language;
}

export function ViewingPage({
  itinerary,
  currentTripData,
  itineraryId,
  weatherAlerts,
  onStartOver,
  onEditActivity,
  onBookActivity,
  onBookCompleteItinerary,
  onWeatherAlert,
  selectedLanguage = 'en'
}: ViewingPageProps) {
  const t = useTranslation(selectedLanguage);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={onStartOver}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Plan New Trip
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Personalized Itinerary
            </h1>
            <p className="text-gray-600">
              AI-generated travel plan with real-time updates and one-click booking
            </p>
            {itinerary?.language && itinerary.language !== 'en' && (
              <p className="text-sm text-muted-foreground mt-1">
                <Globe className="w-4 h-4 inline mr-1" />
                Available in your preferred language
              </p>
            )}
          </div>
          
          <div></div> {/* Spacer for flex layout */}
        </div>

        <Tabs defaultValue="itinerary" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="itinerary" className="text-base">
              Complete Itinerary
            </TabsTrigger>
            <TabsTrigger value="realtime" className="text-base flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Real-time Data
            </TabsTrigger>
            <TabsTrigger value="booking" className="text-base flex items-center gap-2">
              <Plane className="w-4 h-4" />
              EMT Booking
            </TabsTrigger>
            <TabsTrigger value="personalization" className="text-base flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Personalization
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="weather" className="text-base">
              Weather & Alerts
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="itinerary" className="space-y-6">
            {itinerary && (
              <ItineraryDisplay 
                itinerary={itinerary}
                onEditActivity={onEditActivity}
                onBookActivity={onBookActivity}
                onBookCompleteItinerary={onBookCompleteItinerary}
                weatherAlerts={weatherAlerts}
              />
            )}
          </TabsContent>
          
          <TabsContent value="realtime">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Real-time Travel Intelligence
                </h2>
                <p className="text-gray-600">
                  Live data integration for optimal travel planning
                </p>
              </div>
              
              <RealtimeDataIntegration
                destination={currentTripData?.destination || ''}
                onDataUpdate={(data) => {
                  console.log('Real-time data updated:', data);
                  // Handle real-time data updates
                }}
                isActive={!!currentTripData}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="booking">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  EaseMyTrip Integration
                </h2>
                <p className="text-gray-600">
                  Complete booking solution with exclusive discounts
                </p>
              </div>
              
              {currentTripData && (
                <EMTIntegration
                  destination={currentTripData.destination}
                  startDate={currentTripData.startDate}
                  endDate={currentTripData.endDate}
                  travelers={currentTripData.travelers}
                  budget={currentTripData.budget}
                  onBookingComplete={(bookingData) => {
                    console.log('EMT booking completed:', bookingData);
                    // Handle booking completion
                  }}
                  isVisible={!!currentTripData}
                />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="personalization">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Advanced Personalization
                </h2>
                <p className="text-gray-600">
                  Fine-tune your travel preferences for better recommendations
                </p>
              </div>
              
              <AdvancedPersonalization
                onProfileUpdate={(profile) => {
                  console.log('Personalization profile updated:', profile);
                  // Handle profile updates
                }}
                currentProfile={{}}
                isVisible={true}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Travel Analytics & Insights
                </h2>
                <p className="text-gray-600">
                  Data-driven insights for better travel planning
                </p>
              </div>
              
              <AnalyticsDashboard
                isVisible={true}
                userRole="viewer"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="weather">
            {currentTripData && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Weather Forecast & Alerts
                  </h2>
                  <p className="text-gray-600">
                    Real-time weather monitoring with smart itinerary adjustments
                  </p>
                </div>
                
                <WeatherMonitor 
                  destination={currentTripData.destination}
                  itineraryId={itineraryId || undefined}
                  onWeatherAlert={onWeatherAlert}
                />
                
                {/* Weather Impact Summary */}
                {weatherAlerts.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        Weather Impact History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {weatherAlerts.map((alert, index) => (
                          <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm text-orange-800 font-medium">{alert.alert}</p>
                                <p className="text-xs text-orange-600 mt-1">
                                  {new Date(alert.timestamp).toLocaleString()}
                                </p>
                              </div>
                              {alert.adjustmentsMade && (
                                <Badge variant="secondary" className="text-xs">
                                  Auto-adjusted
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <ProfessionalFooter />
    </div>
  );
}