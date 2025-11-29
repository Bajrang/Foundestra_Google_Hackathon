import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
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
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { TripData } from './TripPlanningForm';
import { Language } from '../utils/translations';

interface OnboardingWizardProps {
  onPlanTrip: (tripData: TripData) => void;
  isGenerating?: boolean;
  // Optional external hooks
  onClose?: () => void;
  onComplete?: (tripData: TripData) => void;
  selectedLanguage?: Language;
}

interface WizardStep {
  id: number;
  title: string;
  titleHindi?: string;
  description: string;
  descriptionHindi?: string;
}

const steps: WizardStep[] = [
  {
    id: 1,
    title: "When & Where?",
    titleHindi: "कब और कहाँ?",
    description: "Choose your destination and travel dates",
    descriptionHindi: "अपना गंतव्य और यात्रा की तारीखें चुनें"
  },
  {
    id: 2, 
    title: "Budget & Style",
    titleHindi: "बजट और शैली",
    description: "Set your budget and travel preferences",
    descriptionHindi: "अपना बजट और यात्रा की प्राथमिकताएं सेट करें"
  },
  {
    id: 3,
    title: "Interests & Experiences",
    titleHindi: "रुचियां और अनुभव",
    description: "Tell us what makes you excited about travel",
    descriptionHindi: "बताएं कि यात्रा में आपको क्या रोमांचित करता है"
  }
];

const interestOptions = [
  { id: 'heritage', label: 'Heritage Sites', labelHindi: 'विरासत स्थल', icon: Mountain, color: 'bg-amber-100 text-amber-700' },
  { id: 'street-food', label: 'Street Food', labelHindi: 'स्ट्रीट फूड', icon: Utensils, color: 'bg-red-100 text-red-700' },
  { id: 'nature', label: 'Nature & Wildlife', labelHindi: 'प्रकृति और वन्यजीव', icon: Heart, color: 'bg-green-100 text-green-700' },
  { id: 'photography', label: 'Photography', labelHindi: 'फोटोग्राफी', icon: Camera, color: 'bg-purple-100 text-purple-700' },
  { id: 'nightlife', label: 'Nightlife', labelHindi: 'नाइटलाइफ', icon: Music, color: 'bg-pink-100 text-pink-700' },
  { id: 'shopping', label: 'Shopping', labelHindi: 'शॉपिंग', icon: Users, color: 'bg-blue-100 text-blue-700' },
];

