import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Download, 
  Share2, 
  FileText, 
  Mail, 
  MessageCircle, 
  Copy,
  QrCode,
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Check,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { Itinerary } from './ItineraryDisplay';

interface ExportShareWidgetProps {
  itinerary: Itinerary;
  selectedLanguage?: string;
}

export function ExportShareWidget({ itinerary, selectedLanguage = 'en' }: ExportShareWidgetProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const isHindi = selectedLanguage === 'hi';

  const generateShareableLink = () => {
    // In production, this would create a shareable link to the itinerary
    return `https://travelai.com/itinerary/${Date.now()}`;
  };

  const handleDownloadPDF = async () => {
    toast.info(isHindi ? 'PDF डाउनलोड शुरू हो रहा है...' : 'Starting PDF download...');
    
    // Simulate PDF generation
    setTimeout(() => {
      // In production, this would call a service to generate the PDF
      const link = document.createElement('a');
      link.href = 'data:application/pdf;base64,'; // Would be actual PDF data
      link.download = `${itinerary.title.replace(/\s+/g, '_')}_Itinerary.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(isHindi ? 'PDF डाउनलोड पूरा!' : 'PDF download completed!');
    }, 1500);
  };

  const handleCopyLink = async () => {
    const shareableLink = generateShareableLink();
    
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopiedLink(true);
      toast.success(isHindi ? 'लिंक कॉपी हो गया!' : 'Link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (error) {
      toast.error(isHindi ? 'लिंक कॉपी नहीं हो सका' : 'Failed to copy link');
    }
  };

  const handleShareWhatsApp = () => {
    const shareableLink = generateShareableLink();
    const message = isHindi 
      ? `मेरा AI-जेनरेटेड ट्रैवल प्लान देखें! ${itinerary.title} - ${shareableLink}`
      : `Check out my AI-generated travel plan! ${itinerary.title} - ${shareableLink}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareEmail = () => {
    const shareableLink = generateShareableLink();
    const subject = isHindi 
      ? `मेरा ट्रैवल प्लान: ${itinerary.title}`
      : `My Travel Plan: ${itinerary.title}`;
    
    const body = isHindi
      ? `नमस्ते!\n\nमैंने AI की मदद से एक शानदार ट्रैवल प्लान बनाया है। इसे देखें:\n\n${shareableLink}\n\nयात्रा विवरण:\n- गंतव्य: ${itinerary.destination}\n- अवधि: ${itinerary.totalDays} दिन\n- कुल लागत: ₹${itinerary.totalCost.toLocaleString()}\n\nधन्यवाद!`
      : `Hi!\n\nI've created an amazing travel plan using AI. Check it out:\n\n${shareableLink}\n\nTrip Details:\n- Destination: ${itinerary.destination}\n- Duration: ${itinerary.totalDays} days\n- Total Cost: ₹${itinerary.totalCost.toLocaleString()}\n\nThanks!`;
    
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const handleAddToCalendar = () => {
    // Generate calendar event
    const startDate = new Date(itinerary.days[0]?.date || new Date());
    const endDate = new Date(itinerary.days[itinerary.days.length - 1]?.date || new Date());
    
    const title = encodeURIComponent(itinerary.title);
    const details = encodeURIComponent(
      `${isHindi ? 'यात्रा योजना:' : 'Travel itinerary:'} ${itinerary.totalDays} ${isHindi ? 'दिन' : 'days'} in ${itinerary.destination}`
    );
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${details}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-purple-600" />
          {isHindi ? "निर्यात और साझा करें" : "Export & Share"}
        </CardTitle>
        <p className="text-sm text-gray-600">
          {isHindi ? "अपना यात्रा प्लान सहेजें और दोस्तों के साथ साझा करें" : "Save your travel plan and share with friends"}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Itinerary Summary */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-lg mb-3 text-purple-900">{itinerary.title}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-600" />
              <span>{itinerary.destination}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>{itinerary.totalDays} {isHindi ? 'दिन' : 'days'}</span>
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-purple-600" />
              <span>₹{itinerary.totalCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span>{itinerary.bookingSummary?.totalActivities || 0} {isHindi ? 'गतिविधियाँ' : 'activities'}</span>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">
            {isHindi ? "निर्यात विकल्प" : "Export Options"}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
              <Download className="w-4 h-4" />
              {isHindi ? "PDF डाउनलोड करें" : "Download PDF"}
            </Button>
            
            <Button 
              onClick={handleAddToCalendar}
              variant="outline"
              className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Calendar className="w-4 h-4" />
              {isHindi ? "कैलेंडर में जोड़ें" : "Add to Calendar"}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Share Options */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">
            {isHindi ? "साझा करने के विकल्प" : "Share Options"}
          </h4>
          
          {/* Copy Link */}
          <div className="p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">
                  {isHindi ? "साझा करने योग्य लिंक" : "Shareable Link"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {generateShareableLink()}
                </p>
              </div>
              <Button 
                size="sm" 
                onClick={handleCopyLink}
                className={`flex items-center gap-2 ${copiedLink ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedLink ? (isHindi ? 'कॉपी हो गया' : 'Copied') : (isHindi ? 'कॉपी करें' : 'Copy')}
              </Button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              onClick={handleShareWhatsApp}
              variant="outline"
              className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
            >
              <MessageCircle className="w-4 h-4" />
              {isHindi ? "व्हाट्सऐप पर साझा करें" : "Share on WhatsApp"}
            </Button>
            
            <Button 
              onClick={handleShareEmail}
              variant="outline"
              className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Mail className="w-4 h-4" />
              {isHindi ? "ईमेल करें" : "Share via Email"}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Additional Features */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">
            {isHindi ? "अतिरिक्त सुविधाएं" : "Additional Features"}
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <QrCode className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-sm">
                    {isHindi ? "QR कोड जेनरेट करें" : "Generate QR Code"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isHindi ? "त्वरित साझाकरण के लिए" : "For quick sharing"}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                {isHindi ? "जेनरेट करें" : "Generate"}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-sm">
                    {isHindi ? "विस्तृत रिपोर्ट" : "Detailed Report"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isHindi ? "विश्लेषण के साथ" : "With analytics"}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <ExternalLink className="w-4 h-4 mr-1" />
                {isHindi ? "देखें" : "View"}
              </Button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h5 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            {isHindi ? "साझाकरण युक्तियाँ" : "Sharing Tips"}
          </h5>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• {isHindi ? "PDF में सभी बुकिंग विवरण शामिल हैं" : "PDF includes all booking details"}</li>
            <li>• {isHindi ? "लिंक 30 दिनों तक वैध रहता है" : "Shareable link valid for 30 days"}</li>
            <li>• {isHindi ? "मित्र वास्तविक समय में अपडेट देख सकते हैं" : "Friends can see real-time updates"}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}