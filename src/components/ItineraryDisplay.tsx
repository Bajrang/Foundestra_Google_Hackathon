import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { 
  Clock, 
  MapPin, 
  DollarSign, 
  Calendar,
  Edit,
  BookOpen,
  AlertCircle,
  Star,
  Camera,
  Mountain,
  Users,
  Plane,
  Home,
  CheckCircle,
  Share,
  Download,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export interface Activity {
  id: string;
  startTime: string;
  endTime: string;
  activity: string;
  type: string;
  location: string;
  estimatedCost: number;
  bookingOfferId?: string;
  description: string;
  isBookable: boolean;
  notes?: string;
  rating?: number;
  hiddenGem?: boolean;
  difficulty?: string;
  culturalSignificance?: string;
  photoOpportunity?: string;
  specialRequest?: boolean;
  timeOfDay?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  activities: Activity[];
  dayTheme?: string;
  estimatedBudget?: number;
}

export interface Itinerary {
  title: string;
  destination: string;
  totalDays: number;
  totalCost: number;
  currency: string;
  accommodationCost?: number;
  transportCost?: number;
  activityCost?: number;
  language?: string;
  days: ItineraryDay[];
  accommodations?: Array<{
    name: string;
    type: string;
    costPerNight: number;
    totalCost: number;
    rating: number;
    bookingOfferId: string;
  }>;
  transport?: Array<{
    types: string[];
    totalCost: number;
    bookingOfferId: string;
  }>;
  bookingSummary?: {
    totalActivities: number;
    totalBookings: number;
    estimatedSavings: number;
  };
}

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  onEditActivity: (activityId: string) => void;
  onBookActivity: (activity: Activity) => void;
  onBookCompleteItinerary: () => void;
  weatherAlerts?: Array<{
    timestamp: string;
    alert: string;
    adjustmentsMade: boolean;
  }>;
}

