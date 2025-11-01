import React from 'react';
import { SmartInputWizard } from '../SmartInputWizard';
import { LanguageSelector } from '../LanguageSelector';
import { CostBreakdownWidget } from '../CostBreakdownWidget';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { 
  Sparkles, 
  CheckCircle, 
  Zap, 
  Shield, 
  Star,
  Clock,
  Camera,
  Users,
  Smartphone,
  Download,
  Share,
  MapPin,
  Award,
  Heart,
  Navigation,
  TrendingUp,
  Wifi,
  Lock,
  Globe
} from 'lucide-react';
import { TripData } from '../TripPlanningForm';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';

interface PlanningPageProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  onPlanTrip: (tripData: TripData) => void;
  isGenerating: boolean;
}

const FeatureCard = ({ icon: Icon, title, description, children }: {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  children?: React.ReactNode;
}) => (
  <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
    <CardContent className="p-8">
      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {children}
    </CardContent>
  </Card>
);

const SampleItineraryCard = ({ title, duration, price, icon: Icon, color, activities, badge }: {
  title: string;
  duration: string;
  price: string;
  icon: React.ComponentType<any>;
  color: string;
  activities: Array<{ icon: React.ComponentType<any>; text: string }>;
  badge: { icon: React.ComponentType<any>; text: string };
}) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm text-gray-500">{duration} • {price}</p>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-2">
            <activity.icon className="w-4 h-4 text-gray-400" />
            <span>{activity.text}</span>
          </div>
        ))}
      </div>
      <Badge variant="secondary" className="mt-3">
        <badge.icon className="w-3 h-3 mr-1" />
        {badge.text}
      </Badge>
    </CardContent>
  </Card>
);

