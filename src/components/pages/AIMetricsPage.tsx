import React from 'react';
import { AIMetricsDashboard } from '../AIMetricsDashboard';
import { LanguageSelector } from '../LanguageSelector';
import { Button } from '../ui/button';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

interface AIMetricsPageProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  onBack?: () => void;
}

export function AIMetricsPage({ 
  selectedLanguage, 
  onLanguageChange,
  onBack 
}: AIMetricsPageProps) {
  const handleExport = () => {
    console.log('Exporting metrics...');
    // Implement export functionality
  };

  const handleShare = () => {
    console.log('Sharing metrics...');
    // Implement share functionality
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      {/* Header with Language Selector */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Back button */}
            <div className="flex items-center gap-4">
              {onBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Travel Assistant</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Analytics & Performance Metrics</p>
              </div>
            </div>

            {/* Right side - Actions & Language Selector */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-2 hidden md:flex"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-2 hidden md:flex"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={onLanguageChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AIMetricsDashboard showRealTimeUpdates={true} />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center text-sm text-gray-500"
        >
          <p>Powered by Google Cloud Vertex AI • Real-time data updates every 5 seconds</p>
          <p className="mt-2">Last updated: {new Date().toLocaleString()}</p>
        </motion.div>
      </div>
    </div>
  );
}
