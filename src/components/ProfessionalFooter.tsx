import React from 'react';
import { 
  Sparkles, 
  Lock, 
  Shield, 
  CheckCircle, 
  Globe 
} from 'lucide-react';

interface ProfessionalFooterProps {
  selectedLanguage?: string;
}

export function ProfessionalFooter({ selectedLanguage }: ProfessionalFooterProps = {}) {
  return (
    <footer className="py-16 px-6 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        {/* EaseMyTrip Partner Banner */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-lg p-6 mb-12 border border-blue-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-700 font-bold text-lg">EMT</span>
              </div>
              <div>
                <h4 className="font-bold text-xl mb-1">Powered by EaseMyTrip</h4>
                <p className="text-blue-200 text-sm">India's trusted travel booking platform</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-3xl font-bold mb-1">10M+</div>
              <div className="text-blue-200 text-sm">Happy Travelers</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">TravelAI</h3>
                <p className="text-xs text-gray-400">by Foundestra Team × EaseMyTrip</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              AI-powered travel planning platform that combines cutting-edge technology 
              with EaseMyTrip's extensive booking network to create authentic, personalized Indian travel experiences.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4 mb-6">
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>ISO 27001 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <a href="#" className="block hover:text-white transition-colors">How it Works</a>
              <a href="#" className="block hover:text-white transition-colors">Sample Itineraries</a>
              <a href="#" className="block hover:text-white transition-colors">Destinations</a>
              <a href="#" className="block hover:text-white transition-colors">Travel Guides</a>
              <a href="#" className="block hover:text-white transition-colors">Blog</a>
              <a href="#" className="block hover:text-white transition-colors">API Documentation</a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <a href="#" className="block hover:text-white transition-colors">Help Center</a>
              <a href="#" className="block hover:text-white transition-colors">Contact Us</a>
              <a href="#" className="block hover:text-white transition-colors">Live Chat</a>
              <a href="#" className="block hover:text-white transition-colors">WhatsApp Support</a>
              <a href="#" className="block hover:text-white transition-colors">Travel Insurance</a>
              <a href="#" className="block hover:text-white transition-colors">Emergency Assistance</a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <a href="#" className="block hover:text-white transition-colors">About Foundestra</a>
              <a href="#" className="block hover:text-white transition-colors">Careers</a>
              <a href="#" className="block hover:text-white transition-colors">Press Kit</a>
              <a href="#" className="block hover:text-white transition-colors">Partner Program</a>
              <a href="#" className="block hover:text-white transition-colors">Affiliate Program</a>
              <a href="#" className="block hover:text-white transition-colors">Investor Relations</a>
            </div>
          </div>
        </div>

        {/* Payment Partners */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-4 text-white">Payment Partners</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-800 rounded-lg p-3 flex items-center justify-center">
                  <span className="text-xs text-gray-400">Razorpay</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 flex items-center justify-center">
                  <span className="text-xs text-gray-400">Paytm</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 flex items-center justify-center">
                  <span className="text-xs text-gray-400">PhonePe</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 flex items-center justify-center">
                  <span className="text-xs text-gray-400">GPay</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 flex items-center justify-center">
                  <span className="text-xs text-gray-400">UPI</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 flex items-center justify-center">
                  <span className="text-xs text-gray-400">Visa</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Travel Partners</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="font-semibold text-blue-400">✓ EaseMyTrip (Primary)</div>
                <div>MakeMyTrip</div>
                <div>Cleartrip</div>
                <div>Goibibo</div>
                <div>Booking.com</div>
                <div>OYO Hotels</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Technology Stack</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Google Cloud Platform</div>
                <div>Vertex AI</div>
                <div>Firebase Auth</div>
                <div>BigQuery Analytics</div>
                <div>React & TypeScript</div>
                <div>Supabase Database</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
              <a href="#" className="hover:text-white transition-colors">Accessibility</a>
              <a href="#" className="hover:text-white transition-colors">Site Map</a>
            </div>
            
            <div className="text-sm text-gray-400">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4" />
                <span>Available in 10+ Indian languages</span>
              </div>
              <div className="text-xs">
                Made with ❤️ in India for travelers worldwide
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <div className="text-sm text-gray-400 mb-2">
              © 2024 TravelAI Platform. All rights reserved. 
              <span className="block sm:inline sm:ml-2">
                Proudly developed by <span className="text-white font-medium">Foundestra Team</span> × Powered by <span className="text-blue-400 font-medium">EaseMyTrip</span>
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Licensed under Creative Commons. Travel data powered by official tourism boards.
              <br />
              This product includes GeoNames data and OpenWeatherMap services.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
