import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { 
  CreditCard, 
  Calendar, 
  Users, 
  DollarSign,
  CheckCircle,
  Loader2,
  Home,
  Plane,
  MapPin,
  Clock,
  Download,
  Mail,
  Phone
} from 'lucide-react';
import { Itinerary } from './ItineraryDisplay';
import { Language } from '../utils/translations';
import { useTranslation } from '../hooks/useTranslation';

interface CompleteBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: Itinerary | null;
  onConfirmBooking: (bookingData: CompleteBookingData) => Promise<any>;
  selectedLanguage?: Language;
}

export interface CompleteBookingData {
  participantName: string;
  email: string;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  specialRequests: string;
  paymentMethod: string;
  cardDetails?: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
  };
}

export function CompleteBookingDialog({ 
  isOpen, 
  onClose, 
  itinerary, 
  onConfirmBooking,
  selectedLanguage = 'en'
}: CompleteBookingDialogProps) {
  const t = useTranslation(selectedLanguage);
  const [step, setStep] = useState<'review' | 'details' | 'payment' | 'confirmation'>('review');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingData, setBookingData] = useState<Partial<CompleteBookingData>>({
    paymentMethod: 'card'
  });
  const [bookingResult, setBookingResult] = useState<any>(null);

  if (!itinerary) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: itinerary.currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTotalSavings = () => {
    if (itinerary.bookingSummary) {
      return itinerary.totalCost - itinerary.bookingSummary.estimatedSavings;
    }
    return itinerary.totalCost;
  };

  const handleNext = () => {
    if (step === 'review') setStep('details');
    else if (step === 'details') setStep('payment');
    else if (step === 'payment') handleConfirmBooking();
  };

  const handlePrevious = () => {
    if (step === 'payment') setStep('details');
    else if (step === 'details') setStep('review');
  };

  const handleConfirmBooking = async () => {
    setIsProcessing(true);
    try {
      const fullBookingData: CompleteBookingData = {
        participantName: bookingData.participantName || '',
        email: bookingData.email || '',
        phone: bookingData.phone || '',
        emergencyContact: bookingData.emergencyContact || '',
        emergencyPhone: bookingData.emergencyPhone || '',
        specialRequests: bookingData.specialRequests || '',
        paymentMethod: bookingData.paymentMethod || 'card',
        cardDetails: bookingData.cardDetails
      };

      const result = await onConfirmBooking(fullBookingData);
      setBookingResult(result);
      setStep('confirmation');
    } catch (error) {
      console.error('Complete booking failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Review Your Complete Trip</h3>
        <p className="text-sm text-muted-foreground">
          Everything included in one booking - accommodations, transport & activities
        </p>
      </div>

      <div className="grid gap-4">
        {/* Trip Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{itinerary.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Duration</span>
              <span>{itinerary.totalDays} days</span>
            </div>
            <div className="flex justify-between">
              <span>Destination</span>
              <span>{itinerary.destination}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Activities</span>
              <span>{itinerary.bookingSummary?.totalActivities || 0}</span>
            </div>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {itinerary.accommodationCost && (
              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Accommodation
                </span>
                <span>{formatCurrency(itinerary.accommodationCost)}</span>
              </div>
            )}
            {itinerary.transportCost && (
              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  <Plane className="w-4 h-4" />
                  Transport
                </span>
                <span>{formatCurrency(itinerary.transportCost)}</span>
              </div>
            )}
            {itinerary.activityCost && (
              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Activities
                </span>
                <span>{formatCurrency(itinerary.activityCost)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatCurrency(itinerary.totalCost)}</span>
            </div>
            {itinerary.bookingSummary && itinerary.bookingSummary.estimatedSavings > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Bulk Booking Discount</span>
                <span>-{formatCurrency(itinerary.bookingSummary.estimatedSavings)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Amount</span>
              <span className="text-primary">{formatCurrency(getTotalSavings())}</span>
            </div>
          </CardContent>
        </Card>

        {/* What's Included */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">What's Included</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                All accommodation bookings
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Transport arrangements
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Activity reservations
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Digital itinerary & tickets
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                24/7 travel support
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Weather adjustment alerts
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Booking Details</h3>
        <p className="text-sm text-muted-foreground">
          Primary traveler information and emergency contacts
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="participantName">Primary Traveler Name *</Label>
            <Input
              id="participantName"
              value={bookingData.participantName || ''}
              onChange={(e) => setBookingData(prev => ({ 
                ...prev, 
                participantName: e.target.value 
              }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={bookingData.email || ''}
              onChange={(e) => setBookingData(prev => ({ 
                ...prev, 
                email: e.target.value 
              }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              value={bookingData.phone || ''}
              onChange={(e) => setBookingData(prev => ({ 
                ...prev, 
                phone: e.target.value 
              }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
            <Input
              id="emergencyContact"
              value={bookingData.emergencyContact || ''}
              onChange={(e) => setBookingData(prev => ({ 
                ...prev, 
                emergencyContact: e.target.value 
              }))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
          <Input
            id="emergencyPhone"
            value={bookingData.emergencyPhone || ''}
            onChange={(e) => setBookingData(prev => ({ 
              ...prev, 
              emergencyPhone: e.target.value 
            }))}
          />
        </div>

        <div>
          <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
          <Input
            id="specialRequests"
            placeholder="Dietary restrictions, accessibility needs, special occasions..."
            value={bookingData.specialRequests || ''}
            onChange={(e) => setBookingData(prev => ({ 
              ...prev, 
              specialRequests: e.target.value 
            }))}
          />
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Important Information</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Confirmation details will be sent to your email</li>
            <li>• All bookings are subject to availability and confirmation</li>
            <li>• Cancellation policy varies by service provider</li>
            <li>• 24/7 support will be available during your trip</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
        <p className="text-sm text-muted-foreground">
          Complete your booking with secure payment processing
        </p>
      </div>

      <div className="space-y-4">
        {/* Final Amount Summary */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg">Final Amount</span>
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(getTotalSavings())}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Includes all taxes and booking fees
            </p>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={bookingData.cardDetails?.number || ''}
              onChange={(e) => setBookingData(prev => ({ 
                ...prev, 
                cardDetails: { 
                  ...prev.cardDetails, 
                  number: e.target.value 
                } as any
              }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={bookingData.cardDetails?.expiry || ''}
                onChange={(e) => setBookingData(prev => ({ 
                  ...prev, 
                  cardDetails: { 
                    ...prev.cardDetails, 
                    expiry: e.target.value 
                  } as any
                }))}
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={bookingData.cardDetails?.cvv || ''}
                onChange={(e) => setBookingData(prev => ({ 
                  ...prev, 
                  cardDetails: { 
                    ...prev.cardDetails, 
                    cvv: e.target.value 
                  } as any
                }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              placeholder="John Doe"
              value={bookingData.cardDetails?.name || ''}
              onChange={(e) => setBookingData(prev => ({ 
                ...prev, 
                cardDetails: { 
                  ...prev.cardDetails, 
                  name: e.target.value 
                } as any
              }))}
            />
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Secure Payment</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Your payment is protected by bank-level encryption and processed securely.
          </p>
        </div>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          Trip Booked Successfully!
        </h3>
        <p className="text-sm text-muted-foreground">
          Your complete itinerary has been confirmed
        </p>
      </div>

      {bookingResult && (
        <div className="space-y-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-4">
              <div className="text-center">
                <h4 className="font-semibold text-green-800 text-lg mb-2">
                  Master Confirmation Code
                </h4>
                <div className="text-2xl font-mono font-bold text-green-900 bg-white px-4 py-2 rounded border">
                  {bookingResult.booking?.masterConfirmationCode}
                </div>
                <p className="text-sm text-green-700 mt-2">
                  Save this code for all your bookings
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Total Items Booked</span>
                <span>{bookingResult.booking?.individualBookings?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount Paid</span>
                <span className="font-semibold">{formatCurrency(bookingResult.booking?.finalAmount || 0)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Savings Applied</span>
                <span>{formatCurrency(bookingResult.booking?.discountApplied || 0)}</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <h5 className="font-semibold">What happens next:</h5>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p>• Confirmation emails sent to {bookingData.email}</p>
              <p>• Individual booking confirmations generated</p>
              <p>• Digital itinerary accessible in your account</p>
              <p>• 24/7 support team notified of your trip</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download Itinerary
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Mail className="w-4 h-4 mr-2" />
              Email Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const isStepValid = () => {
    switch (step) {
      case 'review':
        return true;
      case 'details':
        return bookingData.participantName && bookingData.email && bookingData.phone;
      case 'payment':
        return bookingData.cardDetails?.number && bookingData.cardDetails?.expiry && 
               bookingData.cardDetails?.cvv && bookingData.cardDetails?.name;
      case 'confirmation':
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Complete Trip Booking
            {step !== 'confirmation' && (
              <Badge variant="outline" className="ml-auto">
                {step === 'review' ? 'Step 1' : step === 'details' ? 'Step 2' : 'Step 3'} of 3
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {step === 'review' && 'Review your complete itinerary and pricing'}
            {step === 'details' && 'Enter traveler details and emergency contacts'}
            {step === 'payment' && 'Complete secure payment for your entire trip'}
            {step === 'confirmation' && 'Your trip has been successfully booked!'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          {step === 'review' && renderReviewStep()}
          {step === 'details' && renderDetailsStep()}
          {step === 'payment' && renderPaymentStep()}
          {step === 'confirmation' && renderConfirmationStep()}
        </ScrollArea>

        {step !== 'confirmation' && (
          <DialogFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={step === 'review' ? onClose : handlePrevious}
            >
              {step === 'review' ? 'Cancel' : 'Previous'}
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={!isStepValid() || isProcessing}
              className="min-w-[120px]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : step === 'payment' ? (
                <>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Pay {formatCurrency(getTotalSavings())}
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </DialogFooter>
        )}

        {step === 'confirmation' && (
          <DialogFooter>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}