import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  Calendar, 
  Star, 
  DollarSign,
  Clock,
  Target,
  Eye,
  ThumbsUp,
  Share2,
  Download,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Globe,
  Heart,
  Zap
} from 'lucide-react';
import { useApiCall } from '../hooks/useApiCall';

interface AnalyticsData {
  overview: {
    totalTrips: number;
    totalUsers: number;
    averageRating: number;
    totalRevenue: number;
    conversionRate: number;
    userGrowth: number;
  };
  travelInsights: {
    popularDestinations: Array<{
      name: string;
      visits: number;
      averageBudget: number;
      satisfaction: number;
    }>;
    seasonalTrends: Array<{
      month: string;
      bookings: number;
      revenue: number;
      averageGroupSize: number;
    }>;
    budgetDistribution: Array<{
      range: string;
      count: number;
      percentage: number;
    }>;
  };
  userBehavior: {
    interestPreferences: Array<{
      interest: string;
      popularity: number;
      conversionRate: number;
    }>;
    bookingPatterns: Array<{
      timeframe: string;
      immediateBookings: number;
      reviewFirstBookings: number;
      comparisonBookings: number;
    }>;
    deviceUsage: Array<{
      device: string;
      usage: number;
      conversionRate: number;
    }>;
  };
  aiPerformance: {
    recommendationAccuracy: number;
    personalizedClickRate: number;
    adaptationSuccessRate: number;
    weatherAlertEffectiveness: number;
    hiddenGemDiscovery: number;
  };
  businessMetrics: {
    revenueBySource: Array<{
      source: string;
      revenue: number;
      bookings: number;
    }>;
    customerLifetimeValue: number;
    repeatBookingRate: number;
    averageBookingValue: number;
  };
}