export function ItineraryDisplay({ 
  itinerary, 
  onEditActivity, 
  onBookActivity,
  onBookCompleteItinerary,
  weatherAlerts 
}: ItineraryDisplayProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: itinerary.currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getActivityBadges = (activity: Activity) => {
    const badges = [];
    
    if (activity.hiddenGem) {
      badges.push(
        <Badge key="gem" variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Sparkles className="w-3 h-3 mr-1" />
          Hidden Gem
        </Badge>
      );
    }
    
    if (activity.rating && activity.rating >= 4.5) {
      badges.push(
        <Badge key="rating" variant="secondary" className="bg-green-100 text-green-800">
          <Star className="w-3 h-3 mr-1" />
          {activity.rating}
        </Badge>
      );
    }
    
    if (activity.photoOpportunity === 'Excellent') {
      badges.push(
        <Badge key="photo" variant="outline">
          <Camera className="w-3 h-3 mr-1" />
          Photo-worthy
        </Badge>
      );
    }
    
    if (activity.difficulty === 'Moderate') {
      badges.push(
        <Badge key="difficulty" variant="outline">
          <Mountain className="w-3 h-3 mr-1" />
          Moderate
        </Badge>
      );
    }
    
    if (activity.specialRequest) {
      badges.push(
        <Badge key="special" variant="default">
          <Users className="w-3 h-3 mr-1" />
          Your Request
        </Badge>
      );
    }
    
    return badges;
  };

  const getTotalSavings = () => {
    if (itinerary.bookingSummary) {
      return itinerary.totalCost - itinerary.bookingSummary.estimatedSavings;
    }
    return itinerary.totalCost;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: itinerary.title,
          text: `Check out my ${itinerary.totalDays}-day trip to ${itinerary.destination}!`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // Could show a toast here
    }
  };

  const handleDownload = () => {
    // Simulate PDF download
    console.log('Downloading itinerary as PDF...');
    // In a real app, this would generate and download a PDF
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Enhanced Header with Cost Breakdown */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{itinerary.title}</CardTitle>
              <div className="flex items-center gap-6 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {itinerary.destination}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {itinerary.totalDays} days
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {itinerary.bookingSummary?.totalActivities || 0} activities
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-primary mb-1">
                {formatCurrency(getTotalSavings())}
              </div>
              {itinerary.bookingSummary && itinerary.bookingSummary.estimatedSavings > 0 && (
                <div className="text-sm text-muted-foreground">
                  <span className="line-through">{formatCurrency(itinerary.totalCost)}</span>
                  <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                    Save {formatCurrency(itinerary.bookingSummary.estimatedSavings)}
                  </Badge>
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share className="w-4 h-4 mr-1" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-1" />
                  PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          {(itinerary.accommodationCost || itinerary.transportCost || itinerary.activityCost) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {itinerary.accommodationCost && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Accommodation</span>
                  </div>
                  <span className="font-semibold text-blue-800">
                    {formatCurrency(itinerary.accommodationCost)}
                  </span>
                </div>
              )}
              
              {itinerary.transportCost && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Transport</span>
                  </div>
                  <span className="font-semibold text-green-800">
                    {formatCurrency(itinerary.transportCost)}
                  </span>
                </div>
              )}
              
              {itinerary.activityCost && (
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">Activities</span>
                  </div>
                  <span className="font-semibold text-purple-800">
                    {formatCurrency(itinerary.activityCost)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* One-Click Booking Button */}
          {itinerary.bookingSummary && (
            <div className="mt-6">
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                onClick={onBookCompleteItinerary}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Book Complete Trip - {formatCurrency(getTotalSavings())}
                <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                  {itinerary.bookingSummary.totalBookings} items
                </Badge>
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-2">
                One-click booking for accommodations, transport & all activities
              </p>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Weather Alerts */}
      {weatherAlerts && weatherAlerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="w-5 h-5" />
              Weather Alerts & Adjustments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weatherAlerts.map((alert, index) => (
              <div key={index} className="mb-2 last:mb-0">
                <p className="text-orange-700">{alert.alert}</p>
                {alert.adjustmentsMade && (
                  <p className="text-sm text-orange-600 mt-1">
                    ✓ Itinerary automatically adjusted for weather conditions
                  </p>
                )}
                <p className="text-xs text-orange-500">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Accommodation & Transport Details */}
      {(itinerary.accommodations?.length || itinerary.transport?.length) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {itinerary.accommodations && itinerary.accommodations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Accommodation
                </CardTitle>
              </CardHeader>
              <CardContent>
                {itinerary.accommodations.map((acc, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{acc.name}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{acc.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground capitalize">{acc.type} accommodation</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        {formatCurrency(acc.costPerNight)}/night × {itinerary.totalDays - 1} nights
                      </span>
                      <span className="font-semibold">{formatCurrency(acc.totalCost)}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {itinerary.transport && itinerary.transport.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="w-5 h-5" />
                  Transport
                </CardTitle>
              </CardHeader>
              <CardContent>
                {itinerary.transport.map((transport, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-semibold">
                      {transport.types.join(', ').replace(/^\w/, c => c.toUpperCase())} Travel
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Includes {transport.types.join(', ')} transportation
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total transport cost</span>
                      <span className="font-semibold">{formatCurrency(transport.totalCost)}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Daily Itinerary */}
      {itinerary.days.map((day) => (
        <Card key={day.dayNumber}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span>Day {day.dayNumber}</span>
                <span className="text-muted-foreground">
                  {formatDate(day.date)}
                </span>
                {day.dayTheme && (
                  <Badge variant="outline" className="capitalize">
                    {day.dayTheme}
                  </Badge>
                )}
              </CardTitle>
              {day.estimatedBudget && (
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Day budget</div>
                  <div className="font-semibold">{formatCurrency(day.estimatedBudget)}</div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {day.activities.map((activity, activityIndex) => (
              <div key={`${day.dayNumber}-${activity.id}-${activityIndex}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {activity.startTime} - {activity.endTime}
                        {activity.timeOfDay && (
                          <span className="ml-1 text-xs">({activity.timeOfDay})</span>
                        )}
                      </div>
                      <Badge variant="outline">{activity.type}</Badge>
                      {activity.notes && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.notes}
                        </Badge>
                      )}
                    </div>
                    
                    <h4 className="font-semibold text-lg">{activity.activity}</h4>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {activity.location}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>

                    {/* Activity badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {getActivityBadges(activity)}
                    </div>

                    {/* Additional activity details */}
                    {(activity.difficulty || activity.culturalSignificance) && (
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        {activity.difficulty && (
                          <span>Difficulty: {activity.difficulty}</span>
                        )}
                        {activity.culturalSignificance && (
                          <span>Cultural Value: {activity.culturalSignificance}</span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">
                        {formatCurrency(activity.estimatedCost)}
                      </span>
                      {activity.hiddenGem && (
                        <span className="text-xs text-muted-foreground ml-1">
                          (exclusive experience)
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditActivity(activity.id)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    
                    {activity.isBookable && (
                      <Button
                        size="sm"
                        onClick={() => onBookActivity(activity)}
                      >
                        <BookOpen className="w-4 h-4 mr-1" />
                        Book
                      </Button>
                    )}
                  </div>
                </div>
                
                {activityIndex < day.activities.length - 1 && (
                  <Separator className="mt-6" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Booking Summary Footer */}
      {itinerary.bookingSummary && (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {itinerary.bookingSummary.totalActivities}
                </div>
                <div className="text-sm text-muted-foreground">Total Activities</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(itinerary.bookingSummary.estimatedSavings)}
                </div>
                <div className="text-sm text-muted-foreground">Bulk Booking Savings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {itinerary.bookingSummary.totalBookings}
                </div>
                <div className="text-sm text-muted-foreground">Items to Book</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}