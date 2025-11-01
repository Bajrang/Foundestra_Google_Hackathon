import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Heart, 
  Users, 
  Clock,
  Plane,
  Car,
  Train,
  Home,
  Utensils,
  Camera,
  Sparkles,
  Globe
} from 'lucide-react';

interface TripPlanningFormProps {
  onPlanTrip: (tripData: TripData) => void;
  isGenerating: boolean;
}

export interface TripData {
  // Basic Info
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  travelers: number;
  language: string;
  
  // Travel Preferences
  interests: string[];
  travelStyle: string;
  accommodationType: string;
  transportPreference: string[];
  mealPreferences: string[];
  
  // Accessibility & Special Needs
  accessibility: string[];
  
  // Advanced Preferences
  priorityType: string; // budget, experience, comfort, adventure
  groupType: string; // solo, couple, family, friends, business
  localExperience: boolean;
  hiddenGems: boolean;
  photographyFocus: boolean;
  nightlifeImportance: number; // 1-5 scale
  culturalImmersion: number; // 1-5 scale
  adventureLevel: number; // 1-5 scale
  
  // Specific Requirements
  mustVisit: string;
  avoidPlaces: string;
  specialRequests: string;
  
  // Booking Preferences
  flexibleDates: boolean;
  bookingPreference: string; // immediate, review_first, later
}

const interestOptions = [
  { id: 'heritage', label: 'Heritage & Culture', icon: '🏛️' },
  { id: 'street-food', label: 'Street Food & Cuisine', icon: '🍜' },
  { id: 'adventure', label: 'Adventure Sports', icon: '🏔️' },
  { id: 'nightlife', label: 'Nightlife & Entertainment', icon: '🌃' },
  { id: 'nature', label: 'Nature & Wildlife', icon: '🌿' },
  { id: 'art', label: 'Art & Museums', icon: '🎨' },
  { id: 'shopping', label: 'Shopping & Markets', icon: '🛍️' },
  { id: 'photography', label: 'Photography', icon: '📸' },
  { id: 'spiritual', label: 'Spiritual Sites', icon: '🕉️' },
  { id: 'local-life', label: 'Local Life & Experiences', icon: '👥' },
  { id: 'festivals', label: 'Festivals & Events', icon: '🎉' },
  { id: 'wellness', label: 'Wellness & Spa', icon: '🧘' }
];

const accessibilityOptions = [
  'Wheelchair Accessible',
  'Limited Walking',
  'Dietary Restrictions',
  'Senior Friendly',
  'Family Friendly',
  'Hearing Impaired Support',
  'Visual Impaired Support',
  'Medical Conditions'
];

const languageOptions = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'te', name: 'Telugu' },
  { code: 'mr', name: 'Marathi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'pa', name: 'Punjabi' }
];

