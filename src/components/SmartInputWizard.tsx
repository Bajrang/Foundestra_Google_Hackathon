import React, { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CustomCalendar } from './ui/custom-calendar';
import { Slider } from './ui/slider';
import { Textarea } from './ui/textarea';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  MapPin,
  IndianRupee,
  Heart,
  Mountain,
  Utensils,
  Camera,
  Users,
  Music,
  Sparkles,
  X,
  Lightbulb,
  TrendingUp,
  Clock,
  Star,
  Zap,
  Target,
  Award,
  Globe,
  Palette,
  Search,
  ArrowRight,
  Check
} from 'lucide-react';
import { format } from 'date-fns';
import { TripData } from './TripPlanningForm';
import { Language } from '../utils/translations';
import { useTranslation } from '../hooks/useTranslation';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface SmartInputWizardProps {
  onPlanTrip: (tripData: TripData) => void;
  isGenerating?: boolean;
  selectedLanguage?: Language;
}

interface AISuggestion {
  type: 'destination' | 'activity' | 'budget' | 'duration';
  content: string;
  reason: string;
  popularity?: number;
  estimated_cost?: number;
  best_season?: string;
}

interface DynamicData {
  suggestions: AISuggestion[];
  estimatedCosts: Record<string, number>;
  popularityScores: Record<string, number>;
  seasonalInfo: Record<string, string>;
  travelTips: string[];
}

const destinations = [
  { name: 'Jaipur', state: 'Rajasthan', tags: ['heritage', 'culture', 'photography'], cost: 15000, duration: '3-4 days', season: 'Oct-Mar' },
  { name: 'Goa', state: 'Goa', tags: ['beaches', 'nightlife', 'relaxation'], cost: 22000, duration: '4-5 days', season: 'Nov-Feb' },
  { name: 'Kerala', state: 'Kerala', tags: ['nature', 'backwaters', 'ayurveda'], cost: 28000, duration: '5-7 days', season: 'Sep-Mar' },
  { name: 'Manali', state: 'Himachal Pradesh', tags: ['adventure', 'mountains', 'trekking'], cost: 20000, duration: '4-5 days', season: 'Mar-Jun' },
  { name: 'Udaipur', state: 'Rajasthan', tags: ['heritage', 'lakes', 'luxury'], cost: 25000, duration: '3-4 days', season: 'Oct-Mar' },
  { name: 'Rishikesh', state: 'Uttarakhand', tags: ['spiritual', 'adventure', 'yoga'], cost: 18000, duration: '3-4 days', season: 'Feb-May' },
  { name: 'Hampi', state: 'Karnataka', tags: ['heritage', 'ruins', 'photography'], cost: 16000, duration: '2-3 days', season: 'Oct-Feb' },
  { name: 'Coorg', state: 'Karnataka', tags: ['nature', 'coffee', 'trekking'], cost: 19000, duration: '3-4 days', season: 'Oct-May' },
];

const interestOptions = [
  { id: 'heritage', label: 'Heritage & Culture', icon: Mountain, color: 'bg-amber-100 text-amber-700', description: 'Ancient sites and cultural experiences' },
  { id: 'adventure', label: 'Adventure Sports', icon: Heart, color: 'bg-red-100 text-red-700', description: 'Thrilling activities and outdoor sports' },
  { id: 'nature', label: 'Nature & Wildlife', icon: Camera, color: 'bg-green-100 text-green-700', description: 'Natural beauty and wildlife encounters' },
  { id: 'food', label: 'Food & Cuisine', icon: Utensils, color: 'bg-orange-100 text-orange-700', description: 'Local food and culinary experiences' },
  { id: 'photography', label: 'Photography', icon: Camera, color: 'bg-purple-100 text-purple-700', description: 'Instagram-worthy spots and scenic views' },
  { id: 'nightlife', label: 'Nightlife & Entertainment', icon: Music, color: 'bg-pink-100 text-pink-700', description: 'Bars, clubs, and evening entertainment' },
  { id: 'spiritual', label: 'Spiritual & Wellness', icon: Heart, color: 'bg-blue-100 text-blue-700', description: 'Temples, meditation, and wellness' },
  { id: 'shopping', label: 'Shopping & Markets', icon: Users, color: 'bg-indigo-100 text-indigo-700', description: 'Local markets and shopping experiences' },
];

