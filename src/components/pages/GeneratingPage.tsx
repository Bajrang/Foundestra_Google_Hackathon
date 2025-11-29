import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ProfessionalFooter } from '../ProfessionalFooter';
import { Sparkles } from 'lucide-react';
import { TripData } from '../TripPlanningForm';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';

interface GeneratingPageProps {
  currentTripData: TripData | null;
  selectedLanguage?: Language;
}

const GeneratingStep: React.FC<{ completed: boolean; active: boolean; text: string }> = ({ completed, active, text }) => (
  <div className="flex items-center gap-3">
    <div className={`w-2 h-2 rounded-full ${
      completed ? 'bg-green-500' : 
      active ? 'bg-yellow-500 animate-pulse' : 
      'bg-gray-300'
    }`}></div>
    <span className={active ? 'animate-pulse' : ''}>{text}</span>
  </div>
);

export function GeneratingPage({ currentTripData, selectedLanguage = 'en' }: GeneratingPageProps) {
  const t = useTranslation(selectedLanguage);
  
  const steps = [
    { text: t.analyzingPreferences, completed: true },
    { text: t.fetchingWeather, completed: true },
    { text: t.discoveringActivities, completed: true },
    { text: t.optimizingRoute, active: true, completed: false },
    { text: t.finalizingPlan, completed: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex items-center justify-center p-6 min-h-[80vh]">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 animate-pulse text-primary" />
              {t.creatingItinerary}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                {t.almostReady}
              </p>
            </div>
            
            <div className="space-y-3 text-sm text-gray-500">
              {steps.map((step, index) => (
                <div key={index}>
                  <GeneratingStep 
                    completed={step.completed}
                    active={step.active || false}
                    text={step.text}
                  />
                </div>
              ))}
            </div>

            {currentTripData && (
              <div className="p-3 bg-blue-50 rounded-lg text-sm">
                <p><strong>{t.destination}:</strong> {currentTripData.destination}</p>
                <p><strong>{t.tripDuration}:</strong> {currentTripData.startDate} to {currentTripData.endDate}</p>
                <p><strong>{t.preferences}:</strong> {currentTripData.interests.slice(0, 3).join(', ')}</p>
                <p><strong>{t.budget}:</strong> ₹{currentTripData.budget.toLocaleString()}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <ProfessionalFooter />
    </div>
  );
}