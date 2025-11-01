import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Brain, 
  Palette, 
  Heart, 
  Globe, 
  Camera, 
  Utensils, 
  Users, 
  Clock,
  Star,
  TrendingUp,
  Shield,
  Zap,
  Moon,
  Sun,
  Accessibility,
  Volume2,
  VolumeX,
  Smartphone,
  MapPin,
  Calendar,
  Sparkles,
  Target,
  Award,
  Coffee,
  Briefcase,
  Car,
  Home
} from 'lucide-react';
import { useApiCall } from '../hooks/useApiCall';

interface PersonalizationProfile {
  travelPersonality: {
    explorerType: 'adventurer' | 'cultural' | 'relaxer' | 'foodie' | 'photographer';
    socialStyle: 'solo' | 'couple' | 'family' | 'group' | 'business';
    pacePreference: 'slow' | 'moderate' | 'fast';
    spontaneityLevel: number; // 1-10
  };
  culturalPreferences: {
    languages: string[];
    cuisinePreferences: string[];
    religiousConsiderations: string[];
    festivalInterest: number; // 1-10
    localInteractionLevel: number; // 1-10
  };
  accessibilityNeeds: {
    mobilityAssistance: boolean;
    visualAssistance: boolean;
    hearingAssistance: boolean;
    dietaryRestrictions: string[];
    medicationReminders: boolean;
    emergencyContacts: Array<{ name: string; phone: string; relation: string }>;
  };
  smartPreferences: {
    weatherSensitivity: number; // 1-10
    crowdTolerance: number; // 1-10
    budgetFlexibility: number; // 1-10
    bookingPreference: 'immediate' | 'review_first' | 'compare_always';
    communicationStyle: 'text' | 'voice' | 'visual';
    learningStyle: 'detailed' | 'summary' | 'interactive';
  };
  behavioralInsights: {
    preferredTimeSlots: string[];
    activityDuration: 'short' | 'medium' | 'long';
    photoIntensity: number; // 1-10
    shoppingInterest: number; // 1-10
    nightlifeImportance: number; // 1-10
    natureConnectedness: number; // 1-10
  };
  aiPersonalization: {
    learningFromHistory: boolean;
    adaptiveRecommendations: boolean;
    predictiveAlerts: boolean;
    contextualSuggestions: boolean;
    personalizedContent: boolean;
  };
}

interface AdvancedPersonalizationProps {
  onProfileUpdate: (profile: PersonalizationProfile) => void;
  currentProfile?: Partial<PersonalizationProfile>;
  isVisible: boolean;
}

