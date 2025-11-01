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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { 
  CreditCard, 
  Calendar, 
  Users, 
  DollarSign,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Phone,
  Mail,
  User,
  MapPin,
  Clock,
  Star,
  Shield,
  Smartphone
} from 'lucide-react';
import { Activity } from './ItineraryDisplay';
import { Language } from '../utils/translations';
import { useTranslation } from '../hooks/useTranslation';

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  onConfirmBooking: (bookingData: BookingData) => Promise<void>;
  selectedLanguage?: Language;
}

export interface BookingData {
  activityId: string;
  participantName: string;
  email: string;
  phone: string;
  participantCount: number;
  specialRequests: string;
  paymentMethod: string;
  cardDetails?: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
  };
}

export function BookingDialog({ 
  isOpen, 
  onClose, 
  activity, 
  onConfirmBooking,
  selectedLanguage = 'en'
}: BookingDialogProps) {
  const t = useTranslation(selectedLanguage);
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [bookingData, setBookingData] = useState<Partial<BookingData>>({
    participantCount: 1,
    paymentMethod: 'card'
  });
  const [confirmationData, setConfirmationData] = useState<any>(null);

  if (!activity) return null;

  const totalCost = (activity.estimatedCost * (bookingData.participantCount || 1));
  const platformFees = Math.round(totalCost * 0.03); // 3% platform fee
  const taxes = Math.round(totalCost * 0.18); // 18% GST
  const finalAmount = totalCost + platformFees + taxes;

  const validateStep = (currentStep: string): boolean => {
    const errors: Record<string, string> = {};
    
    if (currentStep === 'details') {
      if (!bookingData.participantName?.trim()) {
        errors.participantName = 'Name is required';
      }
      if (!bookingData.email?.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!bookingData.phone?.trim()) {
        errors.phone = 'Phone number is required';
      } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(bookingData.phone.replace(/\s/g, ''))) {
        errors.phone = 'Please enter a valid phone number';
      }
      if (!bookingData.participantCount || bookingData.participantCount < 1) {
        errors.participantCount = 'At least 1 participant required';
      }
    }
    
    if (currentStep === 'payment') {
      if (!bookingData.cardDetails?.number?.replace(/\s/g, '')) {
        errors.cardNumber = 'Card number is required';
      } else if (!/^\d{13,19}$/.test(bookingData.cardDetails.number.replace(/\s/g, ''))) {
        errors.cardNumber = 'Please enter a valid card number';
      }
      if (!bookingData.cardDetails?.expiry) {
        errors.expiry = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(bookingData.cardDetails.expiry)) {
        errors.expiry = 'Please enter MM/YY format';
      }
      if (!bookingData.cardDetails?.cvv) {
        errors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(bookingData.cardDetails.cvv)) {
        errors.cvv = 'Please enter 3-4 digits';
      }
      if (!bookingData.cardDetails?.name?.trim()) {
        errors.cardName = 'Cardholder name is required';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      if (step === 'details') {
        setStep('payment');
      } else if (step === 'payment') {
        handleConfirmBooking();
      }
    }
  };

  const handleConfirmBooking = async () => {
    if (!validateStep('payment')) return;
    
    setIsProcessing(true);
    try {
      const fullBookingData: BookingData = {
        activityId: activity.id,
        participantName: bookingData.participantName || '',
        email: bookingData.email || '',
        phone: bookingData.phone || '',
        participantCount: bookingData.participantCount || 1,
        specialRequests: bookingData.specialRequests || '',
        paymentMethod: bookingData.paymentMethod || 'card',
        cardDetails: bookingData.cardDetails
      };

      await onConfirmBooking(fullBookingData);
      setStep('confirmation');
      
      // Generate confirmation data
      setConfirmationData({
        confirmationCode: `CONF${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        bookingId: `BK${Math.random().toString(36).substr(2, 10).toUpperCase()}`,
        amount: finalAmount
      });
    } catch (error) {
      console.error('Booking failed:', error);
      setValidationErrors({ general: 'Booking failed. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits and add spaces every 4 digits
    const v = value.replace(/\D/g, '');
    return v.substring(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCardInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'number') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setBookingData(prev => ({ 
      ...prev, 
      cardDetails: { 
        ...prev.cardDetails, 
        [field]: formattedValue 
      } as any
    }));
    
    // Clear validation error
    const errorField = field === 'number' ? 'cardNumber' : field === 'name' ? 'cardName' : field;
    if (validationErrors[errorField]) {
      setValidationErrors(prev => ({ ...prev, [errorField]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        {step === 'details' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {t.bookActivity}
              </DialogTitle>
              <DialogDescription>
                {t.bookActivity}: {activity.activity}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Activity Summary */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold">{activity.activity}</h4>
                    <p className="text-sm text-muted-foreground">{activity.location}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{activity.startTime} - {activity.endTime}</span>
                      </div>
                      <Badge variant="outline">{activity.type}</Badge>
                    </div>
                    {activity.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{activity.rating}/5</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="participantName" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {t.fullName} *
                  </Label>
                  <Input
                    id="participantName"
                    placeholder={t.fullName}
                    value={bookingData.participantName || ''}
                    onChange={(e) => handleInputChange('participantName', e.target.value)}
                    className={validationErrors.participantName ? 'border-red-500' : ''}
                  />
                  {validationErrors.participantName && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.participantName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={bookingData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={validationErrors.email ? 'border-red-500' : ''}
                    />
                    {validationErrors.email && (
                      <p className="text-sm text-red-500 mt-1">{validationErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      placeholder="+91 98765 43210"
                      value={bookingData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={validationErrors.phone ? 'border-red-500' : ''}
                    />
                    {validationErrors.phone && (
                      <p className="text-sm text-red-500 mt-1">{validationErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="participantCount" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Number of Participants *
                  </Label>
                  <Select 
                    value={bookingData.participantCount?.toString() || '1'} 
                    onValueChange={(value) => handleInputChange('participantCount', value)}
                  >
                    <SelectTrigger className={validationErrors.participantCount ? 'border-red-500' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'person' : 'people'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.participantCount && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.participantCount}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                  <Textarea
                    id="specialRequests"
                    placeholder="Dietary restrictions, accessibility needs, special occasions..."
                    value={bookingData.specialRequests || ''}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Cost Breakdown
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Activity cost (x{bookingData.participantCount || 1})</span>
                    <span>{formatCurrency(totalCost)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Platform fees (3%)</span>
                    <span>{formatCurrency(platformFees)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxes (GST 18%)</span>
                    <span>{formatCurrency(taxes)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total Amount</span>
                    <span className="text-primary">{formatCurrency(finalAmount)}</span>
                  </div>
                </div>
              </div>

              {validationErrors.general && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{validationErrors.general}</AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleNextStep}>
                Continue to Payment
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'payment' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Secure Payment
              </DialogTitle>
              <DialogDescription>
                Complete your booking with secure payment processing
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Final Amount */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Final Amount</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(finalAmount)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Includes all taxes and fees
                </p>
              </div>

              {/* Payment Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={bookingData.cardDetails?.number || ''}
                    onChange={(e) => handleCardInputChange('number', e.target.value)}
                    className={validationErrors.cardNumber ? 'border-red-500' : ''}
                    maxLength={19} // 16 digits + 3 spaces
                  />
                  {validationErrors.cardNumber && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.cardNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="expiry">Expiry Date *</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={bookingData.cardDetails?.expiry || ''}
                      onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                      className={validationErrors.expiry ? 'border-red-500' : ''}
                      maxLength={5}
                    />
                    {validationErrors.expiry && (
                      <p className="text-sm text-red-500 mt-1">{validationErrors.expiry}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={bookingData.cardDetails?.cvv || ''}
                      onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                      className={validationErrors.cvv ? 'border-red-500' : ''}
                      maxLength={4}
                    />
                    {validationErrors.cvv && (
                      <p className="text-sm text-red-500 mt-1">{validationErrors.cvv}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="cardName">Cardholder Name *</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={bookingData.cardDetails?.name || ''}
                    onChange={(e) => handleCardInputChange('name', e.target.value)}
                    className={validationErrors.cardName ? 'border-red-500' : ''}
                  />
                  {validationErrors.cardName && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.cardName}</p>
                  )}
                </div>
              </div>

              {/* Security Notice */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Secure Payment</span>
                </div>
                <p className="text-sm text-green-700">
                  Your payment is protected by bank-level encryption. We never store your card details.
                </p>
              </div>

              {validationErrors.general && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{validationErrors.general}</AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('details')}>
                Back
              </Button>
              <Button onClick={handleNextStep} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Pay {formatCurrency(finalAmount)}
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'confirmation' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Booking Confirmed!
              </DialogTitle>
              <DialogDescription>
                Your activity has been successfully booked
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Confirmation Code */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-center">
                  <h4 className="font-semibold text-green-800 mb-2">
                    Confirmation Code
                  </h4>
                  <div className="text-2xl font-mono font-bold text-green-900 bg-white px-4 py-2 rounded border">
                    {confirmationData?.confirmationCode}
                  </div>
                  <p className="text-sm text-green-600 mt-2">
                    Save this code for your records
                  </p>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="space-y-3">
                <h5 className="font-semibold">Booking Details:</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Activity:</span>
                    <span className="font-medium">{activity.activity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span>{activity.startTime} - {activity.endTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Participants:</span>
                    <span>{bookingData.participantCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span>{activity.location}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Paid:</span>
                    <span className="text-primary">{formatCurrency(confirmationData?.amount || finalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="font-semibold text-blue-800 mb-2">What happens next:</h5>
                <div className="space-y-1 text-sm text-blue-700">
                  <p>• Confirmation email sent to {bookingData.email}</p>
                  <p>• Digital tickets available in your account</p>
                  <p>• SMS reminder 24 hours before activity</p>
                  <p>• 24/7 support available for any queries</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Support: +91-8080808080</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>help@travelai.com</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={onClose} className="w-full">
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}