import { useState, useCallback, useMemo } from 'react';
import { Itinerary, Activity } from '../components/ItineraryDisplay';
import { TripData } from '../components/TripPlanningForm';
import { Language } from '../utils/translations';

type AppState = 'planning' | 'generating' | 'viewing' | 'editing';

interface WeatherAlert {
  timestamp: string;
  alert: string;
  adjustmentsMade: boolean;
}

interface BookingDialogState {
  isOpen: boolean;
  activity: Activity | null;
}

export function useAppState() {
  const [state, setState] = useState<AppState>('planning');
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [itineraryId, setItineraryId] = useState<string | null>(null);
  const [currentTripData, setCurrentTripData] = useState<TripData | null>(null);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  
  // Booking state
  const [bookingDialog, setBookingDialog] = useState<BookingDialogState>({
    isOpen: false,
    activity: null
  });
  const [completeBookingDialog, setCompleteBookingDialog] = useState(false);

  const resetState = useCallback(() => {
    setState('planning');
    setIsGenerating(false);
    setItinerary(null);
    setItineraryId(null);
    setCurrentTripData(null);
    setWeatherAlerts([]);
    setBookingDialog({ isOpen: false, activity: null });
    setCompleteBookingDialog(false);
  }, []);

  const addWeatherAlert = useCallback((alertData: any) => {
    setWeatherAlerts(prev => [
      ...prev,
      {
        timestamp: new Date().toISOString(),
        alert: alertData.weatherData?.alert || 'Weather alert',
        adjustmentsMade: true
      }
    ]);
  }, []);

  // Memoized state object to prevent unnecessary re-renders
  const stateObject = useMemo(() => ({
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
    setWeatherAlerts,
    selectedLanguage,
    setSelectedLanguage,
    bookingDialog,
    setBookingDialog,
    completeBookingDialog,
    setCompleteBookingDialog,
    resetState,
    addWeatherAlert
  }), [
    state,
    isGenerating,
    itinerary,
    itineraryId,
    currentTripData,
    weatherAlerts,
    selectedLanguage,
    bookingDialog,
    completeBookingDialog,
    resetState,
    addWeatherAlert
  ]);

  return stateObject;
}