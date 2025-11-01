import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Plane, 
  Train, 
  Car, 
  Hotel, 
  CreditCard, 
  Shield, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Star,
  Wifi,
  Coffee,
  Utensils,
  Zap,
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import { useApiCall } from '../hooks/useApiCall';
import { toast } from 'sonner@2.0.3';

interface EMTBookingOptions {
  flights: Array<{
    id: string;
    airline: string;
    flightNumber: string;
    departure: {
      airport: string;
      time: string;
      city: string;
    };
    arrival: {
      airport: string;
      time: string;
      city: string;
    };
    duration: string;
    price: number;
    class: 'economy' | 'business' | 'first';
    baggage: string;
    amenities: string[];
    cancellationPolicy: string;
    emtDiscount: number;
  }>;
  trains: Array<{
    id: string;
    trainNumber: string;
    trainName: string;
    departure: {
      station: string;
      time: string;
      city: string;
    };
    arrival: {
      station: string;
      time: string;
      city: string;
    };
    duration: string;
    price: number;
    class: '3AC' | '2AC' | '1AC' | 'sleeper';
    availableSeats: number;
    emtDiscount: number;
  }>;
  hotels: Array<{
    id: string;
    name: string;
    rating: number;
    location: string;
    coordinates: [number, number];
    pricePerNight: number;
    totalPrice: number;
    amenities: string[];
    images: string[];
    cancellationPolicy: string;
    emtDiscount: number;
    roomType: string;
    inclusions: string[];
  }>;
  cabs: Array<{
    id: string;
    type: 'sedan' | 'suv' | 'hatchback' | 'luxury';
    provider: string;
    estimatedTime: string;
    price: number;
    features: string[];
    emtDiscount: number;
  }>;
}

interface EMTIntegrationProps {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  onBookingComplete: (bookingData: any) => void;
  isVisible: boolean;
}

