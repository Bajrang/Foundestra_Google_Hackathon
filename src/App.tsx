import React, { useEffect, useMemo, Suspense, useCallback, useState } from 'react';
import { BookingDialog, BookingData } from './components/BookingDialog';
import { CompleteBookingDialog, CompleteBookingData } from './components/CompleteBookingDialog';
import PlanningPage from './components/pages/PlanningPage';
import { GeneratingPage } from './components/pages/GeneratingPage';
import { ViewingPage } from './components/pages/ViewingPage';
import { APIStatusPage } from './components/pages/APIStatusPage';
import { ToastProvider } from './components/ToastProvider';
import { toast } from 'sonner';
import { useAppState } from './hooks/useAppState';
import { useApiCall } from './hooks/useApiCall';
import { TripData } from './components/TripPlanningForm';

// Simplified Error Boundary
function ErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-6">Please refresh the page to continue</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}

// Simple Error Boundary Class
class SimpleErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  { hasError: boolean }
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}

// Loading Component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const appState = useAppState();
  const { call: apiCall } = useApiCall();
  const [showAPIStatus, setShowAPIStatus] = useState(false);

  // Check URL hash for #api-status to show diagnostic page
  useEffect(() => {
    const checkHash = () => {
      setShowAPIStatus(window.location.hash === '#api-status');
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const {
    state,
    setState,
    isGenerating,
    setIsGenerating,
    itinerary,
    setItinerary,
    itineraryId,
    setItineraryId,
    currentTripData,
    setCurrentTripData,
    weatherAlerts,
    selectedLanguage,
    setSelectedLanguage,
    bookingDialog,
    setBookingDialog,
    completeBookingDialog,
    setCompleteBookingDialog,
    resetState,
    addWeatherAlert
  } = appState;

  const handlePlanTrip = useCallback(async (tripData: TripData) => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setCurrentTripData(tripData);
    setState('generating');

    try {
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 25000)
      );

      const apiPromise = apiCall('generate-itinerary', {
        body: tripData,
        onSuccess: (data) => {
          setItinerary(data.itinerary);
          setItineraryId(data.itineraryId);
          setState('viewing');
          
          const features = [];
          if (tripData.hiddenGems) features.push('hidden gems');
          if (tripData.localExperience) features.push('local experiences');
          if (tripData.photographyFocus) features.push('photo opportunities');
          
          const message = features.length > 0 
            ? `Your personalized itinerary with ${features.join(', ')} has been generated!`
            : 'Your personalized itinerary has been generated!';
            
          toast.success(message);

          if (tripData.bookingPreference === 'immediate') {
            setTimeout(() => setCompleteBookingDialog(true), 1000);
          }
        },
        onError: () => {
          setState('planning');
          toast.error('Failed to generate itinerary. Please try again.');
        }
      });

      await Promise.race([apiPromise, timeoutPromise]);
      
    } catch (error) {
      console.error('Trip planning error:', error);
      setState('planning');
      const message = error instanceof Error && error.message === 'Request timeout' 
        ? 'Request timed out. Please try again.' 
        : 'Failed to generate itinerary. Please try again.';
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  }, [
    isGenerating,
    apiCall,
    setIsGenerating,
    setCurrentTripData,
    setState,
    setItinerary,
    setItineraryId,
    setCompleteBookingDialog
  ]);

  const handleEditActivity = useCallback((activityId: string) => {
    toast.info('Activity editing feature coming soon!');
  }, []);

  const handleBookActivity = useCallback((activity: any) => {
    setBookingDialog({ isOpen: true, activity });
  }, [setBookingDialog]);

  const handleBookCompleteItinerary = useCallback(() => {
    setCompleteBookingDialog(true);
  }, [setCompleteBookingDialog]);

  const handleConfirmBooking = useCallback(async (bookingData: BookingData): Promise<void> => {
    await apiCall('book-activity', {
      body: { itineraryId, ...bookingData },
      successMessage: `Booking confirmed! Confirmation code: ${Math.random().toString(36).substr(2, 9)}`,
      errorMessage: 'Booking failed. Please try again.'
    });
  }, [apiCall, itineraryId]);

  const handleConfirmCompleteBooking = useCallback(async (bookingData: CompleteBookingData): Promise<any> => {
    return await apiCall('book-complete-itinerary', {
      body: { itineraryId, bookingData },
      successMessage: `Complete trip booked! Master code: ${Math.random().toString(36).substr(2, 9)}`,
      errorMessage: 'Complete booking failed. Please try again.'
    });
  }, [apiCall, itineraryId]);

  const handleWeatherAlert = useCallback(async (alertData: any) => {
    try {
      await apiCall('weather-alert', {
        body: alertData,
        onSuccess: (data) => {
          if (data.adjustedItinerary) {
            setItinerary(data.adjustedItinerary);
            addWeatherAlert(alertData);
            toast.warning('Itinerary adjusted due to weather conditions');
          }
        }
      });
    } catch (error) {
      console.error('Weather alert processing error:', error);
    }
  }, [apiCall, setItinerary, addWeatherAlert]);

  // Show API Status page if accessed via #api-status
  if (showAPIStatus) {
    return <APIStatusPage />;
  }

  const content = useMemo(() => {
    switch (state) {
      case 'planning':
        return (
          <PlanningPage
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            onPlanTrip={handlePlanTrip}
            isGenerating={isGenerating}
          />
        );
      case 'generating':
        return <GeneratingPage currentTripData={currentTripData} selectedLanguage={selectedLanguage} />;
      case 'viewing':
        return (
          <ViewingPage
            itinerary={itinerary}
            currentTripData={currentTripData}
            itineraryId={itineraryId}
            weatherAlerts={weatherAlerts}
            onStartOver={resetState}
            onEditActivity={handleEditActivity}
            onBookActivity={handleBookActivity}
            onBookCompleteItinerary={handleBookCompleteItinerary}
            onWeatherAlert={handleWeatherAlert}
            selectedLanguage={selectedLanguage}
          />
        );
      default:
        return <div>Invalid state</div>;
    }
  }, [
    state,
    selectedLanguage,
    handlePlanTrip,
    isGenerating,
    currentTripData,
    itinerary,
    itineraryId,
    weatherAlerts,
    resetState,
    setSelectedLanguage,
    handleEditActivity,
    handleBookActivity,
    handleBookCompleteItinerary,
    handleWeatherAlert
  ]);

  return (
    <>
      {content}
      
      <BookingDialog 
        isOpen={bookingDialog.isOpen}
        onClose={() => setBookingDialog({ isOpen: false, activity: null })}
        activity={bookingDialog.activity}
        onConfirmBooking={handleConfirmBooking}
        selectedLanguage={selectedLanguage}
      />

      <CompleteBookingDialog
        isOpen={completeBookingDialog}
        onClose={() => setCompleteBookingDialog(false)}
        itinerary={itinerary}
        onConfirmBooking={handleConfirmCompleteBooking}
        selectedLanguage={selectedLanguage}
      />
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <SimpleErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <AppContent />
        </Suspense>
      </SimpleErrorBoundary>
    </ToastProvider>
  );
}