const TestimonialCard = ({ rating, review, author, details }: {
  rating: number;
  review: string;
  author: string;
  details: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-gray-600 mb-4">{review}</p>
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={`/placeholder-avatar-${author.charAt(0).toLowerCase()}.jpg`} alt={author} />
          <AvatarFallback>{author.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-sm">{author}</div>
          <div className="text-xs text-gray-500">{details}</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export function PlanningPage({ selectedLanguage, onLanguageChange, onPlanTrip, isGenerating }: PlanningPageProps) {
  const t = useTranslation(selectedLanguage);
  
  const features = [
    {
      icon: Sparkles,
      title: "AI-Generated Itineraries",
      description: "Intelligent itineraries based on your interests, budget, travel style, and cultural preferences",
      children: (
        <div className="space-y-2 text-sm text-gray-500">
          {["Personalized recommendations", "Budget optimization", "Cultural immersion focus"].map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      icon: Zap,
      title: "Real-time Adaptations",
      description: "Weather alerts, traffic updates, and dynamic itinerary adjustments keep your trip smooth",
      children: (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-orange-50 p-2 rounded border border-orange-200">
            <div className="flex items-center gap-1 text-orange-600 mb-1">
              <Wifi className="w-3 h-3" />
              <span>Original</span>
            </div>
            <div>10 AM - Fort Visit</div>
          </div>
          <div className="bg-green-50 p-2 rounded border border-green-200">
            <div className="flex items-center gap-1 text-green-600 mb-1">
              <CheckCircle className="w-3 h-3" />
              <span>Adapted</span>
            </div>
            <div>10 AM - Indoor Museum</div>
          </div>
        </div>
      )
    },
    {
      icon: Shield,
      title: "One-Click Booking",
      description: "Secure booking for accommodations, transport, and all activities with instant confirmation",
      children: (
        <div className="flex items-center justify-between text-xs">
          {["Select", "Hold", "Pay", "Enjoy"].map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-6 h-6 ${index === 3 ? 'bg-green-100' : 'bg-blue-100'} rounded-full flex items-center justify-center`}>
                  {index === 3 ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                </div>
                <span className="text-gray-500">{step}</span>
              </div>
              {index < 3 && <div className="flex-1 h-px bg-gray-200 mx-2"></div>}
            </React.Fragment>
          ))}
        </div>
      )
    }
  ];

  const sampleItineraries = [
    {
      title: "Jaipur Heritage",
      duration: "3 days",
      price: "₹15,000",
      icon: Award,
      color: "bg-orange-100 text-orange-600",
      activities: [
        { icon: Clock, text: "09:00 - Amber Fort visit" },
        { icon: Camera, text: "14:00 - Hawa Mahal photography" },
        { icon: MapPin, text: "18:00 - Johari Bazaar experience" }
      ],
      badge: { icon: Sparkles, text: "Hidden gems included" }
    },
    {
      title: "Goa Beaches",
      duration: "4 days",
      price: "₹22,000",
      icon: Heart,
      color: "bg-blue-100 text-blue-600",
      activities: [
        { icon: Clock, text: "08:00 - Sunrise at Arambol" },
        { icon: Camera, text: "16:00 - Spice plantation tour" },
        { icon: MapPin, text: "20:00 - Night market food walk" }
      ],
      badge: { icon: Users, text: "Local guides included" }
    },
    {
      title: "Kerala Backwaters",
      duration: "5 days",
      price: "₹28,500",
      icon: Navigation,
      color: "bg-green-100 text-green-600",
      activities: [
        { icon: Clock, text: "10:00 - Houseboat cruise" },
        { icon: Camera, text: "15:00 - Spice garden visit" },
        { icon: MapPin, text: "19:00 - Kathakali performance" }
      ],
      badge: { icon: TrendingUp, text: "Eco-friendly options" }
    }
  ];

  const testimonials = [
    {
      rating: 5,
      review: "Discovered amazing hidden gems in Jaipur I never would have found on my own. The AI suggestions were spot-on for my budget and interests.",
      author: "Priya S.",
      details: "Saved ₹3,200 • Mumbai"
    },
    {
      rating: 5,
      review: "The weather adaptation feature saved our Kerala trip when monsoons hit early. Seamless rebooking and alternative indoor activities.",
      author: "Rajesh K.",
      details: "Found 5 offbeat spots • Delhi"
    },
    {
      rating: 5,
      review: "One-click booking made everything so easy. No more juggling multiple apps and websites. Everything organized in one place.",
      author: "Anita M.",
      details: "Complete cultural immersion • Pune"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">{t.appTitle}</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Destinations</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Support</a>
            </nav>
            
            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              onLanguageChange={onLanguageChange}
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t.planYourTrip}<br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t.appTitle}
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t.planYourTripSubtitle}
          </p>
          
          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-8 mb-12 text-sm text-gray-500">
            {[
              "Estimated itinerary in under 60 seconds",
              "Instant pricing & availability", 
              "Flexible & cancel-friendly options"
            ].map((stat, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{stat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Input Wizard */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <SmartInputWizard onPlanTrip={onPlanTrip} isGenerating={isGenerating} selectedLanguage={selectedLanguage} />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              You will experience travel planning reimagined
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              AI-powered intelligence meets local expertise for unforgettable journeys
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          {/* Cost Transparency Panel */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-center mb-8">Transparent pricing with no surprises</h3>
            <CostBreakdownWidget />
          </div>

          {/* Sample Itinerary Preview */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-center mb-8">Sample itinerary previews</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sampleItineraries.map((itinerary, index) => (
                <SampleItineraryCard key={index} {...itinerary} />
              ))}
            </div>
          </div>

          {/* Mobile Experience */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Perfect on mobile</h3>
              <p className="text-gray-600 mb-6">
                Access your itinerary, get real-time updates, and make bookings on the go
              </p>
              <div className="space-y-4">
                {[
                  { icon: Smartphone, text: "Offline itinerary access", color: "text-blue-600" },
                  { icon: Share, text: "Easy sharing with travel companions", color: "text-green-600" },
                  { icon: Download, text: "PDF export for backup", color: "text-purple-600" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="w-64 h-96 mx-auto bg-gray-900 rounded-3xl p-4 shadow-2xl">
                <div className="w-full h-full bg-white rounded-2xl p-4 overflow-hidden">
                  <div className="text-center mb-4">
                    <h4 className="font-semibold text-sm">Your Trip</h4>
                    <p className="text-xs text-gray-500">Jaipur Heritage • Day 2</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { color: "bg-blue-500", text: "09:00 - City Palace" },
                      { color: "bg-green-500", text: "14:00 - Local lunch" },
                      { color: "bg-purple-500", text: "16:00 - Jantar Mantar" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <div className={`w-2 h-2 ${item.color} rounded-full`}></div>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Loved by travelers across India
            </h2>
            <p className="text-gray-600">Real stories from real travelers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">TravelAI</h3>
                  <p className="text-xs text-gray-400">by Foundestra Team</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                AI-powered travel planning platform that combines cutting-edge technology 
                with local expertise to create authentic, personalized Indian travel experiences.
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                {[
                  { icon: Lock, text: "SSL Secured" },
                  { icon: Shield, text: "ISO 27001 Certified" },
                  { icon: CheckCircle, text: "GDPR Compliant" }
                ].map((badge, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <badge.icon className="w-4 h-4" />
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            {[
              {
                title: "Quick Links",
                links: ["How it Works", "Sample Itineraries", "Destinations", "Travel Guides", "Blog", "API Documentation"]
              },
              {
                title: "Support", 
                links: ["Help Center", "Contact Us", "Live Chat", "WhatsApp Support", "Travel Insurance", "Emergency Assistance"]
              },
              {
                title: "Company",
                links: ["About Foundestra", "Careers", "Press Kit", "Partner Program", "Affiliate Program", "Investor Relations"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4 text-white">{section.title}</h4>
                <div className="space-y-3 text-sm text-gray-400">
                  {section.links.map((link, linkIndex) => (
                    <a key={linkIndex} href="#" className="block hover:text-white transition-colors">{link}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 text-center">
            <div className="text-sm text-gray-400 mb-2">
              © 2024 TravelAI Platform. All rights reserved. 
              <span className="block sm:inline sm:ml-2">
                Proudly developed by <span className="text-white font-medium">Foundestra Team</span>
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Licensed under Creative Commons. Travel data powered by official tourism boards.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}