export function EMTIntegration({
  destination,
  startDate,
  endDate,
  travelers,
  budget,
  onBookingComplete,
  isVisible
}: EMTIntegrationProps) {
  const [emtOptions, setEmtOptions] = useState<EMTBookingOptions | null>(null);
  const [selectedOptions, setSelectedOptions] = useState({
    flight: '',
    hotel: '',
    train: '',
    cab: ''
  });
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    preferences: {
      mealPreference: 'veg',
      seatPreference: 'window',
      specialRequests: ''
    }
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [emtMembershipTier, setEmtMembershipTier] = useState<'basic' | 'premium' | 'platinum'>('basic');
  const { call: apiCall, loading } = useApiCall();

  const fetchEMTOptions = async () => {
    if (!destination || !startDate || !endDate) return;

    try {
      await apiCall('emt-integration/search', {
        body: {
          destination,
          startDate,
          endDate,
          travelers,
          budget,
          membershipTier: emtMembershipTier
        },
        onSuccess: (response) => {
          setEmtOptions(response.data);
          toast.success('EaseMyTrip options loaded successfully!');
        },
        errorMessage: 'Failed to load EaseMyTrip options'
      });
    } catch (error) {
      console.error('EMT integration error:', error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchEMTOptions();
    }
  }, [destination, startDate, endDate, travelers, budget, isVisible]);

  const calculateTotalCost = () => {
    if (!emtOptions) return 0;
    
    let total = 0;
    
    if (selectedOptions.flight) {
      const flight = emtOptions.flights.find(f => f.id === selectedOptions.flight);
      if (flight) total += flight.price * travelers;
    }
    
    if (selectedOptions.hotel) {
      const hotel = emtOptions.hotels.find(h => h.id === selectedOptions.hotel);
      if (hotel) total += hotel.totalPrice;
    }
    
    if (selectedOptions.train) {
      const train = emtOptions.trains.find(t => t.id === selectedOptions.train);
      if (train) total += train.price * travelers;
    }
    
    if (selectedOptions.cab) {
      const cab = emtOptions.cabs.find(c => c.id === selectedOptions.cab);
      if (cab) total += cab.price;
    }
    
    return total;
  };

  const calculateTotalDiscount = () => {
    if (!emtOptions) return 0;
    
    let discount = 0;
    
    if (selectedOptions.flight) {
      const flight = emtOptions.flights.find(f => f.id === selectedOptions.flight);
      if (flight) discount += flight.emtDiscount * travelers;
    }
    
    if (selectedOptions.hotel) {
      const hotel = emtOptions.hotels.find(h => h.id === selectedOptions.hotel);
      if (hotel) discount += hotel.emtDiscount;
    }
    
    return discount;
  };

  const handleCompleteBooking = async () => {
    const totalCost = calculateTotalCost();
    const totalDiscount = calculateTotalDiscount();
    
    if (totalCost > budget) {
      toast.error(`Total cost (₹${totalCost.toLocaleString()}) exceeds budget (₹${budget.toLocaleString()})`);
      return;
    }

    try {
      await apiCall('emt-integration/book', {
        body: {
          selectedOptions,
          customerDetails,
          paymentMethod,
          totalCost,
          totalDiscount,
          membershipTier: emtMembershipTier,
          travelers,
          destination,
          dates: { startDate, endDate }
        },
        onSuccess: (response) => {
          onBookingComplete({
            bookingId: response.bookingId,
            confirmationCode: response.confirmationCode,
            totalCost,
            totalDiscount,
            emtReference: response.emtReference,
            paymentStatus: response.paymentStatus,
            selectedServices: selectedOptions
          });
          toast.success('Booking confirmed through EaseMyTrip!');
        },
        successMessage: 'Complete trip booked successfully via EaseMyTrip!',
        errorMessage: 'Booking failed. Please try again.'
      });
    } catch (error) {
      console.error('EMT booking error:', error);
    }
  };

  if (!isVisible || !emtOptions) {
    return (
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plane className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-orange-900 mb-2">
            EaseMyTrip Integration
          </h3>
          <p className="text-orange-700 mb-4">
            Complete booking options will be available once itinerary is generated
          </p>
          <Badge className="bg-orange-600 text-white">
            Powered by EaseMyTrip
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* EMT Header */}
      <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">EaseMyTrip Integration</h2>
              <p className="text-orange-100">
                Complete booking solution with exclusive discounts
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">₹{calculateTotalDiscount().toLocaleString()}</div>
              <div className="text-sm text-orange-100">Total Savings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flight Options */}
      {emtOptions.flights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="w-5 h-5" />
              Flight Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emtOptions.flights.slice(0, 3).map((flight) => (
                <div 
                  key={flight.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedOptions.flight === flight.id 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                  onClick={() => setSelectedOptions(prev => ({ ...prev, flight: flight.id }))}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="font-bold text-lg">{flight.airline}</div>
                        <Badge variant="outline">{flight.flightNumber}</Badge>
                        <Badge className="bg-orange-100 text-orange-800">{flight.class}</Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div>
                          <div className="font-medium">{flight.departure.time}</div>
                          <div>{flight.departure.city}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-px bg-gray-300"></div>
                          <Plane className="w-4 h-4" />
                          <div className="w-8 h-px bg-gray-300"></div>
                        </div>
                        <div>
                          <div className="font-medium">{flight.arrival.time}</div>
                          <div>{flight.arrival.city}</div>
                        </div>
                        <div className="text-gray-500">{flight.duration}</div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {flight.amenities.slice(0, 3).map((amenity, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">
                        ₹{flight.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">per person</div>
                      {flight.emtDiscount > 0 && (
                        <div className="text-sm text-green-600 font-medium">
                          Save ₹{flight.emtDiscount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hotel Options */}
      {emtOptions.hotels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hotel className="w-5 h-5" />
              Hotel Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emtOptions.hotels.slice(0, 3).map((hotel) => (
                <div 
                  key={hotel.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedOptions.hotel === hotel.id 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                  onClick={() => setSelectedOptions(prev => ({ ...prev, hotel: hotel.id }))}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="font-bold text-lg">{hotel.name}</div>
                        <div className="flex items-center gap-1">
                          {[...Array(hotel.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {hotel.location}
                        </div>
                        <div className="mt-1">{hotel.roomType}</div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {hotel.amenities.slice(0, 4).map((amenity, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        Inclusions: {hotel.inclusions.join(', ')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">
                        ₹{hotel.totalPrice.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">total stay</div>
                      <div className="text-xs text-gray-500">
                        ₹{hotel.pricePerNight} per night
                      </div>
                      {hotel.emtDiscount > 0 && (
                        <div className="text-sm text-green-600 font-medium">
                          Save ₹{hotel.emtDiscount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Train Options (if available) */}
      {emtOptions.trains.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Train className="w-5 h-5" />
              Train Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emtOptions.trains.slice(0, 2).map((train) => (
                <div 
                  key={train.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedOptions.train === train.id 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                  onClick={() => setSelectedOptions(prev => ({ ...prev, train: train.id }))}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="font-bold">{train.trainName}</div>
                        <Badge variant="outline">{train.trainNumber}</Badge>
                        <Badge className="bg-blue-100 text-blue-800">{train.class}</Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div>
                          <div className="font-medium">{train.departure.time}</div>
                          <div>{train.departure.city}</div>
                        </div>
                        <div className="text-gray-500">{train.duration}</div>
                        <div>
                          <div className="font-medium">{train.arrival.time}</div>
                          <div>{train.arrival.city}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">
                        ₹{train.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">per person</div>
                      <div className="text-xs text-gray-500">
                        {train.availableSeats} seats available
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customer Details */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={customerDetails.name}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={customerDetails.email}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={customerDetails.phone}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="meal">Meal Preference</Label>
              <Select
                value={customerDetails.preferences.mealPreference}
                onValueChange={(value) => setCustomerDetails(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, mealPreference: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="veg">Vegetarian</SelectItem>
                  <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="jain">Jain</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'upi', label: 'UPI', icon: '💳' },
              { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
              { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
              { id: 'wallet', label: 'Digital Wallet', icon: '📱' }
            ].map((method) => (
              <div
                key={method.id}
                className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${
                  paymentMethod === method.id 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
                onClick={() => setPaymentMethod(method.id)}
              >
                <div className="text-2xl mb-1">{method.icon}</div>
                <div className="text-sm font-medium">{method.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Summary & Confirmation */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Booking Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Total Cost</div>
                <div className="text-2xl font-bold text-green-600">
                  ₹{calculateTotalCost().toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Savings</div>
                <div className="text-2xl font-bold text-orange-600">
                  ₹{calculateTotalDiscount().toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Secure payment powered by EaseMyTrip</span>
            </div>

            <Button 
              onClick={handleCompleteBooking}
              disabled={loading || !customerDetails.name || !customerDetails.email || !customerDetails.phone}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg h-12"
            >
              {loading ? (
                <>
                  <Clock className="w-5 h-5 mr-2 animate-spin" />
                  Processing Booking...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Complete Booking - ₹{calculateTotalCost().toLocaleString()}
                </>
              )}
            </Button>

            <div className="text-xs text-gray-500 text-center">
              By proceeding, you agree to EaseMyTrip's terms and conditions
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}