interface AnalyticsDashboardProps {
  isVisible: boolean;
  userRole: 'admin' | 'analyst' | 'viewer';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function AnalyticsDashboard({ isVisible, userRole }: AnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [isRealtime, setIsRealtime] = useState(false);
  const { call: apiCall, loading } = useApiCall();

  const fetchAnalytics = async () => {
    try {
      await apiCall('analytics/dashboard', {
        body: { 
          period: selectedPeriod, 
          metric: selectedMetric,
          realtime: isRealtime 
        },
        onSuccess: (response) => {
          setAnalyticsData(response.data);
        },
        errorMessage: 'Failed to load analytics data'
      });
    } catch (error) {
      console.error('Analytics fetch error:', error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchAnalytics();
      
      // Set up real-time updates if enabled
      if (isRealtime) {
        const interval = setInterval(fetchAnalytics, 30000); // 30 seconds
        return () => clearInterval(interval);
      }
    }
  }, [isVisible, selectedPeriod, selectedMetric, isRealtime]);

  const exportData = async (format: 'csv' | 'pdf' | 'excel') => {
    try {
      await apiCall('analytics/export', {
        body: { 
          period: selectedPeriod,
          format,
          data: analyticsData 
        },
        onSuccess: (response) => {
          // Trigger download
          const link = document.createElement('a');
          link.href = response.downloadUrl;
          link.download = `analytics-${selectedPeriod}.${format}`;
          link.click();
        },
        successMessage: `Analytics exported as ${format.toUpperCase()}`,
        errorMessage: 'Export failed. Please try again.'
      });
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  if (!isVisible || !analyticsData) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-12 text-center">
          <BarChart3 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-blue-900 mb-2">Analytics Dashboard</h3>
          <p className="text-blue-700 mb-4">
            Comprehensive insights into travel patterns, user behavior, and business performance
          </p>
          {loading && (
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Loading analytics...</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
              <p className="text-gray-600">Travel insights and business intelligence</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRealtime(!isRealtime)}
                className={isRealtime ? 'bg-green-50 border-green-300' : ''}
              >
                <Activity className={`w-4 h-4 mr-2 ${isRealtime ? 'text-green-600' : ''}`} />
                {isRealtime ? 'Live' : 'Static'}
              </Button>

              <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              {userRole === 'admin' && (
                <div className="flex gap-1">
                  {['csv', 'pdf', 'excel'].map((format) => (
                    <Button
                      key={format}
                      variant="outline"
                      size="sm"
                      onClick={() => exportData(format as any)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      {format.toUpperCase()}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          {
            title: 'Total Trips',
            value: analyticsData.overview.totalTrips.toLocaleString(),
            change: `+${analyticsData.overview.userGrowth}%`,
            icon: MapPin,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Active Users',
            value: analyticsData.overview.totalUsers.toLocaleString(),
            change: '+12%',
            icon: Users,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'Avg Rating',
            value: analyticsData.overview.averageRating.toFixed(1),
            change: '+0.2',
            icon: Star,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50'
          },
          {
            title: 'Revenue',
            value: `₹${(analyticsData.overview.totalRevenue / 100000).toFixed(1)}L`,
            change: '+18%',
            icon: DollarSign,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
          },
          {
            title: 'Conversion',
            value: `${analyticsData.overview.conversionRate}%`,
            change: '+3%',
            icon: Target,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
          },
          {
            title: 'AI Accuracy',
            value: `${analyticsData.aiPerformance.recommendationAccuracy}%`,
            change: '+5%',
            icon: Zap,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50'
          }
        ].map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-sm text-green-600">{metric.change}</p>
                </div>
                <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Popular Destinations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Popular Destinations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.travelInsights.popularDestinations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'visits' ? `${value} trips` : 
                    name === 'averageBudget' ? `₹${value.toLocaleString()}` :
                    `${value}/5`,
                    name === 'visits' ? 'Visits' :
                    name === 'averageBudget' ? 'Avg Budget' : 'Satisfaction'
                  ]}
                />
                <Bar dataKey="visits" fill="#0088FE" name="visits" />
                <Bar dataKey="averageBudget" fill="#00C49F" name="averageBudget" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Seasonal Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Seasonal Booking Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.travelInsights.seasonalTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'bookings' ? `${value} bookings` : 
                    name === 'revenue' ? `₹${value.toLocaleString()}` :
                    `${value} people`,
                    name === 'bookings' ? 'Bookings' :
                    name === 'revenue' ? 'Revenue' : 'Avg Group Size'
                  ]}
                />
                <Area type="monotone" dataKey="bookings" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="revenue" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* User Behavior Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interest Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Interest Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.userBehavior.interestPreferences}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ interest, percentage }) => `${interest} (${percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="popularity"
                  >
                    {analyticsData.userBehavior.interestPreferences.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Budget Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Budget Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.travelInsights.budgetDistribution.map((budget, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">{budget.range}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${budget.percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 min-w-[60px]">
                      {budget.count} ({budget.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            AI Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              {
                title: 'Recommendation Accuracy',
                value: analyticsData.aiPerformance.recommendationAccuracy,
                description: 'How often AI suggestions match user preferences'
              },
              {
                title: 'Personalization CTR',
                value: analyticsData.aiPerformance.personalizedClickRate,
                description: 'Click-through rate on personalized content'
              },
              {
                title: 'Adaptation Success',
                value: analyticsData.aiPerformance.adaptationSuccessRate,
                description: 'Success rate of real-time itinerary adjustments'
              },
              {
                title: 'Weather Alert Effectiveness',
                value: analyticsData.aiPerformance.weatherAlertEffectiveness,
                description: 'User satisfaction with weather-based changes'
              },
              {
                title: 'Hidden Gem Discovery',
                value: analyticsData.aiPerformance.hiddenGemDiscovery,
                description: 'Rate of successful hidden gem recommendations'
              }
            ].map((metric, index) => (
              <div key={index} className="text-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {metric.value}%
                </div>
                <div className="font-medium text-gray-900 mb-2">{metric.title}</div>
                <div className="text-xs text-gray-600">{metric.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Booking Behavior Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.userBehavior.bookingPatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timeframe" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="immediateBookings" fill="#0088FE" name="Immediate" />
                <Bar dataKey="reviewFirstBookings" fill="#00C49F" name="Review First" />
                <Bar dataKey="comparisonBookings" fill="#FFBB28" name="Compare Options" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Analytics */}
      {userRole === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Business Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  ₹{analyticsData.businessMetrics.customerLifetimeValue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Customer Lifetime Value</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {analyticsData.businessMetrics.repeatBookingRate}%
                </div>
                <div className="text-sm text-gray-600">Repeat Booking Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  ₹{analyticsData.businessMetrics.averageBookingValue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Average Booking Value</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {analyticsData.businessMetrics.revenueBySource.length}
                </div>
                <div className="text-sm text-gray-600">Revenue Channels</div>
              </div>
            </div>

            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.businessMetrics.revenueBySource}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? `₹${value.toLocaleString()}` : `${value} bookings`,
                      name === 'revenue' ? 'Revenue' : 'Bookings'
                    ]}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="bookings" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Key Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-800 mb-3">🎯 Growth Opportunities</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                  <span>Heritage tourism shows 25% higher conversion rates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                  <span>Mobile bookings increased 40% with new interface</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                  <span>AI personalization improves satisfaction by 15%</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-orange-800 mb-3">⚠️ Areas for Improvement</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                  <span>Off-season bookings need promotional campaigns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                  <span>Budget travelers show lower engagement rates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                  <span>Weather alerts need faster response times</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}