export function AdvancedPersonalization({ 
  onProfileUpdate, 
  currentProfile = {}, 
  isVisible 
}: AdvancedPersonalizationProps) {
  const [profile, setProfile] = useState<PersonalizationProfile>({
    travelPersonality: {
      explorerType: 'cultural',
      socialStyle: 'couple',
      pacePreference: 'moderate',
      spontaneityLevel: 5,
      ...currentProfile.travelPersonality
    },
    culturalPreferences: {
      languages: ['English'],
      cuisinePreferences: ['local'],
      religiousConsiderations: [],
      festivalInterest: 7,
      localInteractionLevel: 6,
      ...currentProfile.culturalPreferences
    },
    accessibilityNeeds: {
      mobilityAssistance: false,
      visualAssistance: false,
      hearingAssistance: false,
      dietaryRestrictions: [],
      medicationReminders: false,
      emergencyContacts: [],
      ...currentProfile.accessibilityNeeds
    },
    smartPreferences: {
      weatherSensitivity: 7,
      crowdTolerance: 5,
      budgetFlexibility: 6,
      bookingPreference: 'review_first',
      communicationStyle: 'text',
      learningStyle: 'summary',
      ...currentProfile.smartPreferences
    },
    behavioralInsights: {
      preferredTimeSlots: ['morning', 'afternoon'],
      activityDuration: 'medium',
      photoIntensity: 7,
      shoppingInterest: 5,
      nightlifeImportance: 4,
      natureConnectedness: 6,
      ...currentProfile.behavioralInsights
    },
    aiPersonalization: {
      learningFromHistory: true,
      adaptiveRecommendations: true,
      predictiveAlerts: true,
      contextualSuggestions: true,
      personalizedContent: true,
      ...currentProfile.aiPersonalization
    }
  });

  const [currentSection, setCurrentSection] = useState(0);
  const { call: apiCall } = useApiCall();

  const sections = [
    { id: 'personality', title: 'Travel Personality', icon: Brain },
    { id: 'cultural', title: 'Cultural Preferences', icon: Globe },
    { id: 'accessibility', title: 'Accessibility Needs', icon: Accessibility },
    { id: 'smart', title: 'Smart Preferences', icon: Zap },
    { id: 'behavioral', title: 'Behavioral Insights', icon: Target },
    { id: 'ai', title: 'AI Personalization', icon: Sparkles }
  ];

  const updateProfile = (section: keyof PersonalizationProfile, updates: any) => {
    const newProfile = {
      ...profile,
      [section]: { ...profile[section], ...updates }
    };
    setProfile(newProfile);
    onProfileUpdate(newProfile);
  };

  const generateAIInsights = async () => {
    try {
      await apiCall('ai-insights/personality', {
        body: { profile },
        onSuccess: (response) => {
          // Update profile with AI-generated insights
          setProfile(prev => ({
            ...prev,
            ...response.insights
          }));
        }
      });
    } catch (error) {
      console.error('AI insights generation failed:', error);
    }
  };

  if (!isVisible) {
    return null;
  }

  const renderPersonalitySection = () => (
    <div className="space-y-6">
      {/* Explorer Type */}
      <div>
        <Label className="text-lg font-medium mb-4 block">What type of traveler are you?</Label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { id: 'adventurer', label: 'Adventurer', icon: '🏔️', desc: 'Thrill-seeking, outdoor activities' },
            { id: 'cultural', label: 'Cultural Explorer', icon: '🏛️', desc: 'History, art, local traditions' },
            { id: 'relaxer', label: 'Relaxation Seeker', icon: '🧘', desc: 'Spas, beaches, slow travel' },
            { id: 'foodie', label: 'Foodie', icon: '🍜', desc: 'Culinary experiences, local cuisine' },
            { id: 'photographer', label: 'Photographer', icon: '📸', desc: 'Instagram spots, scenic views' }
          ].map((type) => (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                profile.travelPersonality.explorerType === type.id
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => updateProfile('travelPersonality', { explorerType: type.id })}
            >
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{type.icon}</div>
                <div className="font-medium text-sm mb-1">{type.label}</div>
                <div className="text-xs text-gray-600">{type.desc}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Social Style */}
      <div>
        <Label className="text-lg font-medium mb-4 block">Travel Style</Label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { id: 'solo', label: 'Solo Travel', icon: '🚶' },
            { id: 'couple', label: 'Couple', icon: '💑' },
            { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
            { id: 'group', label: 'Group', icon: '👥' },
            { id: 'business', label: 'Business', icon: '💼' }
          ].map((style) => (
            <Card
              key={style.id}
              className={`cursor-pointer transition-all ${
                profile.travelPersonality.socialStyle === style.id
                  ? 'ring-2 ring-purple-500 bg-purple-50'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => updateProfile('travelPersonality', { socialStyle: style.id })}
            >
              <CardContent className="p-3 text-center">
                <div className="text-2xl mb-1">{style.icon}</div>
                <div className="text-sm font-medium">{style.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pace Preference */}
      <div>
        <Label className="text-lg font-medium mb-4 block">Travel Pace</Label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'slow', label: 'Slow & Relaxed', desc: 'Plenty of rest time', icon: '🐌' },
            { id: 'moderate', label: 'Balanced', desc: 'Mix of activities & rest', icon: '⚖️' },
            { id: 'fast', label: 'Packed Schedule', desc: 'Maximum experiences', icon: '⚡' }
          ].map((pace) => (
            <Card
              key={pace.id}
              className={`cursor-pointer transition-all ${
                profile.travelPersonality.pacePreference === pace.id
                  ? 'ring-2 ring-green-500 bg-green-50'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => updateProfile('travelPersonality', { pacePreference: pace.id })}
            >
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{pace.icon}</div>
                <div className="font-medium mb-1">{pace.label}</div>
                <div className="text-xs text-gray-600">{pace.desc}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Spontaneity Level */}
      <div>
        <Label className="text-lg font-medium mb-4 block">
          Spontaneity Level: {profile.travelPersonality.spontaneityLevel}/10
        </Label>
        <div className="space-y-3">
          <Slider
            value={[profile.travelPersonality.spontaneityLevel]}
            onValueChange={([value]) => updateProfile('travelPersonality', { spontaneityLevel: value })}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>Planned & Structured</span>
            <span>Flexible & Spontaneous</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCulturalSection = () => (
    <div className="space-y-6">
      {/* Language Preferences */}
      <div>
        <Label className="text-lg font-medium mb-4 block">Preferred Languages</Label>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {[
            'English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 
            'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Urdu', 'Odia'
          ].map((lang) => (
            <Button
              key={lang}
              variant={profile.culturalPreferences.languages.includes(lang) ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const languages = profile.culturalPreferences.languages.includes(lang)
                  ? profile.culturalPreferences.languages.filter(l => l !== lang)
                  : [...profile.culturalPreferences.languages, lang];
                updateProfile('culturalPreferences', { languages });
              }}
            >
              {lang}
            </Button>
          ))}
        </div>
      </div>

      {/* Cuisine Preferences */}
      <div>
        <Label className="text-lg font-medium mb-4 block">Cuisine Interests</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            'Local/Regional', 'Street Food', 'Fine Dining', 'Vegetarian',
            'Vegan', 'North Indian', 'South Indian', 'Continental',
            'Chinese', 'Italian', 'Seafood', 'Desserts/Sweets'
          ].map((cuisine) => (
            <Button
              key={cuisine}
              variant={profile.culturalPreferences.cuisinePreferences.includes(cuisine) ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const cuisinePreferences = profile.culturalPreferences.cuisinePreferences.includes(cuisine)
                  ? profile.culturalPreferences.cuisinePreferences.filter(c => c !== cuisine)
                  : [...profile.culturalPreferences.cuisinePreferences, cuisine];
                updateProfile('culturalPreferences', { cuisinePreferences });
              }}
            >
              {cuisine}
            </Button>
          ))}
        </div>
      </div>

      {/* Festival Interest */}
      <div>
        <Label className="text-lg font-medium mb-4 block">
          Interest in Local Festivals: {profile.culturalPreferences.festivalInterest}/10
        </Label>
        <Slider
          value={[profile.culturalPreferences.festivalInterest]}
          onValueChange={([value]) => updateProfile('culturalPreferences', { festivalInterest: value })}
          min={1}
          max={10}
          step={1}
          className="w-full"
        />
      </div>

      {/* Local Interaction Level */}
      <div>
        <Label className="text-lg font-medium mb-4 block">
          Comfort with Local Interactions: {profile.culturalPreferences.localInteractionLevel}/10
        </Label>
        <Slider
          value={[profile.culturalPreferences.localInteractionLevel]}
          onValueChange={([value]) => updateProfile('culturalPreferences', { localInteractionLevel: value })}
          min={1}
          max={10}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Prefer guided/structured</span>
          <span>Love meeting locals</span>
        </div>
      </div>
    </div>
  );

  const renderAccessibilitySection = () => (
    <div className="space-y-6">
      {/* Assistance Needs */}
      <div>
        <Label className="text-lg font-medium mb-4 block">Accessibility Requirements</Label>
        <div className="space-y-3">
          {[
            { key: 'mobilityAssistance', label: 'Mobility Assistance', desc: 'Wheelchair access, ramps, elevators' },
            { key: 'visualAssistance', label: 'Visual Assistance', desc: 'Braille, audio guides, high contrast' },
            { key: 'hearingAssistance', label: 'Hearing Assistance', desc: 'Sign language, subtitles, visual alerts' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-gray-600">{item.desc}</div>
              </div>
              <Switch
                checked={profile.accessibilityNeeds[item.key as keyof typeof profile.accessibilityNeeds] as boolean}
                onCheckedChange={(checked) => updateProfile('accessibilityNeeds', { [item.key]: checked })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dietary Restrictions */}
      <div>
        <Label className="text-lg font-medium mb-4 block">Dietary Restrictions</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            'None', 'Vegetarian', 'Vegan', 'Jain', 'Halal', 'Kosher',
            'Gluten-free', 'Dairy-free', 'Nut allergies', 'Diabetic', 'Low sodium', 'Other'
          ].map((restriction) => (
            <Button
              key={restriction}
              variant={profile.accessibilityNeeds.dietaryRestrictions.includes(restriction) ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const restrictions = profile.accessibilityNeeds.dietaryRestrictions.includes(restriction)
                  ? profile.accessibilityNeeds.dietaryRestrictions.filter(r => r !== restriction)
                  : [...profile.accessibilityNeeds.dietaryRestrictions, restriction];
                updateProfile('accessibilityNeeds', { dietaryRestrictions: restrictions });
              }}
            >
              {restriction}
            </Button>
          ))}
        </div>
      </div>

      {/* Emergency Features */}
      <div>
        <Label className="text-lg font-medium mb-4 block">Health & Safety Features</Label>
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <div className="font-medium">Medication Reminders</div>
            <div className="text-sm text-gray-600">Get alerts for medication schedules</div>
          </div>
          <Switch
            checked={profile.accessibilityNeeds.medicationReminders}
            onCheckedChange={(checked) => updateProfile('accessibilityNeeds', { medicationReminders: checked })}
          />
        </div>
      </div>
    </div>
  );

  const renderSmartSection = () => (
    <div className="space-y-6">
      {/* Weather Sensitivity */}
      <div>
        <Label className="text-lg font-medium mb-4 block">
          Weather Sensitivity: {profile.smartPreferences.weatherSensitivity}/10
        </Label>
        <Slider
          value={[profile.smartPreferences.weatherSensitivity]}
          onValueChange={([value]) => updateProfile('smartPreferences', { weatherSensitivity: value })}
          min={1}
          max={10}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Weather doesn't affect plans</span>
          <span>Very weather dependent</span>
        </div>
      </div>

      {/* Crowd Tolerance */}
      <div>
        <Label className="text-lg font-medium mb-4 block">
          Crowd Tolerance: {profile.smartPreferences.crowdTolerance}/10
        </Label>
        <Slider
          value={[profile.smartPreferences.crowdTolerance]}
          onValueChange={([value]) => updateProfile('smartPreferences', { crowdTolerance: value })}
          min={1}
          max={10}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Avoid crowds</span>
          <span>Don't mind busy places</span>
        </div>
      </div>

      {/* Budget Flexibility */}
      <div>
        <Label className="text-lg font-medium mb-4 block">
          Budget Flexibility: {profile.smartPreferences.budgetFlexibility}/10
        </Label>
        <Slider
          value={[profile.smartPreferences.budgetFlexibility]}
          onValueChange={([value]) => updateProfile('smartPreferences', { budgetFlexibility: value })}
          min={1}
          max={10}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Strict budget</span>
          <span>Flexible for experiences</span>
        </div>
      </div>

      {/* Communication & Learning Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-base font-medium mb-3 block">Communication Style</Label>
          <Select
            value={profile.smartPreferences.communicationStyle}
            onValueChange={(value) => updateProfile('smartPreferences', { communicationStyle: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text-based</SelectItem>
              <SelectItem value="voice">Voice/Audio</SelectItem>
              <SelectItem value="visual">Visual/Images</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">Learning Style</Label>
          <Select
            value={profile.smartPreferences.learningStyle}
            onValueChange={(value) => updateProfile('smartPreferences', { learningStyle: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>  
              <SelectItem value="detailed">Detailed Information</SelectItem>
              <SelectItem value="summary">Quick Summaries</SelectItem>
              <SelectItem value="interactive">Interactive Experiences</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderBehavioralSection = () => (
    <div className="space-y-6">
      {/* Preferred Time Slots */}
      <div>
        <Label className="text-lg font-medium mb-4 block">Preferred Activity Times</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { id: 'early_morning', label: 'Early Morning', icon: '🌅' },
            { id: 'morning', label: 'Morning', icon: '☀️' },
            { id: 'afternoon', label: 'Afternoon', icon: '🌞' },
            { id: 'evening', label: 'Evening', icon: '🌇' },
            { id: 'night', label: 'Night', icon: '🌙' },
            { id: 'late_night', label: 'Late Night', icon: '🌃' }
          ].map((time) => (
            <Button
              key={time.id}
              variant={profile.behavioralInsights.preferredTimeSlots.includes(time.id) ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const timeSlots = profile.behavioralInsights.preferredTimeSlots.includes(time.id)
                  ? profile.behavioralInsights.preferredTimeSlots.filter(t => t !== time.id)
                  : [...profile.behavioralInsights.preferredTimeSlots, time.id];
                updateProfile('behavioralInsights', { preferredTimeSlots: timeSlots });
              }}
            >
              <span className="mr-2">{time.icon}</span>
              {time.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Activity Duration */}
      <div>
        <Label className="text-lg font-medium mb-4 block">Preferred Activity Duration</Label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'short', label: 'Short Bursts', desc: '1-2 hours per activity', icon: '⏱️' },
            { id: 'medium', label: 'Medium Length', desc: '2-4 hours per activity', icon: '⏰' },
            { id: 'long', label: 'Deep Dives', desc: '4+ hours per activity', icon: '🕐' }
          ].map((duration) => (
            <Card
              key={duration.id}
              className={`cursor-pointer transition-all ${
                profile.behavioralInsights.activityDuration === duration.id
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => updateProfile('behavioralInsights', { activityDuration: duration.id })}
            >
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{duration.icon}</div>
                <div className="font-medium mb-1">{duration.label}</div>
                <div className="text-xs text-gray-600">{duration.desc}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Interest Levels */}
      <div className="space-y-4">
        {[
          { key: 'photoIntensity', label: 'Photography Interest', icon: '📸' },
          { key: 'shoppingInterest', label: 'Shopping Interest', icon: '🛍️' },
          { key: 'nightlifeImportance', label: 'Nightlife Importance', icon: '🌙' },
          { key: 'natureConnectedness', label: 'Nature Connection', icon: '🌿' }
        ].map((item) => (
          <div key={item.key}>
            <Label className="text-base font-medium mb-3 flex items-center gap-2">
              <span>{item.icon}</span>
              {item.label}: {profile.behavioralInsights[item.key as keyof typeof profile.behavioralInsights]}/10
            </Label>
            <Slider
              value={[profile.behavioralInsights[item.key as keyof typeof profile.behavioralInsights] as number]}
              onValueChange={([value]) => updateProfile('behavioralInsights', { [item.key]: value })}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderAISection = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2">AI-Powered Personalization</h3>
        <p className="text-gray-600">
          Enable advanced AI features to get smarter, more personalized recommendations
        </p>
      </div>

      <div className="space-y-4">
        {[
          {
            key: 'learningFromHistory',
            title: 'Learn from Travel History',
            desc: 'AI analyzes your past trips to improve future recommendations',
            icon: '🧠'
          },
          {
            key: 'adaptiveRecommendations',
            title: 'Adaptive Recommendations',
            desc: 'Suggestions evolve based on your real-time feedback and preferences',
            icon: '🎯'
          },
          {
            key: 'predictiveAlerts',
            title: 'Predictive Alerts',
            desc: 'Get proactive notifications about weather, crowds, and optimal timing',
            icon: '⚡'
          },
          {
            key: 'contextualSuggestions',
            title: 'Contextual Suggestions',
            desc: 'Smart recommendations based on your location, time, and current activity',
            icon: '📍'
          },
          {
            key: 'personalizedContent',
            title: 'Personalized Content',
            desc: 'Custom travel guides, tips, and information tailored to your interests',
            icon: '📖'
          }
        ].map((feature) => (
          <Card key={feature.key} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{feature.icon}</div>
                <div>
                  <div className="font-medium text-lg">{feature.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{feature.desc}</div>
                </div>
              </div>
              <Switch
                checked={profile.aiPersonalization[feature.key as keyof typeof profile.aiPersonalization]}
                onCheckedChange={(checked) => updateProfile('aiPersonalization', { [feature.key]: checked })}
              />
            </div>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6 text-center">
          <Button 
            onClick={generateAIInsights}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Brain className="w-5 h-5 mr-2" />
            Generate AI Personality Insights
          </Button>
          <p className="text-sm text-gray-600 mt-2">
            Get detailed personality analysis and travel recommendations
          </p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Button
                  key={section.id}
                  variant={currentSection === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentSection(index)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {section.title}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Section Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(sections[currentSection].icon, { className: "w-6 h-6" })}
            {sections[currentSection].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentSection === 0 && renderPersonalitySection()}
          {currentSection === 1 && renderCulturalSection()}
          {currentSection === 2 && renderAccessibilitySection()}
          {currentSection === 3 && renderSmartSection()}
          {currentSection === 4 && renderBehavioralSection()}
          {currentSection === 5 && renderAISection()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
        >
          Previous
        </Button>
        
        <div className="text-sm text-gray-500">
          {currentSection + 1} of {sections.length}
        </div>

        <Button
          onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
          disabled={currentSection === sections.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}