export function OnboardingWizard({ onPlanTrip, isGenerating = false, onClose, onComplete, selectedLanguage = 'en' as Language }: OnboardingWizardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    destination: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    budget: 25000,
    travelers: 2,
    priorityType: 'balanced' as 'budget' | 'balanced' | 'comfort',
    travelStyle: 'moderate' as 'slow' | 'moderate' | 'packed',
    interests: [] as string[],
    culturalImmersion: 3,
    adventureLevel: 3,
    hiddenGems: false,
    localExperience: false,
    photographyFocus: false
  });

  const isHindi = selectedLanguage === 'hi';

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Convert to TripData format and complete
      const tripData: TripData = {
        destination: formData.destination,
        startDate: formData.startDate ? format(formData.startDate, 'yyyy-MM-dd') : '',
        endDate: formData.endDate ? format(formData.endDate, 'yyyy-MM-dd') : '',
        interests: formData.interests,
        budget: formData.budget,
        travelers: formData.travelers,
        travelStyle: formData.travelStyle,
        priorityType: formData.priorityType,
        accommodationType: formData.priorityType === 'budget' ? 'hostel' : formData.priorityType === 'comfort' ? 'hotel' : 'guesthouse',
        transportPreference: ['train', 'taxi'],
        mealPreferences: ['local', 'street-food'],
        localExperience: formData.localExperience,
        hiddenGems: formData.hiddenGems,
        photographyFocus: formData.photographyFocus,
        culturalImmersion: formData.culturalImmersion,
        adventureLevel: formData.adventureLevel,
        nightlifeImportance: formData.interests.includes('nightlife') ? 4 : 2,
        mustVisit: '',
        avoidPlaces: '',
        // Add required fields with defaults
        currency: 'INR',
        accessibility: [],
        groupType: formData.travelers === 1 ? 'solo' : formData.travelers === 2 ? 'couple' : 'group',
        specialRequests: '',
        flexibleDates: false,
        language: selectedLanguage,
        bookingPreference: 'review_first'
      };
      
      setIsOpen(false);
      // notify parent if provided, else use onPlanTrip
      if (onComplete) {
        onComplete(tripData);
      } else {
        onPlanTrip(tripData);
      }

      setCurrentStep(1);
      setFormData({
        destination: '',
        startDate: undefined,
        endDate: undefined,
        budget: 25000,
        travelers: 2,
        priorityType: 'balanced',
        travelStyle: 'moderate',
        interests: [],
        culturalImmersion: 3,
        adventureLevel: 3,
        hiddenGems: false,
        localExperience: false,
        photographyFocus: false
      });
      
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.destination && formData.startDate && formData.endDate;
      case 2:
        return formData.budget > 0 && formData.travelers > 0;
      case 3:
        return formData.interests.length > 0;
      default:
        return false;
    }
  };

  const handleInterestToggle = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const currentStepData = steps.find(step => step.id === currentStep)!;
  const progress = (currentStep / steps.length) * 100;

  return (
    <>
      {/* Landing Page Widget */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Plan Your Perfect Trip
          </CardTitle>
          <p className="text-gray-600">
            Answer 3 quick questions to get your AI-generated itinerary
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Step Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <p className="font-medium text-blue-900">Enter Dates</p>
                <p className="text-sm text-blue-700">When & where to go</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <p className="font-medium text-green-900">Set Budget</p>
                <p className="text-sm text-green-700">Your spending comfort</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <p className="font-medium text-purple-900">Choose Interests</p>
                <p className="text-sm text-purple-700">What excites you</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => setIsOpen(true)}
            disabled={isGenerating}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg h-14"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Generating Your Itinerary...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Start Planning My Trip
              </>
            )}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Free • Takes 2 minutes • AI-powered recommendations
          </p>
        </CardContent>
      </Card>

      {/* Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          setIsOpen(false);
          setCurrentStep(1);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="absolute -top-2 -right-2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-2xl font-bold">
              {isHindi && currentStepData.titleHindi ? currentStepData.titleHindi : currentStepData.title}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {isHindi && currentStepData.descriptionHindi ? currentStepData.descriptionHindi : currentStepData.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Step {currentStep} of {steps.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Step Content */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="destination" className="text-base font-medium">
                    {isHindi ? "गंतव्य" : "Destination"}
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="destination"
                      placeholder={isHindi ? "जैसे: जयपुर, गोवा, केरल..." : "e.g., Jaipur, Goa, Kerala..."}
                      value={formData.destination}
                      onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                      className="pl-10 text-lg h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      {isHindi ? "शुरुआत की तारीख" : "Start Date"}
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start h-12 text-left">
                          <CalendarIcon className="mr-2 h-5 w-5" />
                          {formData.startDate ? format(formData.startDate, 'PPP') : (isHindi ? "तारीख चुनें" : "Pick a date")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date: Date | undefined) => setFormData(prev => ({ ...prev, startDate: date }))}
                          disabled={(date: Date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      {isHindi ? "अंत की तारीख" : "End Date"}
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start h-12 text-left">
                          <CalendarIcon className="mr-2 h-5 w-5" />
                          {formData.endDate ? format(formData.endDate, 'PPP') : (isHindi ? "तारीख चुनें" : "Pick a date")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.endDate}
                          onSelect={(date: Date | undefined) => setFormData(prev => ({ ...prev, endDate: date }))}
                          disabled={(date: Date) => date < (formData.startDate || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    {isHindi ? "बजट प्रति व्यक्ति" : "Budget per person"}
                  </Label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <IndianRupee className="h-5 w-5 text-gray-400" />
                      <Slider
                        value={[formData.budget]}
                        onValueChange={([value]) => setFormData(prev => ({ ...prev, budget: value }))}
                        min={5000}
                        max={100000}
                        step={2500}
                        className="flex-1"
                      />
                      <div className="text-lg font-bold text-green-600 min-w-[100px]">
                        ₹{formData.budget.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>₹5,000</span>
                      <span>₹100,000</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    {isHindi ? "यात्रियों की संख्या" : "Number of travelers"}
                  </Label>
                  <div className="flex items-center gap-4">
                    <Users className="h-5 w-5 text-gray-400" />
                    <Slider
                      value={[formData.travelers]}
                      onValueChange={([value]) => setFormData(prev => ({ ...prev, travelers: value }))}
                      min={1}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <div className="text-lg font-bold min-w-[80px]">
                      {formData.travelers} {formData.travelers === 1 ? (isHindi ? "व्यक्ति" : "person") : (isHindi ? "लोग" : "people")}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-base font-medium">
                      {isHindi ? "प्राथमिकता प्रकार" : "Priority Type"}
                    </Label>
                    <div className="space-y-2">
                      {[
                        { id: 'budget', label: isHindi ? 'बजट-फ्रेंडली' : 'Budget-Friendly', desc: isHindi ? 'पैसे बचाना' : 'Save money' },
                        { id: 'balanced', label: isHindi ? 'संतुलित' : 'Balanced', desc: isHindi ? 'मूल्य और आराम' : 'Value & comfort' },
                        { id: 'comfort', label: isHindi ? 'आरामदायक' : 'Comfort', desc: isHindi ? 'सर्वोत्तम अनुभव' : 'Best experience' }
                      ].map((option) => (
                        <Card 
                          key={option.id}
                          className={`cursor-pointer transition-all ${
                            formData.priorityType === option.id ? 'ring-2 ring-purple-600 bg-purple-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, priorityType: option.id as any }))}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                formData.priorityType === option.id ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
                              }`} />
                              <div>
                                <p className="font-medium">{option.label}</p>
                                <p className="text-sm text-gray-600">{option.desc}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-medium">
                      {isHindi ? "यात्रा शैली" : "Travel Style"}
                    </Label>
                    <div className="space-y-2">
                      {[
                        { id: 'slow', label: isHindi ? 'धीमी' : 'Slow', desc: isHindi ? 'आराम से' : 'Relaxed pace' },
                        { id: 'moderate', label: isHindi ? 'मध्यम' : 'Moderate', desc: isHindi ? 'संतुलित गति' : 'Balanced pace' },
                        { id: 'packed', label: isHindi ? 'भरपूर' : 'Packed', desc: isHindi ? 'अधिक गतिविधियाँ' : 'More activities' }
                      ].map((option) => (
                        <Card 
                          key={option.id}
                          className={`cursor-pointer transition-all ${
                            formData.travelStyle === option.id ? 'ring-2 ring-blue-600 bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, travelStyle: option.id as any }))}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                formData.travelStyle === option.id ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                              }`} />
                              <div>
                                <p className="font-medium">{option.label}</p>
                                <p className="text-sm text-gray-600">{option.desc}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    {isHindi ? "आपकी दिलचस्पियां (कम से कम एक चुनें)" : "Your interests (select at least one)"}
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {interestOptions.map((interest) => (
                      <Card
                        key={interest.id}
                        className={`cursor-pointer transition-all ${
                          formData.interests.includes(interest.id) 
                            ? 'ring-2 ring-purple-600 bg-purple-50' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleInterestToggle(interest.id)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className={`w-12 h-12 rounded-full ${interest.color} flex items-center justify-center mx-auto mb-3`}>
                            <interest.icon className="w-6 h-6" />
                          </div>
                          <p className="font-medium text-sm">
                            {isHindi && interest.labelHindi ? interest.labelHindi : interest.label}
                          </p>
                          {formData.interests.includes(interest.id) && (
                            <div className="mt-2">
                              <Badge className="bg-purple-600 text-white text-xs">
                                {isHindi ? "चुना गया" : "Selected"}
                              </Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="text-base font-medium">
                      {isHindi ? "सांस्कृतिक विसर्जन स्तर" : "Cultural Immersion Level"}
                    </Label>
                    <Slider
                      value={[formData.culturalImmersion]}
                      onValueChange={([value]) => setFormData(prev => ({ ...prev, culturalImmersion: value }))}
                      min={1}
                      max={5}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{isHindi ? "मुख्यधारा" : "Mainstream"}</span>
                      <span>{isHindi ? "गहरा स्थानीय" : "Deep Local"}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-medium">
                      {isHindi ? "साहसिक स्तर" : "Adventure Level"}
                    </Label>
                    <Slider
                      value={[formData.adventureLevel]}
                      onValueChange={([value]) => setFormData(prev => ({ ...prev, adventureLevel: value }))}
                      min={1}
                      max={5}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{isHindi ? "आराम से" : "Relaxed"}</span>
                      <span>{isHindi ? "रोमांचक" : "Thrilling"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    {isHindi ? "विशेष अनुभव" : "Special Experiences"}
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="hiddenGems"
                        checked={formData.hiddenGems}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hiddenGems: !!checked }))}
                      />
                      <Label htmlFor="hiddenGems" className="text-sm">
                        {isHindi ? "छुपे हुए रत्न खोजें" : "Discover hidden gems"}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="localExperience"
                        checked={formData.localExperience}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, localExperience: !!checked }))}
                      />
                      <Label htmlFor="localExperience" className="text-sm">
                        {isHindi ? "स्थानीय अनुभव" : "Local experiences"}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="photographyFocus"
                        checked={formData.photographyFocus}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, photographyFocus: !!checked }))}
                      />
                      <Label htmlFor="photographyFocus" className="text-sm">
                        {isHindi ? "फोटोग्राफी पर ध्यान" : "Photography focus"}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                {isHindi ? "पिछला" : "Back"}
              </Button>

              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {currentStep === 3 ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {isHindi ? "यात्रा योजना तैयार करें" : "Generate My Itinerary"}
                  </>
                ) : (
                  <>
                    {isHindi ? "अगला" : "Next"}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}