export function SmartInputWizard({ onPlanTrip, isGenerating = false, selectedLanguage = 'en' }: SmartInputWizardProps) {
  const t = useTranslation(selectedLanguage);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    destination: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    budget: 25000,
    travelers: 2,
    interests: [] as string[],
    travelStyle: 'moderate' as 'relaxed' | 'moderate' | 'packed',
    priorityType: 'experience' as 'budget' | 'experience' | 'comfort',
  });

  const [dynamicData, setDynamicData] = useState<DynamicData>({
    suggestions: [],
    estimatedCosts: {},
    popularityScores: {},
    seasonalInfo: {},
    travelTips: []
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState('');

  // Fetch AI-powered destination suggestions from the backend
  const fetchAISuggestions = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setAiSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    setSuggestionsError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f7922768/suggest-destinations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            query,
            userInterests: formData.interests
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      setAiSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Error fetching AI suggestions:', error);
      setSuggestionsError('Failed to load suggestions');
      setAiSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Debounce the AI suggestion fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery && searchQuery.trim().length >= 2) {
        fetchAISuggestions(searchQuery);
      } else {
        setAiSuggestions([]);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, formData.interests]);

  // Generate AI suggestions based on current form data
  const generateAISuggestions = useMemo(() => {
    const suggestions: AISuggestion[] = [];
    
    // Destination suggestions based on interests
    if (formData.interests.length > 0) {
      const matchingDestinations = destinations.filter(dest => 
        dest.tags.some(tag => formData.interests.includes(tag))
      );
      
      matchingDestinations.slice(0, 3).forEach(dest => {
        suggestions.push({
          type: 'destination',
          content: `${dest.name}, ${dest.state}`,
          reason: `Perfect for ${formData.interests.join(', ')} lovers`,
          popularity: 85 + Math.random() * 15,
          estimated_cost: dest.cost,
          best_season: dest.season
        });
      });
    }

    // Budget suggestions based on destination
    if (formData.destination) {
      const dest = destinations.find(d => 
        d.name.toLowerCase().includes(formData.destination.toLowerCase())
      );
      if (dest) {
        suggestions.push({
          type: 'budget',
          content: `₹${dest.cost.toLocaleString()} per person`,
          reason: `Recommended budget for ${dest.name} based on ${dest.duration}`,
          estimated_cost: dest.cost
        });
      }
    }

    return suggestions;
  }, [formData.interests, formData.destination]);

  // Dynamic content based on user inputs
  const getDynamicContent = useMemo(() => {
    const content = {
      heroTitle: "Your tailor-made trip,",
      heroSubtitle: "crafted by AI",
      description: "Tell us when, how much you want to spend, what you love—get an itinerary with hidden gems discovery and one-click booking for your complete Indian adventure",
      estimatedBudget: formData.budget,
      estimatedDuration: "3-5 days",
      personalizedTips: [] as string[]
    };

    // Personalize based on selected destination
    if (formData.destination) {
      const matchingDest = destinations.find(d => 
        d.name.toLowerCase().includes(formData.destination.toLowerCase())
      );
      
      if (matchingDest) {
        content.heroTitle = `Your perfect ${matchingDest.name} adventure,`;
        content.description = `Discover the best of ${matchingDest.name} with AI-curated experiences, ${matchingDest.tags.join(', ')}, and seamless bookings`;
        content.estimatedBudget = matchingDest.cost;
        content.estimatedDuration = matchingDest.duration;
        content.personalizedTips = [
          `Best time to visit: ${matchingDest.season}`,
          `Popular for: ${matchingDest.tags.join(', ')}`,
          `Estimated cost: ₹${matchingDest.cost.toLocaleString()} per person`
        ];
      }
    }

    // Personalize based on interests
    if (formData.interests.length > 0) {
      const interestLabels = formData.interests.map(id => 
        interestOptions.find(opt => opt.id === id)?.label
      ).filter(Boolean);
      
      content.heroTitle = `Your ${interestLabels.join(' & ')} adventure,`;
      content.description = `Tailored for ${interestLabels.join(', ')} enthusiasts with AI-powered recommendations and instant booking`;
    }

    // Personalize based on budget
    if (formData.budget !== 25000) {
      if (formData.budget < 15000) {
        content.personalizedTips.push("Budget-friendly options available");
      } else if (formData.budget > 50000) {
        content.personalizedTips.push("Luxury experiences included");
      }
    }

    return content;
  }, [formData]);

  // Filter destinations based on search
  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      // Convert to TripData format and submit
      const tripData: TripData = {
        destination: formData.destination,
        startDate: formData.startDate ? format(formData.startDate, 'yyyy-MM-dd') : '',
        endDate: formData.endDate ? format(formData.endDate, 'yyyy-MM-dd') : '',
        budget: formData.budget,
        currency: 'INR',
        travelers: formData.travelers,
        language: selectedLanguage,
        interests: formData.interests,
        travelStyle: formData.travelStyle,
        accommodationType: formData.priorityType === 'budget' ? 'budget' : formData.priorityType === 'comfort' ? 'luxury' : 'hotel',
        transportPreference: ['train', 'car'],
        mealPreferences: ['local'],
        accessibility: [],
        priorityType: formData.priorityType,
        groupType: formData.travelers === 1 ? 'solo' : formData.travelers === 2 ? 'couple' : 'friends',
        localExperience: true,
        hiddenGems: true,
        photographyFocus: formData.interests.includes('photography'),
        nightlifeImportance: formData.interests.includes('nightlife') ? 4 : 2,
        culturalImmersion: formData.interests.includes('heritage') ? 4 : 3,
        adventureLevel: formData.interests.includes('adventure') ? 4 : 2,
        mustVisit: '',
        avoidPlaces: '',
        specialRequests: '',
        flexibleDates: false,
        bookingPreference: 'review_first'
      };
      
      onPlanTrip(tripData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.destination && formData.startDate && formData.endDate;
      case 1:
        return formData.budget > 0 && formData.travelers > 0;
      case 2:
        return formData.interests.length > 0;
      default:
        return false;
    }
  };

  const progress = ((currentStep + 1) / 3) * 100;

  return (
    <div className="space-y-8">
      {/* Smart Input Wizard */}
      <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Zap className="w-6 h-6 text-purple-600" />
                {t.appTitle}
              </CardTitle>
              <p className="text-gray-600 mt-1">
                {t.planYourTripSubtitle} • {t.day} {currentStep + 1} / 3
              </p>
            </div>
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
          <Progress value={progress} className="h-2 mt-4" />
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Step 1: When & Where */}
          {currentStep === 0 && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-2">{t.destination} & {t.selectDate}</h3>
                <p className="text-gray-600">{t.planYourTripSubtitle}</p>
              </div>

              {/* Smart Destination Input */}
              <div className="space-y-4">
                <Label className="text-lg font-medium">{t.destination}</Label>
                <div className="relative">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder={t.destinationPlaceholder}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="pl-12 text-lg h-14 border-2 border-gray-200 focus:border-purple-400"
                  />
                  
                  {/* AI-Powered Suggestions Dropdown */}
                  {showSuggestions && (searchQuery || formData.interests.length > 0) && (
                    <Card className="absolute z-10 w-full mt-2 shadow-xl border-2 max-h-[500px] overflow-y-auto">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm text-gray-600">Search results</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowSuggestions(false);
                              setSearchQuery('');
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {searchQuery && (
                            <>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-purple-600">
                                  <Sparkles className="w-4 h-4 animate-pulse" />
                                  {isLoadingSuggestions ? 'AI is searching...' : `Suggestions for "${searchQuery}"`}
                                </div>
                                {!isLoadingSuggestions && aiSuggestions.length > 0 && aiSuggestions.some((s: any) => s.isAIEnhanced) && (
                                  <div className="text-xs text-purple-500 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    <span>Powered by Gemini AI</span>
                                  </div>
                                )}
                              </div>
                              
                              {isLoadingSuggestions && (
                                <div className="flex items-center justify-center py-6">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                                </div>
                              )}
                              
                              {!isLoadingSuggestions && suggestionsError && (
                                <div className="text-sm text-red-500 py-2">{suggestionsError}</div>
                              )}
                              
                              {!isLoadingSuggestions && !suggestionsError && aiSuggestions.length > 0 && (
                                <div className="grid gap-2">
                                  {aiSuggestions.map((dest, index) => (
                                    <Button
                                      key={index}
                                      variant="ghost"
                                      className="justify-start h-auto p-3 hover:bg-purple-50 text-left"
                                      onClick={() => {
                                        setFormData(prev => ({ ...prev, destination: dest.name }));
                                        setSearchQuery('');
                                        setShowSuggestions(false);
                                        setAiSuggestions([]);
                                      }}
                                    >
                                      <div className="flex items-start gap-3 w-full">
                                        <MapPin className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <div className="font-semibold text-base">{dest.name}, {dest.state}</div>
                                            {dest.isAIEnhanced && (
                                              <Badge variant="secondary" className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
                                                <Sparkles className="w-3 h-3 mr-1" />
                                                AI Powered
                                              </Badge>
                                            )}
                                            {!dest.isAIEnhanced && dest.aiInsight && (
                                              <Badge variant="secondary" className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-700">
                                                <Sparkles className="w-3 h-3 mr-1" />
                                                Smart Match
                                              </Badge>
                                            )}
                                          </div>
                                          <div className="text-sm text-gray-600 mb-2">{dest.description}</div>
                                          <div className="flex flex-wrap gap-1 mb-2">
                                            {dest.tags.slice(0, 4).map((tag: string, tagIndex: number) => (
                                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                                {tag}
                                              </Badge>
                                            ))}
                                          </div>
                                          <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                              <Clock className="w-3 h-3" />
                                              {dest.duration}
                                            </span>
                                            <span>₹{dest.estimatedCost.toLocaleString()}</span>
                                            <span className="text-purple-600">{dest.bestSeason}</span>
                                          </div>
                                          {dest.aiReason && (
                                            <div className="text-xs text-blue-600 mt-1 italic flex items-center gap-1">
                                              <Sparkles className="w-3 h-3" />
                                              {dest.aiReason}
                                            </div>
                                          )}
                                          {dest.aiInsight && (
                                            <div className="text-xs text-green-600 mt-1 bg-green-50 p-2 rounded">
                                              💡 <span className="font-medium">Insider tip:</span> {dest.aiInsight}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </Button>
                                  ))}
                                </div>
                              )}
                              
                              {!isLoadingSuggestions && !suggestionsError && aiSuggestions.length === 0 && searchQuery.length >= 2 && (
                                <div className="text-sm text-gray-500 py-2">
                                  No matches found. Try searching for popular destinations like "Goa", "Jaipur", or interests like "beaches", "mountains"
                                </div>
                              )}
                            </>
                          )}
                          
                          {formData.interests.length > 0 && generateAISuggestions.length > 0 && (
                            <>
                              <Separator />
                              <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                                <Target className="w-4 h-4" />
                                Based on your interests
                              </div>
                              <div className="grid gap-2">
                                {generateAISuggestions.filter(s => s.type === 'destination').slice(0, 3).map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    variant="ghost"
                                    className="justify-start h-auto p-3 hover:bg-blue-50"
                                    onClick={() => {
                                      setFormData(prev => ({ ...prev, destination: suggestion.content }));
                                      setShowSuggestions(false);
                                    }}
                                  >
                                    <div className="flex items-center gap-3 w-full">
                                      <Star className="w-4 h-4 text-blue-500" />
                                      <div className="text-left flex-1">
                                        <div className="font-medium">{suggestion.content}</div>
                                        <div className="text-sm text-gray-500">{suggestion.reason}</div>
                                      </div>
                                      {suggestion.popularity && (
                                        <Badge variant="secondary">{Math.round(suggestion.popularity)}% match</Badge>
                                      )}
                                    </div>
                                  </Button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Selected Destination Display */}
                {formData.destination && (
                  <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-purple-900">{formData.destination}</div>
                            <div className="text-sm text-purple-700">
                              {getDynamicContent.personalizedTips[0] || 'Great choice!'}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormData(prev => ({ ...prev, destination: '' }))}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700">Start Date</Label>
                  <CustomCalendar
                    selected={formData.startDate}
                    onSelect={(date) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        startDate: date,
                        // Clear end date if it becomes invalid
                        endDate: (prev.endDate && date && prev.endDate <= date) ? undefined : prev.endDate
                      }));
                    }}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    placeholder="Select start date"
                    initialFocus
                  />
                  {formData.startDate && (
                    <p className="text-sm text-green-600 font-medium">
                      ✓ {format(formData.startDate, 'EEEE, MMMM do, yyyy')}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700">End Date</Label>
                  <CustomCalendar
                    selected={formData.endDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                    disabled={(date) => {
                      if (!formData.startDate) return true;
                      
                      const startDate = new Date(formData.startDate);
                      startDate.setHours(0, 0, 0, 0);
                      
                      const compareDate = new Date(date);
                      compareDate.setHours(0, 0, 0, 0);
                      
                      // End date must be after start date (at least next day)
                      return compareDate <= startDate;
                    }}
                    placeholder={formData.startDate ? "Select end date" : "Select start date first"}
                    className={!formData.startDate ? "opacity-50 cursor-not-allowed" : ""}
                    initialFocus
                  />
                  {formData.endDate && (
                    <p className="text-sm text-green-600 font-medium">
                      ✓ {format(formData.endDate, 'EEEE, MMMM do, yyyy')}
                    </p>
                  )}
                  {formData.startDate && formData.endDate && (
                    <div className="space-y-1">
                      <p className="text-sm text-blue-600 font-medium">
                        Duration: {Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                      </p>
                      <p className="text-xs text-gray-500">
                        Trip length: {Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24)) === 1 ? 'Same day trip' : 
                        Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24)) <= 3 ? 'Short getaway' :
                        Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24)) <= 7 ? 'Week-long adventure' : 'Extended journey'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Budget & Style */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-2">Budget & Style</h3>
                <p className="text-gray-600">Set your budget and travel preferences</p>
              </div>

              {/* Smart Budget Slider */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-lg font-medium">Budget per person</Label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <IndianRupee className="h-6 w-6 text-green-600" />
                      <Slider
                        value={[formData.budget]}
                        onValueChange={([value]) => setFormData(prev => ({ ...prev, budget: value }))}
                        min={5000}
                        max={100000}
                        step={2500}
                        className="flex-1"
                      />
                      <div className="text-2xl font-bold text-green-600 min-w-[120px]">
                        ₹{formData.budget.toLocaleString()}
                      </div>
                    </div>
                    
                    {/* Budget Suggestions */}
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <Button
                        variant={formData.budget <= 15000 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, budget: 12000 }))}
                        className="h-auto py-2"
                      >
                        <div className="text-center">
                          <div className="font-medium">Budget</div>
                          <div className="text-xs opacity-80">₹5K - ₹15K</div>
                        </div>
                      </Button>
                      <Button
                        variant={formData.budget > 15000 && formData.budget <= 40000 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, budget: 25000 }))}
                        className="h-auto py-2"
                      >
                        <div className="text-center">
                          <div className="font-medium">Standard</div>
                          <div className="text-xs opacity-80">₹15K - ₹40K</div>
                        </div>
                      </Button>
                      <Button
                        variant={formData.budget > 40000 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, budget: 60000 }))}
                        className="h-auto py-2"
                      >
                        <div className="text-center">
                          <div className="font-medium">Luxury</div>
                          <div className="text-xs opacity-80">₹40K+</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Travelers */}
                <div className="space-y-4">
                  <Label className="text-lg font-medium">Number of travelers</Label>
                  <div className="flex items-center gap-4">
                    <Users className="h-6 w-6 text-blue-600" />
                    <Slider
                      value={[formData.travelers]}
                      onValueChange={([value]) => setFormData(prev => ({ ...prev, travelers: value }))}
                      min={1}
                      max={8}
                      step={1}
                      className="flex-1"
                    />
                    <div className="text-xl font-bold min-w-[100px]">
                      {formData.travelers} {formData.travelers === 1 ? "person" : "people"}
                    </div>
                  </div>
                </div>

                {/* Travel Style & Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="text-lg font-medium">Travel Style</Label>
                    <div className="space-y-3">
                      {[
                        { id: 'relaxed', label: 'Relaxed', desc: 'Slow pace, more rest time', icon: '🧘' },
                        { id: 'moderate', label: 'Balanced', desc: 'Perfect mix of activities', icon: '⚖️' },
                        { id: 'packed', label: 'Adventure-packed', desc: 'Maximum experiences', icon: '⚡' }
                      ].map((style) => (
                        <Card 
                          key={style.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            formData.travelStyle === style.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, travelStyle: style.id as any }))}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{style.icon}</span>
                              <div className="flex-1">
                                <div className="font-medium">{style.label}</div>
                                <div className="text-sm text-gray-600">{style.desc}</div>
                              </div>
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                formData.travelStyle === style.id ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                              }`} />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-lg font-medium">Priority</Label>
                    <div className="space-y-3">
                      {[
                        { id: 'budget', label: 'Budget-focused', desc: 'Best value for money', icon: '💰' },
                        { id: 'experience', label: 'Experience-rich', desc: 'Unique local experiences', icon: '✨' },
                        { id: 'comfort', label: 'Comfort-first', desc: 'Premium accommodations', icon: '🏨' }
                      ].map((priority) => (
                        <Card 
                          key={priority.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            formData.priorityType === priority.id ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, priorityType: priority.id as any }))}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{priority.icon}</span>
                              <div className="flex-1">
                                <div className="font-medium">{priority.label}</div>
                                <div className="text-sm text-gray-600">{priority.desc}</div>
                              </div>
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                formData.priorityType === priority.id ? 'bg-purple-500 border-purple-500' : 'border-gray-300'
                              }`} />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Interests */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-2">What excites you?</h3>
                <p className="text-gray-600">Select your interests to get personalized recommendations</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {interestOptions.map((interest) => (
                  <Card
                    key={interest.id}
                    className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                      formData.interests.includes(interest.id) 
                        ? 'ring-2 ring-purple-500 bg-gradient-to-br from-purple-50 to-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        interests: prev.interests.includes(interest.id)
                          ? prev.interests.filter(i => i !== interest.id)
                          : [...prev.interests, interest.id]
                      }));
                    }}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 rounded-full ${interest.color} flex items-center justify-center mx-auto mb-3`}>
                        <interest.icon className="w-6 h-6" />
                      </div>
                      <div className="font-medium text-sm mb-1">{interest.label}</div>
                      <div className="text-xs text-gray-600 mb-2">{interest.description}</div>
                      {formData.interests.includes(interest.id) && (
                        <Badge className="bg-purple-600 text-white text-xs">Selected</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Selected Interests Summary */}
              {formData.interests.length > 0 && (
                <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Award className="w-6 h-6 text-green-600" />
                      <div>
                        <div className="font-semibold text-green-900">Perfect! Your interests selected:</div>
                        <div className="text-sm text-green-700 mt-1">
                          {formData.interests.map(id => 
                            interestOptions.find(opt => opt.id === id)?.label
                          ).join(', ')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{3 - currentStep} steps remaining</span>
            </div>

            <Button
              onClick={handleNext}
              disabled={!isStepValid() || isGenerating}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 h-12"
            >
              {currentStep === 2 ? (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate My Itinerary
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}