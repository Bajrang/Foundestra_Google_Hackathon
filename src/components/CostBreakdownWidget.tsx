import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { 
  IndianRupee, 
  TrendingUp, 
  Calendar,
  Plane,
  Building,
  MapPin,
  Utensils,
  ShoppingBag,
  Info
} from 'lucide-react';
import { Itinerary } from './ItineraryDisplay';

interface CostBreakdownWidgetProps {
  itinerary?: Itinerary;
  selectedLanguage?: string;
}

interface CostCategory {
  name: string;
  nameHindi?: string;
  value: number;
  color: string;
  icon: React.ElementType;
  description: string;
  descriptionHindi?: string;
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

// Sample data for demo purposes when no itinerary is provided
const sampleBudgetTiers = [
  {
    name: 'Budget',
    nameHindi: 'बजट',
    total: 15000,
    days: 3,
    categories: [
      { name: 'Transport', value: 3000, percentage: 20 },
      { name: 'Accommodation', value: 4500, percentage: 30 },
      { name: 'Activities', value: 3000, percentage: 20 },
      { name: 'Meals', value: 3000, percentage: 20 },
      { name: 'Shopping & Others', value: 1500, percentage: 10 }
    ]
  },
  {
    name: 'Premium',
    nameHindi: 'प्रीमियम',
    total: 35000,
    days: 3,
    categories: [
      { name: 'Transport', value: 8000, percentage: 23 },
      { name: 'Accommodation', value: 15000, percentage: 43 },
      { name: 'Activities', value: 6000, percentage: 17 },
      { name: 'Meals', value: 4000, percentage: 11 },
      { name: 'Shopping & Others', value: 2000, percentage: 6 }
    ]
  }
];

export function CostBreakdownWidget({ itinerary, selectedLanguage = 'en' }: CostBreakdownWidgetProps) {
  const [viewMode, setViewMode] = useState<'total' | 'daily'>('total');
  const [selectedTier, setSelectedTier] = useState<'Budget' | 'Premium'>('Budget');
  const isHindi = selectedLanguage === 'hi';

  // If no itinerary provided, show sample cost breakdown
  if (!itinerary) {
    const currentTier = sampleBudgetTiers.find(tier => tier.name === selectedTier)!;
    
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <IndianRupee className="w-6 h-6 text-green-600" />
            {isHindi ? "लागत विवरण" : "Cost Breakdown"}
          </CardTitle>
          <p className="text-gray-600">
            {isHindi ? "विभिन्न बजट स्तरों पर नमूना लागत" : "Sample costs across different budget tiers"}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Budget Tier Selection */}
          <div className="flex justify-center gap-4">
            {sampleBudgetTiers.map((tier) => (
              <Button
                key={tier.name}
                variant={selectedTier === tier.name ? "default" : "outline"}
                onClick={() => setSelectedTier(tier.name as 'Budget' | 'Premium')}
                className="flex flex-col items-center gap-2 h-auto py-4 px-6"
              >
                <span className="font-semibold">
                  {isHindi && tier.nameHindi ? tier.nameHindi : tier.name}
                </span>
                <Badge variant="secondary" className="text-xs">
                  ₹{tier.total.toLocaleString()} / {tier.days} days
                </Badge>
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">
                {isHindi ? "श्रेणी अनुपात" : "Category Distribution"}
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={currentTier.categories.map((cat, index) => ({
                        name: cat.name,
                        value: cat.value,
                        color: COLORS[index],
                        percentage: cat.percentage
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => `${entry.percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {currentTier.categories.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [`₹${value.toLocaleString()}`, isHindi ? "लागत" : "Cost"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">
                {isHindi ? "विस्तृत विवरण" : "Detailed Breakdown"}
              </h3>
              <div className="space-y-3">
                {currentTier.categories.map((category, index) => {
                  const IconComponent = [Plane, Building, MapPin, Utensils, ShoppingBag][index];
                  return (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <IconComponent className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium truncate">
                            {category.name}
                          </h4>
                          <span className="font-bold text-green-600 ml-2">
                            ₹{category.value.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              backgroundColor: COLORS[index],
                              width: `${category.percentage}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cost Insights */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-2">
                  {isHindi ? "लागत अंतर्दृष्टि" : "Cost Insights"}
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    • {isHindi ? "प्रति दिन औसत: " : "Average per day: "}
                    <span className="font-medium">₹{Math.round(currentTier.total / currentTier.days).toLocaleString()}</span>
                  </li>
                  <li>
                    • {isHindi ? "मुख्य लागत चालक: " : "Main cost driver: "}
                    <span className="font-medium">
                      {currentTier.categories.reduce((max, cat) => cat.value > max.value ? cat : max).name}
                    </span>
                  </li>
                  <li>
                    • {isHindi ? "लचीली बुकिंग: " : "Flexible booking: "}
                    <span className="font-medium">{isHindi ? "24 घंटे निःशुल्क रद्दीकरण" : "24hr free cancellation"}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Original component logic for when itinerary is provided
  const categories: CostCategory[] = [
    {
      name: 'Transport',
      nameHindi: 'परिवहन',
      value: itinerary.transportCost || 0,
      color: COLORS[0],
      icon: Plane,
      description: 'Flights, trains, local transport',
      descriptionHindi: 'फ्लाइट, ट्रेन, स्थानीय परिवहन'
    },
    {
      name: 'Accommodation',
      nameHindi: 'आवास',
      value: itinerary.accommodationCost || 0,
      color: COLORS[1],
      icon: Building,
      description: 'Hotels, guesthouses, stays',
      descriptionHindi: 'होटल, गेस्टहाउस, ठहरना'
    },
    {
      name: 'Activities',
      nameHindi: 'गतिविधियाँ',
      value: itinerary.activityCost || 0,
      color: COLORS[2],
      icon: MapPin,
      description: 'Tours, entrance fees, experiences',
      descriptionHindi: 'टूर, प्रवेश शुल्क, अनुभव'
    },
    {
      name: 'Meals',
      nameHindi: 'भोजन',
      value: itinerary.days.reduce((sum, day) => 
        sum + day.activities.reduce((daySum, activity) => 
          daySum + (activity.type === 'meal' ? activity.estimatedCost : 0), 0), 0) || 800 * itinerary.totalDays,
      color: COLORS[3],
      icon: Utensils,
      description: 'Restaurants, street food, snacks',
      descriptionHindi: 'रेस्तराँ, स्ट्रीट फूड, नाश्ता'
    },
    {
      name: 'Shopping & Others',
      nameHindi: 'खरीदारी और अन्य',
      value: Math.max(
        0,
        itinerary.totalCost - ((itinerary.transportCost || 0) + (itinerary.accommodationCost || 0) + (itinerary.activityCost || 0)) - 800 * itinerary.totalDays
      ),
      color: COLORS[4],
      icon: ShoppingBag,
      description: 'Souvenirs, miscellaneous expenses',
      descriptionHindi: 'स्मृति चिन्ह, विविध खर्च'
    }
  ].filter(category => category.value > 0);

  // Daily cost breakdown
  const dailyCosts = itinerary.days.map((day, index) => ({
    day: `Day ${index + 1}`,
    dayHindi: `दिन ${index + 1}`,
    date: day.date,
    cost: day.estimatedBudget || day.activities.reduce((sum, activity) => sum + activity.estimatedCost, 0),
    activities: day.activities.length
  }));

  const averageDailyCost = dailyCosts.reduce((sum, day) => sum + day.cost, 0) / dailyCosts.length;

  const pieData = categories.map(cat => ({
    name: isHindi && cat.nameHindi ? cat.nameHindi : cat.name,
    value: cat.value,
    color: cat.color,
    percentage: ((cat.value / itinerary.totalCost) * 100).toFixed(1)
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{data.name}</p>
          <p className="text-green-600 font-bold">
            ₹{data.value.toLocaleString()} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    if (parseFloat(percentage) < 8) return null; // Don't show labels for small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-medium text-sm"
      >
        {`${percentage}%`}
      </text>
    );
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <IndianRupee className="w-6 h-6 text-green-600" />
          {isHindi ? "लागत विवरण" : "Cost Breakdown"}
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {isHindi ? "आपकी यात्रा की विस्तृत लागत" : "Detailed cost analysis for your trip"}
          </p>
          <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">
            ₹{itinerary.totalCost.toLocaleString()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
          <Tabs value={viewMode} onValueChange={(value: string) => setViewMode(value as 'total' | 'daily')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="total" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {isHindi ? "कुल लागत" : "Total Cost"}
            </TabsTrigger>
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {isHindi ? "दैनिक लागत" : "Daily Cost"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="total" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">
                  {isHindi ? "श्रेणी अनुपात" : "Category Distribution"}
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={CustomPieLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">
                  {isHindi ? "विस्तृत विवरण" : "Detailed Breakdown"}
                </h3>
                <div className="space-y-3">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: category.color }}
                      />
                      <category.icon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium truncate">
                            {isHindi && category.nameHindi ? category.nameHindi : category.name}
                          </h4>
                          <span className="font-bold text-green-600 ml-2">
                            ₹{category.value.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {isHindi && category.descriptionHindi ? category.descriptionHindi : category.description}
                        </p>
                        <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              backgroundColor: category.color,
                              width: `${(category.value / itinerary.totalCost) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cost Insights */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">
                    {isHindi ? "लागत अंतर्दृष्टि" : "Cost Insights"}
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>
                      • {isHindi ? "प्रति दिन औसत: " : "Average per day: "}
                      <span className="font-medium">₹{Math.round(itinerary.totalCost / itinerary.totalDays).toLocaleString()}</span>
                    </li>
                    <li>
                      • {isHindi ? "सबसे बड़ा खर्च: " : "Largest expense: "}
                      <span className="font-medium">
                        {categories.reduce((max, cat) => cat.value > max.value ? cat : max).name} 
                        ({((categories.reduce((max, cat) => cat.value > max.value ? cat : max).value / itinerary.totalCost) * 100).toFixed(0)}%)
                      </span>
                    </li>
                    <li>
                      • {isHindi ? "बचत संभव: ₹" : "Potential savings: ₹"}
                      <span className="font-medium">{Math.round(itinerary.totalCost * 0.15).toLocaleString()}</span>
                      {isHindi ? " (बजट विकल्पों के साथ)" : " (with budget options)"}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="daily" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">
                {isHindi ? "दैनिक खर्च की प्रवृत्ति" : "Daily Spending Trend"}
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyCosts}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey={isHindi ? "dayHindi" : "day"}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value: number) => `₹${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`₹${value.toLocaleString()}`, isHindi ? "लागत" : "Cost"]}
                      labelFormatter={(label: any) => `${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cost" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dailyCosts.map((day, index) => (
                <Card key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge 
                        variant={day.cost > averageDailyCost ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {isHindi ? day.dayHindi : day.day}
                      </Badge>
                      <span className="text-sm text-gray-600">{day.date}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {isHindi ? "कुल लागत:" : "Total cost:"}
                        </span>
                        <span className="font-bold text-green-600">
                          ₹{day.cost.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {isHindi ? "गतिविधियाँ:" : "Activities:"}
                        </span>
                        <span className="text-sm font-medium">{day.activities}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {isHindi ? "औसत से:" : "vs Average:"}
                        </span>
                        <span className={`text-sm font-medium ${
                          day.cost > averageDailyCost ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {day.cost > averageDailyCost ? '+' : ''}
                          ₹{(day.cost - averageDailyCost).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}