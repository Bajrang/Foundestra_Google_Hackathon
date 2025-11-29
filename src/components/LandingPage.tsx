import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Sparkles, 
  MapPin, 
  Calendar,
  Globe,
  Zap,
  Shield,
  Clock,
  Users,
  Star,
  ChevronRight,
  CloudRain,
  Utensils,
  Camera,
  Heart
} from 'lucide-react';
import { TripData } from './TripPlanningForm';
import { OnboardingWizard } from './OnboardingWizard';
import { LanguageSelector } from './LanguageSelector';
import { Language } from '../utils/translations';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onPlanTrip: (tripData: TripData) => void;
  isGenerating: boolean;
}

export function LandingPage({ onPlanTrip, isGenerating }: LandingPageProps) {
  const [showWizard, setShowWizard] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');

  const sampleItineraries = [
    {
      title: "Jaipur Heritage Weekend",
      titleHindi: "जयपुर विरासत सप्ताहांत",
      duration: "3 Days",
      cost: "₹12,500",
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=250&fit=crop",
      highlights: ["City Palace", "Amber Fort", "Hawa Mahal", "Local Bazaars"],
      highlightsHindi: ["सिटी पैलेस", "आमेर किला", "हवा महल", "स्थानीय बाज़ार"],
      theme: "Heritage & Culture",
      days: [
        { day: 1, activities: ["City Palace Tour", "Jantar Mantar", "Local Lunch"], budget: "₹4,200" },
        { day: 2, activities: ["Amber Fort", "Elephant Ride", "Johari Bazaar"], budget: "₹4,800" },
        { day: 3, activities: ["Hawa Mahal", "Albert Hall", "Departure"], budget: "₹3,500" }
      ]
    },
    {
      title: "Goa Nightlife Getaway",
      duration: "4 Days", 
      cost: "₹18,900",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=250&fit=crop",
      highlights: ["Beach Clubs", "Night Markets", "Water Sports", "Sunset Cruise"],
      theme: "Nightlife & Adventure",
      days: [
        { day: 1, activities: ["Beach Check-in", "Sunset at Anjuna", "Tito's Lane"], budget: "₹4,500" },
        { day: 2, activities: ["Water Sports", "Baga Beach", "Club Cubana"], budget: "₹5,200" },
        { day: 3, activities: ["Spice Plantation", "River Cruise", "Saturday Night Market"], budget: "₹4,800" },
        { day: 4, activities: ["Relaxing Morning", "Shopping", "Departure"], budget: "₹4,400" }
      ]
    },
    {
      title: "Kerala Backwaters Bliss",
      duration: "5 Days",
      cost: "₹22,300", 
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=250&fit=crop",
      highlights: ["Houseboat Stay", "Spice Gardens", "Ayurveda Spa", "Traditional Cuisine"],
      theme: "Nature & Wellness",
      days: [
        { day: 1, activities: ["Cochin Arrival", "Fort Kochi Walk", "Kathakali Show"], budget: "₹3,800" },
        { day: 2, activities: ["Munnar Drive", "Tea Plantation", "Hill Station"], budget: "₹4,600" },
        { day: 3, activities: ["Thekkady Wildlife", "Spice Garden Tour"], budget: "₹4,200" },
        { day: 4, activities: ["Alleppey Houseboat", "Backwater Cruise"], budget: "₹5,500" },
        { day: 5, activities: ["Ayurveda Treatment", "Beach Time", "Departure"], budget: "₹4,200" }
      ]
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b510?w=60&h=60&fit=crop&crop=face",  
      quote: "Saved ₹5,000 on my Rajasthan trip and discovered amazing hidden gems I never would have found!",
      rating: 5,
      trip: "Rajasthan Heritage Tour"
    },
    {
      name: "Arjun Patel",
      location: "Bangalore", 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
      quote: "The AI perfectly matched my love for photography with incredible sunset spots and local experiences.",
      rating: 5,
      trip: "Goa Photography Expedition"
    }
  ];

  const features = [
    {
      icon: Sparkles,
      title: "AI-Generated Itineraries",
      description: "Intelligent trip planning based on your mood, interests, and budget preferences",
      color: "text-purple-600"
    },
    {
      icon: Zap,
      title: "Real-time Smart Adjustments", 
      description: "Dynamic updates for weather, traffic, and local events with instant re-planning",
      color: "text-blue-600",
      example: "If rain → Indoor Museums. If delay → Evening Food Walk."
    },
    {
      icon: Shield,
      title: "One-Click Complete Booking",
      description: "Secure booking for hotels, transport, and all activities with master confirmation",
      color: "text-green-600"
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Available in Hindi, Bengali, Tamil, and more regional languages",
      color: "text-orange-600"
    },
    {
      icon: MapPin,
      title: "Hidden Gems Discovery",
      description: "Uncover local secrets and authentic experiences beyond tourist spots",
      color: "text-red-600"
    },
    {
      icon: Clock,
      title: "Cultural Immersion Focus",
      description: "Deep local experiences with timing optimized for cultural events",
      color: "text-indigo-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-600" />
          <span className="text-xl font-bold text-gray-900">TravelAI</span>
        </div>
        <LanguageSelector 
          selectedLanguage={selectedLanguage as Language}
          onLanguageChange={setSelectedLanguage}
        />
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            AI-Powered Travel Planner
          </h1>
          <p className="text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Plan your trip by mood & budget in seconds
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto">
            Create personalized itineraries with real-time adjustments, hidden gems discovery, 
            and one-click booking for your complete Indian adventure
          </p>
          
          <Button 
            size="lg"
            onClick={() => setShowWizard(true)}
            className="text-xl px-8 py-4 h-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={isGenerating}
          >
            <Sparkles className="w-6 h-6 mr-2" />
            Generate My Itinerary
            <ChevronRight className="w-6 h-6 ml-2" />
          </Button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 leading-relaxed mb-3">{feature.description}</p>
                {feature.example && (
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
                      <CloudRain className="w-4 h-4" />
                      <span>{feature.example}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sample Itineraries */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Itineraries</h2>
            <p className="text-xl text-gray-600">Discover what's possible with AI-powered planning</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {sampleItineraries.map((itinerary, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                <div className="relative">
                  <ImageWithFallback 
                    src={itinerary.image}
                    alt={itinerary.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-900 font-medium">
                      {itinerary.theme}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-600 text-white font-bold text-base px-3 py-1">
                      {itinerary.cost}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl">{itinerary.title}</CardTitle>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {itinerary.duration}
                    </Badge>
                  </div>
                  {selectedLanguage === 'hi' && itinerary.titleHindi && (
                    <p className="text-lg text-purple-600 font-medium">{itinerary.titleHindi}</p>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Highlights:</h4>
                    <div className="flex flex-wrap gap-2">
                      {(selectedLanguage === 'hi' && itinerary.highlightsHindi ? itinerary.highlightsHindi : itinerary.highlights).map((highlight, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Day-by-day breakdown:</h4>
                    <div className="space-y-2">
                      {itinerary.days.map((day, i) => (
                        <div key={i} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                              {day.day}
                            </Badge>
                            <span className="text-gray-600">{day.activities.slice(0, 2).join(', ')}...</span>
                          </div>
                          <span className="font-medium text-green-600">{day.budget}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                    <Camera className="w-4 h-4 mr-2" />
                    View Full Itinerary
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Travelers</h2>
            <p className="text-xl text-gray-600">Join thousands who've discovered smarter travel planning</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <ImageWithFallback 
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-200"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-gray-600">{testimonial.location}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <blockquote className="text-lg text-gray-700 leading-relaxed mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <Badge variant="outline" className="text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    {testimonial.trip}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mb-16">
          <p className="text-gray-600 mb-6">Trusted by 10,000+ travelers • Secure payments • Instant confirmations</p>
          <div className="flex items-center justify-center gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6" />
              <span className="font-medium">Razorpay Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6" />
              <span className="font-medium">Visa Accepted</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6" />
              <span className="font-medium">UPI Payments</span>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 opacity-90">
              Let our AI create the perfect itinerary tailored just for you
            </p>
            <Button 
              size="lg"
              onClick={() => setShowWizard(true)}
              className="text-xl px-8 py-4 h-auto bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isGenerating}
            >
              <Sparkles className="w-6 h-6 mr-2" />
              Start Planning Now
              <ChevronRight className="w-6 h-6 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {showWizard && (
        <OnboardingWizard 
          onClose={() => setShowWizard(false)}
          onComplete={onPlanTrip}
          onPlanTrip={onPlanTrip}
          selectedLanguage={selectedLanguage}
        />
      )}
    </div>
  );
}