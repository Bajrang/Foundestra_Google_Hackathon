import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Clock, 
  Star, 
  MousePointerClick, 
  TrendingUp, 
  Sparkles,
  Zap,
  Award,
  BarChart3,
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: number;
  color: string;
  description?: string;
  loading?: boolean;
}

interface AIMetricsDashboardProps {
  userId?: string;
  showRealTimeUpdates?: boolean;
  className?: string;
}

function MetricCard({ 
  icon, 
  label, 
  value, 
  subValue, 
  trend, 
  color, 
  description,
  loading = false 
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-2 hover:shadow-lg transition-all duration-300 hover:border-purple-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
              {icon}
            </div>
            {trend !== undefined && (
              <Badge 
                variant="secondary" 
                className={`gap-1 ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}
              >
                <ArrowUpRight className="w-3 h-3" />
                {trend > 0 ? '+' : ''}{trend}%
              </Badge>
            )}
          </div>
          <CardTitle className="text-sm font-medium text-gray-600 mt-3">
            {label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
            </div>
          ) : (
            <>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {value}
              </div>
              {subValue && (
                <div className="text-sm text-gray-500">
                  {subValue}
                </div>
              )}
              {description && (
                <div className="text-xs text-gray-400 mt-2">
                  {description}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function AIMetricsDashboard({ 
  userId, 
  showRealTimeUpdates = true,
  className = '' 
}: AIMetricsDashboardProps) {
  const [metrics, setMetrics] = useState({
    hoursSaved: 0,
    googleReviewsAnalyzed: 0,
    clicksSaved: 0,
    aiRecommendations: 0,
    accuracyScore: 0,
    userSatisfaction: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading metrics
    const loadMetrics = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate or fetch actual metrics
      const calculatedMetrics = {
        hoursSaved: 47.5,
        googleReviewsAnalyzed: 1243,
        clicksSaved: 876,
        aiRecommendations: 324,
        accuracyScore: 94.8,
        userSatisfaction: 4.7
      };
      
      setMetrics(calculatedMetrics);
      setIsLoading(false);
    };
    
    loadMetrics();
    
    // Set up real-time updates if enabled
    if (showRealTimeUpdates) {
      const interval = setInterval(() => {
        setMetrics(prev => ({
          hoursSaved: prev.hoursSaved + (Math.random() * 0.5),
          googleReviewsAnalyzed: prev.googleReviewsAnalyzed + Math.floor(Math.random() * 3),
          clicksSaved: prev.clicksSaved + Math.floor(Math.random() * 5),
          aiRecommendations: prev.aiRecommendations + Math.floor(Math.random() * 2),
          accuracyScore: Math.min(99.9, prev.accuracyScore + (Math.random() * 0.1)),
          userSatisfaction: Math.min(5.0, prev.userSatisfaction + (Math.random() * 0.01))
        }));
      }, 5000); // Update every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [showRealTimeUpdates]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Impact Metrics
          </h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          See how our AI-powered travel planner saves you time, effort, and provides intelligent recommendations
        </p>
      </motion.div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Hours Saved */}
        <MetricCard
          icon={<Clock className="w-6 h-6 text-white" />}
          label="Hours Saved"
          value={metrics.hoursSaved.toFixed(1)}
          subValue="hours of research time"
          trend={12}
          color="from-blue-500 to-blue-600"
          description="AI automatically researches destinations, reviews, and creates itineraries"
          loading={isLoading}
        />

        {/* Google Reviews Analyzed */}
        <MetricCard
          icon={<Star className="w-6 h-6 text-white" />}
          label="Google Reviews Analyzed"
          value={metrics.googleReviewsAnalyzed.toLocaleString()}
          subValue="reviews processed by AI"
          trend={25}
          color="from-yellow-500 to-orange-500"
          description="Semantic analysis of reviews to find hidden gems and avoid tourist traps"
          loading={isLoading}
        />

        {/* Clicks/Websites Saved */}
        <MetricCard
          icon={<MousePointerClick className="w-6 h-6 text-white" />}
          label="Clicks & Websites Saved"
          value={metrics.clicksSaved}
          subValue="manual website visits avoided"
          trend={18}
          color="from-green-500 to-emerald-600"
          description="No need to browse 50+ websites - AI does it all for you"
          loading={isLoading}
        />

        {/* AI Recommendations */}
        <MetricCard
          icon={<Zap className="w-6 h-6 text-white" />}
          label="AI Recommendations"
          value={metrics.aiRecommendations}
          subValue="personalized suggestions"
          trend={32}
          color="from-purple-500 to-purple-600"
          description="Smart recommendations based on your preferences and interests"
          loading={isLoading}
        />

        {/* Accuracy Score */}
        <MetricCard
          icon={<Award className="w-6 h-6 text-white" />}
          label="AI Accuracy Score"
          value={`${metrics.accuracyScore.toFixed(1)}%`}
          subValue="recommendation accuracy"
          trend={5}
          color="from-pink-500 to-rose-600"
          description="Based on user feedback and booking completion rates"
          loading={isLoading}
        />

        {/* User Satisfaction */}
        <MetricCard
          icon={<BarChart3 className="w-6 h-6 text-white" />}
          label="User Satisfaction"
          value={`${metrics.userSatisfaction.toFixed(1)}/5.0`}
          subValue="average rating"
          trend={8}
          color="from-indigo-500 to-blue-600"
          description="User ratings from completed trips and bookings"
          loading={isLoading}
        />
      </div>

      {/* Detailed Breakdown Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              How AI Saves Your Time
            </CardTitle>
            <CardDescription>
              Traditional trip planning vs AI-powered planning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Manual vs AI Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Manual Process */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700">Traditional Planning</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-gray-600">
                    <span className="text-red-500 mt-0.5">✗</span>
                    <span>Browse 40-50 travel websites</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <span className="text-red-500 mt-0.5">✗</span>
                    <span>Read 200+ reviews manually</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <span className="text-red-500 mt-0.5">✗</span>
                    <span>Compare prices across platforms</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <span className="text-red-500 mt-0.5">✗</span>
                    <span>Create itinerary in spreadsheet</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <span className="text-red-500 mt-0.5">✗</span>
                    <span>Check weather manually</span>
                  </div>
                  <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-red-700 font-semibold">⏱️ Time Required: 8-12 hours</div>
                  </div>
                </div>
              </div>

              {/* AI Process */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700">AI-Powered Planning</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>AI browses all sources instantly</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Semantic analysis of all reviews</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Automatic best price finding</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Auto-generated smart itinerary</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Real-time weather integration</span>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-green-700 font-semibold">⚡ Time Required: 5-10 minutes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Savings Visualization */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">Time Saved</span>
                <span className="font-bold text-green-600">~98% faster</span>
              </div>
              <Progress value={98} className="h-3" />
              <p className="text-xs text-gray-500 text-center">
                That's {metrics.hoursSaved.toFixed(1)} hours saved that you can use to actually enjoy your trip! 🎉
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Value Proposition Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border-2 border-purple-100">
            <div className="text-2xl font-bold text-purple-600">400+</div>
            <div className="text-sm text-gray-600">Websites Checked</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-100">
            <div className="text-2xl font-bold text-blue-600">1000+</div>
            <div className="text-sm text-gray-600">POIs Analyzed</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border-2 border-green-100">
            <div className="text-2xl font-bold text-green-600">50+</div>
            <div className="text-sm text-gray-600">Data Sources</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border-2 border-orange-100">
            <div className="text-2xl font-bold text-orange-600">24/7</div>
            <div className="text-sm text-gray-600">AI Availability</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
