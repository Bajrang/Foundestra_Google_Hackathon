import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  Clock,
  Shield,
  CreditCard,
  CheckCircle,
  Lock,
  Users,
  Zap,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface BookingProgressWidgetProps {
  isOpen: boolean;
  currentStage: 'idle' | 'holding' | 'authorizing' | 'confirming' | 'completed' | 'failed';
  onClose?: () => void;
  bookingData?: any;
  selectedLanguage?: string;
}

interface BookingStage {
  id: string;
  title: string;
  titleHindi?: string;
  description: string;
  descriptionHindi?: string;
  icon: any;
  status: 'pending' | 'active' | 'completed' | 'failed';
  estimatedTime: string;
  estimatedTimeHindi?: string;
}

export function BookingProgressWidget({ 
  isOpen, 
  currentStage, 
  onClose, 
  bookingData,
  selectedLanguage = 'en' 
}: BookingProgressWidgetProps) {
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const isHindi = selectedLanguage === 'hi';

  const stages: BookingStage[] = [
    {
      id: 'holding',
      title: 'Hold Inventory',
      titleHindi: 'इन्वेंटरी रोकना',
      description: 'Securing availability with suppliers',
      descriptionHindi: 'आपूर्तिकर्ताओं के साथ उपलब्धता सुरक्षित करना',
      icon: Lock,
      status: 'pending',
      estimatedTime: '30-45 seconds',
      estimatedTimeHindi: '30-45 सेकंड'
    },
    {
      id: 'authorizing',
      title: 'Authorize Payment',
      titleHindi: 'भुगतान प्राधिकरण',
      description: 'Processing payment authorization',
      descriptionHindi: 'भुगतान प्राधिकरण प्रसंस्करण',
      icon: CreditCard,
      status: 'pending',
      estimatedTime: '15-30 seconds',
      estimatedTimeHindi: '15-30 सेकंड'
    },
    {
      id: 'confirming',
      title: 'Confirm Bookings',
      titleHindi: 'बुकिंग पुष्टि',
      description: 'Confirming with all suppliers',
      descriptionHindi: 'सभी आपूर्तिकर्ताओं के साथ पुष्टि',
      icon: CheckCircle,
      status: 'pending',
      estimatedTime: '45-60 seconds',
      estimatedTimeHindi: '45-60 सेकंड'
    },
    {
      id: 'completed',
      title: 'Tickets Issued',
      titleHindi: 'टिकट जारी',
      description: 'All confirmations received',
      descriptionHindi: 'सभी पुष्टि प्राप्त',
      icon: CheckCircle,
      status: 'pending',
      estimatedTime: 'Instant',
      estimatedTimeHindi: 'तुरंत'
    }
  ];

  // Update stage statuses based on current stage
  const getUpdatedStages = () => {
    return stages.map(stage => {
      if (currentStage === 'failed') {
        return { ...stage, status: 'failed' as const };
      }
      
      const stageOrder = ['holding', 'authorizing', 'confirming', 'completed'];
      const currentIndex = stageOrder.indexOf(currentStage);
      const stageIndex = stageOrder.indexOf(stage.id);
      
      if (stageIndex < currentIndex) {
        return { ...stage, status: 'completed' as const };
      } else if (stageIndex === currentIndex) {
        return { ...stage, status: 'active' as const };
      } else {
        return { ...stage, status: 'pending' as const };
      }
    });
  };

  const updatedStages = getUpdatedStages();

  // Calculate progress percentage
  useEffect(() => {
    const stageOrder = ['idle', 'holding', 'authorizing', 'confirming', 'completed'];
    const currentIndex = stageOrder.indexOf(currentStage);
    const newProgress = currentIndex >= 0 ? ((currentIndex) / (stageOrder.length - 1)) * 100 : 0;
    setProgress(newProgress);
  }, [currentStage]);

  // Timer effect
  useEffect(() => {
    if (currentStage !== 'idle' && currentStage !== 'completed' && currentStage !== 'failed') {
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentStage]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'active':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border-green-200';
      case 'active':
        return 'bg-blue-100 border-blue-200';
      case 'failed':
        return 'bg-red-100 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Zap className="w-6 h-6 text-purple-600" />
              {isHindi ? "बुकिंग प्रगति" : "Booking Progress"}
            </CardTitle>
            {(currentStage === 'completed' || currentStage === 'failed') && onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            )}
          </div>
          <div className="space-y-3">
            <Progress value={progress} className="h-3" />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {isHindi ? "बीता समय:" : "Elapsed:"} {formatTime(elapsedTime)}
              </span>
              <span>
                {progress.toFixed(0)}% {isHindi ? "पूर्ण" : "Complete"}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Current Status */}
          {currentStage !== 'idle' && (
            <div className={`p-4 rounded-lg border-2 ${
              currentStage === 'completed' ? 'bg-green-50 border-green-200' :
              currentStage === 'failed' ? 'bg-red-50 border-red-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center gap-3">
                {currentStage === 'completed' ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : currentStage === 'failed' ? (
                  <AlertCircle className="w-8 h-8 text-red-600" />
                ) : (
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                )}
                <div>
                  <h3 className={`font-semibold text-lg ${
                    currentStage === 'completed' ? 'text-green-900' :
                    currentStage === 'failed' ? 'text-red-900' :
                    'text-blue-900'
                  }`}>
                    {currentStage === 'completed' ? (isHindi ? "बुकिंग सफल!" : "Booking Successful!") :
                     currentStage === 'failed' ? (isHindi ? "बुकिंग असफल" : "Booking Failed") :
                     isHindi ? "प्रसंस्करण..." : "Processing..."}
                  </h3>
                  <p className={`text-sm ${
                    currentStage === 'completed' ? 'text-green-700' :
                    currentStage === 'failed' ? 'text-red-700' :
                    'text-blue-700'
                  }`}>
                    {currentStage === 'completed' ? (isHindi ? "आपकी यात्रा बुक हो गई है" : "Your trip has been booked") :
                     currentStage === 'failed' ? (isHindi ? "कृपया दोबारा कोशिश करें" : "Please try again") :
                     isHindi ? "कृपया प्रतीक्षा करें..." : "Please wait..."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Booking Stages */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">
              {isHindi ? "बुकिंग चरण" : "Booking Stages"}
            </h4>
            <div className="space-y-3">
              {updatedStages.map((stage, index) => (
                <div key={stage.id} className={`p-4 rounded-lg border-2 transition-all ${getStatusColor(stage.status)}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {getStatusIcon(stage.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-medium">
                          {isHindi && stage.titleHindi ? stage.titleHindi : stage.title}
                        </h5>
                        <Badge 
                          variant={
                            stage.status === 'completed' ? 'default' :
                            stage.status === 'active' ? 'secondary' :
                            stage.status === 'failed' ? 'destructive' :
                            'outline'
                          }
                          className="text-xs"
                        >
                          {isHindi ? 
                            (stage.estimatedTimeHindi || stage.estimatedTime) : 
                            stage.estimatedTime
                          }
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {isHindi && stage.descriptionHindi ? stage.descriptionHindi : stage.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>{isHindi ? "रेजरपे द्वारा सुरक्षित" : "Razorpay Secured"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>{isHindi ? "वीज़ा स्वीकार्य" : "Visa Accepted"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span>{isHindi ? "UPI भुगतान" : "UPI Payments"}</span>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          {bookingData && currentStage === 'completed' && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">
                {isHindi ? "बुकिंग विवरण" : "Booking Details"}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {isHindi ? "मास्टर कन्फ़र्मेशन:" : "Master Confirmation:"}
                  </span>
                  <span className="font-mono font-bold text-purple-600">
                    {bookingData.masterConfirmationCode || 'TRIP' + Math.random().toString(36).substr(2, 8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {isHindi ? "कुल राशि:" : "Total Amount:"}
                  </span>
                  <span className="font-bold text-green-600">
                    ₹{bookingData.finalAmount?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {isHtml ? "छूट लागू:" : "Discount Applied:"}
                  </span>
                  <span className="font-bold text-orange-600">
                    -₹{bookingData.discountApplied?.toLocaleString() || '0'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {currentStage === 'completed' && (
            <div className="flex gap-3 pt-4">
              <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                {isHindi ? "पुष्टि ईमेल देखें" : "View Confirmation Email"}
              </Button>
              <Button variant="outline" className="flex-1">
                {isHindi ? "PDF डाउनलोड करें" : "Download PDF"}
              </Button>
            </div>
          )}

          {currentStage === 'failed' && (
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                {isHindi ? "रद्द करें" : "Cancel"}
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                {isHindi ? "पुनः प्रयास करें" : "Try Again"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}