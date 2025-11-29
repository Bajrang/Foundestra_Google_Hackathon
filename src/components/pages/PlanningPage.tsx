import React from 'react';
import { SmartInputWizard } from '../SmartInputWizard';
import { LanguageSelector } from '../LanguageSelector';
import { CostBreakdownWidget } from '../CostBreakdownWidget';
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
  Lock
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

const FeatureCard: React.FC<{ icon: React.ComponentType<any>; title: string; description: string; children?: React.ReactNode }> = ({ icon: Icon, title, description, children }) => (
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

const SampleItineraryCard: React.FC<{
  title: string;
  duration: string;
  price: string;
  icon: React.ComponentType<any>;
  color: string;
  activities: Array<{ icon: React.ComponentType<any>; text: string }>;
  badge: { icon: React.ComponentType<any>; text: string };
}> = ({ title, duration, price, icon: Icon, color, activities, badge }) => (
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
        {activities.map((activity, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <activity.icon className="w-4 h-4 text-gray-400" />
            <span>{activity.text}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 inline-flex items-center gap-2 text-xs bg-yellow-50 rounded px-2 py-1">
        <badge.icon className="w-4 h-4 text-yellow-600" />
        <span className="text-yellow-700">{badge.text}</span>
      </div>
    </CardContent>
  </Card>
);

const TestimonialCard: React.FC<{ rating: number; review: string; author: string; details: string }> = ({ rating, review, author, details }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center mb-4">
        {Array.from({ length: Math.max(0, rating) }).map((_, i) => (
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

export default function PlanningPage({ selectedLanguage, onLanguageChange, onPlanTrip, isGenerating }: PlanningPageProps) {
  const t = useTranslation(selectedLanguage);

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Generated Itineraries',
      description: 'Intelligent itineraries based on your interests, budget, travel style, and cultural preferences',
      children: (
        <div className="space-y-2 text-sm text-gray-500">
          {['Personalized recommendations', 'Budget optimization', 'Cultural immersion focus'].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      icon: Zap,
      title: 'Real-time Adaptations',
      description: 'Weather alerts, traffic updates, and dynamic itinerary adjustments keep your trip smooth',
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
      title: 'One-Click Booking',
      description: 'Secure booking for accommodations, transport, and all activities with instant confirmation',
      children: (
        <div className="flex items-center justify-between text-xs">
          {['Select', 'Hold', 'Pay', 'Enjoy'].map((step, idx) => (
            <div key={step} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-6 h-6 ${idx === 3 ? 'bg-green-100' : 'bg-blue-100'} rounded-full flex items-center justify-center`}>
                  {idx === 3 ? <CheckCircle className="w-4 h-4 text-green-600" /> : <span className="w-2 h-2 bg-blue-600 rounded-full" />}
                </div>
                <span className="text-gray-500">{step}</span>
              </div>
              {idx < 3 && <div className="flex-1 h-px bg-gray-200 mx-2" />}
            </div>
          ))}
        </div>
      )
    }
  ];

  const sampleItineraries = [
    {
      title: 'Jaipur Heritage',
      duration: '3 days',
      price: '₹15,000',
      icon: Award,
      color: 'bg-orange-100 text-orange-600',
      activities: [
        { icon: Clock, text: '09:00 - Amber Fort visit' },
        { icon: Camera, text: '14:00 - Hawa Mahal photography' },
        { icon: MapPin, text: '18:00 - Johari Bazaar experience' }
      ],
      badge: { icon: Sparkles, text: 'Hidden gems included' }
    },
    {
      title: 'Goa Beaches',
      duration: '4 days',
      price: '₹22,000',
      icon: Heart,
      color: 'bg-blue-100 text-blue-600',
      activities: [
        { icon: Clock, text: '08:00 - Sunrise at Arambol' },
        { icon: Camera, text: '16:00 - Spice plantation tour' },
        { icon: MapPin, text: '20:00 - Night market food walk' }
      ],
      badge: { icon: Users, text: 'Local guides included' }
    },
    {
      title: 'Kerala Backwaters',
      duration: '5 days',
      price: '₹28,500',
      icon: Navigation,
      color: 'bg-green-100 text-green-600',
      activities: [
        { icon: Clock, text: '10:00 - Houseboat cruise' },
        { icon: Camera, text: '15:00 - Spice garden visit' },
        { icon: MapPin, text: '19:00 - Kathakali performance' }
      ],
      badge: { icon: TrendingUp, text: 'Eco-friendly options' }
    }
  ];

  const testimonials = [
    { rating: 5, review: 'Discovered amazing hidden gems in Jaipur...', author: 'Priya S.', details: 'Saved ₹3,200 • Mumbai' },
    { rating: 5, review: 'The weather adaptation feature saved our Kerala trip...', author: 'Rajesh K.', details: 'Found 5 offbeat spots • Delhi' },
    { rating: 5, review: 'One-click booking made everything so easy...', author: 'Anita M.', details: 'Complete cultural immersion • Pune' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">{t.appTitle}</h1>
          </div>
          <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={onLanguageChange} />
        </div>
      </header>

      <main className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <SmartInputWizard onPlanTrip={onPlanTrip} isGenerating={isGenerating} selectedLanguage={selectedLanguage} />

          <section className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {features.map((f, idx) => (
                <div key={idx}>
                  <FeatureCard icon={f.icon} title={f.title} description={f.description}>{f.children}</FeatureCard>
                </div>
              ))}
            </div>

            <div className="mb-16">
              <h3 className="text-2xl font-semibold text-center mb-8">Sample itinerary previews</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sampleItineraries.map((it, i) => (
                  <div key={i}>
                    <SampleItineraryCard title={it.title} duration={it.duration} price={it.price} icon={it.icon} color={it.color} activities={it.activities} badge={it.badge} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-16">
              <h3 className="text-2xl font-semibold mb-4">Perfect on mobile</h3>
              <div className="space-y-4">
                {[{ icon: Smartphone, text: 'Offline itinerary access', color: 'text-blue-600' }, { icon: Share, text: 'Easy sharing with travel companions', color: 'text-green-600' }, { icon: Download, text: 'PDF export for backup', color: 'text-purple-600' }].map((m, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <m.icon className={`w-5 h-5 ${m.color}`} />
                    <span>{m.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-16">
              <h3 className="text-2xl font-semibold text-center mb-8">Transparent pricing with no surprises</h3>
              <CostBreakdownWidget />
            </div>
          </section>

          <section className="py-20 px-6 bg-white/50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Loved by travelers across India</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((tst, i) => (
                  <div key={i}>
                    <TestimonialCard rating={tst.rating} review={tst.review} author={tst.author} details={tst.details} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