export function TripPlanningForm({ onPlanTrip, isGenerating }: TripPlanningFormProps) {
  const [step, setStep] = useState(1);
  const [tripData, setTripData] = useState<TripData>({
    destination: '',
    startDate: '',
    endDate: '',
    budget: 25000,
    currency: 'INR',
    travelers: 2,
    language: 'en',
    interests: [],
    travelStyle: 'moderate',
    accommodationType: 'hotel',
    transportPreference: [],
    mealPreferences: [],
    accessibility: [],
    priorityType: 'experience',
    groupType: 'couple',
    localExperience: true,
    hiddenGems: true,
    photographyFocus: false,
    nightlifeImportance: 3,
    culturalImmersion: 4,
    adventureLevel: 3,
    mustVisit: '',
    avoidPlaces: '',
    specialRequests: '',
    flexibleDates: false,
    bookingPreference: 'review_first'
  });

  const handleInterestToggle = (interestId: string) => {
    setTripData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(i => i !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleAccessibilityToggle = (option: string) => {
    setTripData(prev => ({
      ...prev,
      accessibility: prev.accessibility.includes(option)
        ? prev.accessibility.filter(a => a !== option)
        : [...prev.accessibility, option]
    }));
  };

  const handleTransportToggle = (transport: string) => {
    setTripData(prev => ({
      ...prev,
      transportPreference: prev.transportPreference.includes(transport)
        ? prev.transportPreference.filter(t => t !== transport)
        : [...prev.transportPreference, transport]
    }));
  };

  const handleMealToggle = (meal: string) => {
    setTripData(prev => ({
      ...prev,
      mealPreferences: prev.mealPreferences.includes(meal)
        ? prev.mealPreferences.filter(m => m !== meal)
        : [...prev.mealPreferences, meal]
    }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlanTrip(tripData);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return tripData.destination.trim() && 
               tripData.startDate && 
               tripData.endDate && 
               new Date(tripData.endDate) > new Date(tripData.startDate) &&
               tripData.budget >= 1000; // Minimum budget
      case 2:
        return tripData.interests.length > 0;
      case 3:
        return true; // Optional preferences
      case 4:
        return true; // Final review
      default:
        return false;
    }
  };

  const calculateDays = () => {
    if (tripData.startDate && tripData.endDate) {
      const start = new Date(tripData.startDate);
      const end = new Date(tripData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMinEndDate = () => {
    if (tripData.startDate) {
      const start = new Date(tripData.startDate);
      start.setDate(start.getDate() + 1);
      return start.toISOString().split('T')[0];
    }
    return getMinDate();
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Basic Trip Information</h3>
        <p className="text-sm text-muted-foreground">Let's start with the essentials</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="destination" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Destination in India
          </Label>
          <Input
            id="destination"
            placeholder="e.g., Jaipur, Rajasthan or Kerala Backwaters"
            value={tripData.destination}
            onChange={(e) => setTripData(prev => ({ ...prev, destination: e.target.value }))}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Start Date
            </Label>
            <Input
              id="startDate"
              type="date"
              value={tripData.startDate}
              onChange={(e) => setTripData(prev => ({ ...prev, startDate: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={tripData.endDate}
              onChange={(e) => setTripData(prev => ({ ...prev, endDate: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="budget" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Budget per person (₹)
            </Label>
            <Input
              id="budget"
              type="number"
              value={tripData.budget}
              onChange={(e) => setTripData(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="travelers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Travelers
            </Label>
            <Select value={tripData.travelers.toString()} onValueChange={(value) => setTripData(prev => ({ ...prev, travelers: parseInt(value) }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'person' : 'people'}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="language" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Preferred Language
            </Label>
            <Select value={tripData.language} onValueChange={(value) => setTripData(prev => ({ ...prev, language: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Group Type</Label>
          <RadioGroup 
            value={tripData.groupType} 
            onValueChange={(value) => setTripData(prev => ({ ...prev, groupType: value }))}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="solo" id="solo" />
              <Label htmlFor="solo">Solo Travel</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="couple" id="couple" />
              <Label htmlFor="couple">Couple</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="family" id="family" />
              <Label htmlFor="family">Family</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="friends" id="friends" />
              <Label htmlFor="friends">Friends</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="flexibleDates"
            checked={tripData.flexibleDates}
            onCheckedChange={(checked) => setTripData(prev => ({ ...prev, flexibleDates: !!checked }))}
          />
          <Label htmlFor="flexibleDates">My dates are flexible (±2 days)</Label>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Your Travel Interests</h3>
        <p className="text-sm text-muted-foreground">Select all that excite you</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {interestOptions.map(interest => (
          <div
            key={interest.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              tripData.interests.includes(interest.id) 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => handleInterestToggle(interest.id)}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">{interest.icon}</div>
              <p className="text-sm font-medium">{interest.label}</p>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium mb-3 block">Experience Preferences</Label>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Cultural Immersion Level</Label>
              <div className="mt-2">
                <Slider
                  value={[tripData.culturalImmersion]}
                  onValueChange={(value) => setTripData(prev => ({ ...prev, culturalImmersion: value[0] }))}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Tourist spots</span>
                  <span>Deep local culture</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm">Adventure Level</Label>
              <div className="mt-2">
                <Slider
                  value={[tripData.adventureLevel]}
                  onValueChange={(value) => setTripData(prev => ({ ...prev, adventureLevel: value[0] }))}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Relaxed</span>
                  <span>Adrenaline rush</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm">Nightlife Importance</Label>
              <div className="mt-2">
                <Slider
                  value={[tripData.nightlifeImportance]}
                  onValueChange={(value) => setTripData(prev => ({ ...prev, nightlifeImportance: value[0] }))}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Early sleeper</span>
                  <span>Night owl</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="localExperience"
              checked={tripData.localExperience}
              onCheckedChange={(checked) => setTripData(prev => ({ ...prev, localExperience: !!checked }))}
            />
            <Label htmlFor="localExperience">Include local experiences</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hiddenGems"
              checked={tripData.hiddenGems}
              onCheckedChange={(checked) => setTripData(prev => ({ ...prev, hiddenGems: !!checked }))}
            />
            <Label htmlFor="hiddenGems">Discover hidden gems</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="photographyFocus"
              checked={tripData.photographyFocus}
              onCheckedChange={(checked) => setTripData(prev => ({ ...prev, photographyFocus: !!checked }))}
            />
            <Label htmlFor="photographyFocus">Photography-focused spots</Label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Travel Preferences</h3>
        <p className="text-sm text-muted-foreground">Fine-tune your experience</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4" />
            Travel Style
          </Label>
          <RadioGroup 
            value={tripData.travelStyle} 
            onValueChange={(value) => setTripData(prev => ({ ...prev, travelStyle: value }))}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="relaxed" id="relaxed" />
              <Label htmlFor="relaxed">Relaxed - Fewer activities, more rest</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="moderate" />
              <Label htmlFor="moderate">Moderate - Balanced pace</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="packed" id="packed" />
              <Label htmlFor="packed">Packed - Maximum activities</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="flex items-center gap-2 mb-3">
            <Home className="w-4 h-4" />
            Accommodation Type
          </Label>
          <Select value={tripData.accommodationType} onValueChange={(value) => setTripData(prev => ({ ...prev, accommodationType: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="budget">Budget Hotels & Hostels</SelectItem>
              <SelectItem value="hotel">Mid-range Hotels</SelectItem>
              <SelectItem value="luxury">Luxury Hotels & Resorts</SelectItem>
              <SelectItem value="heritage">Heritage & Boutique Hotels</SelectItem>
              <SelectItem value="homestay">Homestays & Local Stays</SelectItem>
              <SelectItem value="mix">Mix of Different Types</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-3 block">Transportation Preferences</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'flight', label: 'Flight', icon: Plane },
              { id: 'train', label: 'Train', icon: Train },
              { id: 'car', label: 'Car/Taxi', icon: Car },
              { id: 'local', label: 'Local Transport', icon: MapPin }
            ].map(({ id, label, icon: Icon }) => (
              <div
                key={id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  tripData.transportPreference.includes(id) 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleTransportToggle(id)}
              >
                <Icon className="w-5 h-5 mx-auto mb-1" />
                <p className="text-sm text-center">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-3 block">Food Preferences</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              'Vegetarian Only',
              'Non-Vegetarian',
              'Vegan Options',
              'Street Food',
              'Fine Dining',
              'Local Cuisine',
              'International Food',
              'Jain Food',
              'Halal Food'
            ].map(meal => (
              <div key={meal} className="flex items-center space-x-2">
                <Checkbox
                  id={meal}
                  checked={tripData.mealPreferences.includes(meal)}
                  onCheckedChange={() => handleMealToggle(meal)}
                />
                <Label htmlFor={meal} className="text-sm">{meal}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-3 block">Priority Type</Label>
          <RadioGroup 
            value={tripData.priorityType} 
            onValueChange={(value) => setTripData(prev => ({ ...prev, priorityType: value }))}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="budget" id="budget" />
              <Label htmlFor="budget">Budget-focused</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="experience" id="experience" />
              <Label htmlFor="experience">Experience-rich</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="comfort" id="comfort" />
              <Label htmlFor="comfort">Comfort-first</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="adventure" id="adventure" />
              <Label htmlFor="adventure">Adventure-packed</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="mb-3 block">Accessibility & Special Needs</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {accessibilityOptions.map(option => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={tripData.accessibility.includes(option)}
                  onCheckedChange={() => handleAccessibilityToggle(option)}
                />
                <Label htmlFor={option} className="text-sm">{option}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Final Touches</h3>
        <p className="text-sm text-muted-foreground">Any specific requirements?</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="mustVisit">Must-visit places or experiences</Label>
          <Textarea
            id="mustVisit"
            placeholder="e.g., Amber Fort in Jaipur, specific restaurants, local festivals..."
            value={tripData.mustVisit}
            onChange={(e) => setTripData(prev => ({ ...prev, mustVisit: e.target.value }))}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="avoidPlaces">Places or activities to avoid</Label>
          <Textarea
            id="avoidPlaces"
            placeholder="e.g., crowded tourist spots, long flights, specific areas..."
            value={tripData.avoidPlaces}
            onChange={(e) => setTripData(prev => ({ ...prev, avoidPlaces: e.target.value }))}
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="specialRequests">Special requests or notes</Label>
          <Textarea
            id="specialRequests"
            placeholder="e.g., celebrating anniversary, birthday surprise, medical requirements..."
            value={tripData.specialRequests}
            onChange={(e) => setTripData(prev => ({ ...prev, specialRequests: e.target.value }))}
            rows={3}
          />
        </div>

        <div>
          <Label className="mb-3 block">Booking Preference</Label>
          <RadioGroup 
            value={tripData.bookingPreference} 
            onValueChange={(value) => setTripData(prev => ({ ...prev, bookingPreference: value }))}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="immediate" id="immediate" />
              <Label htmlFor="immediate">Book immediately after generation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="review_first" id="review_first" />
              <Label htmlFor="review_first">Let me review before booking</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="later" id="later" />
              <Label htmlFor="later">I'll book manually later</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-3">Trip Summary</h4>
          <div className="space-y-2 text-sm">
            <p><strong>Destination:</strong> {tripData.destination}</p>
            <p><strong>Duration:</strong> {tripData.startDate} to {tripData.endDate}</p>
            <p><strong>Budget:</strong> ₹{tripData.budget.toLocaleString()} per person</p>
            <p><strong>Travelers:</strong> {tripData.travelers} {tripData.groupType}</p>
            <p><strong>Interests:</strong> {tripData.interests.length} selected</p>
            <p><strong>Style:</strong> {tripData.travelStyle} pace, {tripData.priorityType}-focused</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          AI Trip Planner
          <Badge variant="outline" className="ml-auto">
            Step {step} of 4
          </Badge>
        </CardTitle>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}

          <div className="flex justify-between pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handlePrevious}
              disabled={step === 1}
            >
              Previous
            </Button>
            
            {step < 4 ? (
              <Button 
                type="button" 
                onClick={handleNext}
                disabled={!isStepValid()}
              >
                Next
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isGenerating || !isStepValid()}
                className="min-w-[200px]"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating Magic...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate AI Itinerary
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}