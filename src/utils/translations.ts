export type Language = 'en' | 'hi' | 'kn' | 'ta' | 'te' | 'ml' | 'bn' | 'mr' | 'gu';

export const LANGUAGES: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
];

export const translations = {
  en: {
    // Header & Navigation
    appTitle: 'AI Travel Planner',
    appSubtitle: 'Powered by EaseMyTrip',
    selectLanguage: 'Select Language',
    
    // Planning Page
    planYourTrip: 'Plan Your Perfect Trip',
    planYourTripSubtitle: 'Let AI create a personalized itinerary just for you',
    destination: 'Destination',
    destinationPlaceholder: 'Enter city name (e.g., Bangalore, Mumbai)',
  startDate: 'Start Date',
  endDate: 'End Date',
  selectDate: 'Select date',
  days: 'days',
  budget: 'Budget (₹)',
  budgetPlaceholder: 'Enter your budget in rupees',
  tripDuration: 'Duration',
    travelers: 'Number of Travelers',
    travelersPlaceholder: 'How many people?',
    
    // Trip Type & Theme
    tripType: 'Trip Type',
    solo: 'Solo',
    family: 'Family',
    couple: 'Couple',
    friends: 'Friends',
    business: 'Business',
    
    tripTheme: 'Trip Theme',
    heritage: 'Heritage',
    adventure: 'Adventure',
    relaxation: 'Relaxation',
    nightlife: 'Nightlife',
    shopping: 'Shopping',
    spiritual: 'Spiritual',
    wildlife: 'Wildlife',
    foodie: 'Foodie',
    
    // Preferences
    preferences: 'Preferences',
    hiddenGems: 'Include Hidden Gems',
    hiddenGemsDesc: 'Discover off-the-beaten-path locations',
    localExperience: 'Local Experiences',
    localExperienceDesc: 'Authentic local culture & cuisine',
    photographyFocus: 'Photography Spots',
    photographyFocusDesc: 'Best locations for photos',
    accessibilityNeeds: 'Accessibility Requirements',
    accessibilityNeedsDesc: 'Wheelchair access, etc.',
    
    // Accommodation
    accommodation: 'Accommodation Preferences',
    luxury: 'Luxury',
    midRange: 'Mid-Range',
  accommodationBudget: 'Budget',
    hostel: 'Hostel',
    homeStay: 'Home Stay',
    
    // Transport
    transport: 'Transportation',
    flight: 'Flight',
    train: 'Train',
    bus: 'Bus',
    car: 'Car Rental',
    
    // Booking
    bookingPreference: 'Booking Preference',
    immediate: 'Book Immediately',
    later: 'Book Later',
    flexible: 'Flexible',
    
    // Dietary
    dietaryRestrictions: 'Dietary Restrictions',
    vegetarian: 'Vegetarian',
    vegan: 'Vegan',
    nonVeg: 'Non-Vegetarian',
    jain: 'Jain',
    halal: 'Halal',
    
    // Buttons
    generateItinerary: 'Generate Itinerary',
    generating: 'Generating...',
    startOver: 'Start Over',
    bookNow: 'Book Now',
    editActivity: 'Edit Activity',
    viewDetails: 'View Details',
    bookCompleteTrip: 'Book Complete Trip',
    downloadPDF: 'Download PDF',
    shareItinerary: 'Share Itinerary',
    
    // Generating Page
    creatingItinerary: 'Creating Your Perfect Itinerary',
    analyzingPreferences: 'Analyzing your preferences...',
    fetchingWeather: 'Fetching weather forecasts...',
    discoveringActivities: 'Discovering activities...',
    optimizingRoute: 'Optimizing your route...',
    finalizingPlan: 'Finalizing your plan...',
    almostReady: 'Almost ready!',
    
    // Viewing Page - Itinerary
    yourItinerary: 'Your Itinerary',
    day: 'Day',
    morning: 'Morning',
    afternoon: 'Afternoon',
  evening: 'Evening',
    activity: 'Activity',
    duration: 'Duration',
    cost: 'Cost',
    weather: 'Weather',
    
    // Weather
    weatherForecast: 'Weather Forecast',
    temperature: 'Temperature',
    conditions: 'Conditions',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    weatherAlert: 'Weather Alert',
    
    // Booking Dialog
    bookActivity: 'Book Activity',
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone Number',
    numberOfPeople: 'Number of People',
    specialRequests: 'Special Requests',
    confirmBooking: 'Confirm Booking',
    cancel: 'Cancel',
    bookingConfirmed: 'Booking Confirmed!',
    bookingFailed: 'Booking Failed',
    
    // Complete Booking Dialog
    bookEntireTrip: 'Book Entire Trip',
    tripSummary: 'Trip Summary',
    totalCost: 'Total Cost',
    accommodationCost: 'Accommodation',
    transportationCost: 'Transportation',
    activitiesCost: 'Activities',
    
    // Payment
    paymentMethod: 'Payment Method',
    creditCard: 'Credit Card',
    debitCard: 'Debit Card',
    upi: 'UPI',
    netBanking: 'Net Banking',
    wallet: 'Wallet',
    proceedToPayment: 'Proceed to Payment',
    
    // Messages
    success: 'Success',
    error: 'Error',
    loading: 'Loading...',
    noResults: 'No results found',
    tryAgain: 'Please try again',
    
    // Errors
    requiredField: 'This field is required',
    invalidEmail: 'Invalid email address',
    invalidPhone: 'Invalid phone number',
    selectDestination: 'Please select a destination',
    selectDates: 'Please select travel dates',
    
    // AI Metrics
    aiMetrics: 'AI Impact Metrics',
    personalizationScore: 'Personalization Score',
    optimizationEfficiency: 'Route Optimization',
    weatherAdaptation: 'Weather Adaptation',
    costOptimization: 'Cost Optimization',
    userSatisfaction: 'User Satisfaction',
    backToPlanning: 'Back to Planning',
    
    // Footer
    about: 'About',
    contact: 'Contact',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    
    // Activity Types
    sightseeing: 'Sightseeing',
    museum: 'Museum',
    temple: 'Temple',
    fort: 'Fort',
    palace: 'Palace',
    beach: 'Beach',
    park: 'Park',
    restaurant: 'Restaurant',
    cafe: 'Cafe',
    market: 'Market',
    
    // Time of Day
    allDay: 'All Day',
    hours: 'hours',
    minutes: 'minutes',
  },
  
  hi: {
    // Header & Navigation
    appTitle: 'एआई ट्रैवल प्लानर',
    appSubtitle: 'EaseMyTrip द्वारा संचालित',
    selectLanguage: 'भाषा चुनें',
    
    // Planning Page
    planYourTrip: 'अपनी परफेक्ट यात्रा की योजना बनाएं',
    planYourTripSubtitle: 'AI आपके लिए एक व्यक्तिगत यात्रा कार्यक्रम बनाए',
    destination: 'गंतव्य',
    destinationPlaceholder: 'शहर का नाम दर्ज करें (जैसे, बैंगलोर, मुंबई)',
  startDate: 'आरंभ तिथि',
  endDate: 'समाप्ति तिथि',
  selectDate: 'तिथि चुनें',
  tripDuration: 'अवधि',
  days: 'दिन',
  budget: 'बजट (₹)',
    budgetPlaceholder: 'अपना बजट रुपये में दर्ज करें',
    travelers: 'यात्रियों की संख्या',
    travelersPlaceholder: 'कितने लोग?',
    
    // Trip Type & Theme
    tripType: 'यात्रा का प्रकार',
    solo: 'अकेले',
    family: 'परिवार',
    couple: 'जोड़ा',
    friends: 'दोस्त',
    business: 'व्यापार',
    
    tripTheme: 'यात्रा की थीम',
    heritage: 'विरासत',
    adventure: 'रोमांच',
    relaxation: 'आराम',
    nightlife: 'नाइटलाइफ़',
    shopping: 'खरीदारी',
    spiritual: 'आध्यात्मिक',
    wildlife: 'वन्यजीव',
    foodie: 'खाने का शौकीन',
    
    // Preferences
    preferences: 'प्राथमिकताएं',
    hiddenGems: 'छिपे हुए रत्न शामिल करें',
    hiddenGemsDesc: 'अनजान स्थानों की खोज करें',
    localExperience: 'स्थानीय अनुभव',
    localExperienceDesc: 'प्रामाणिक स्थानीय संस्कृति और व्यंजन',
    photographyFocus: 'फ़ोटोग्राफ़ी स्पॉट',
    photographyFocusDesc: 'फ़ोटो के लिए सर्वश्रेष्ठ स्थान',
    accessibilityNeeds: 'पहुंच आवश्यकताएं',
    accessibilityNeedsDesc: 'व्हीलचेयर एक्सेस, आदि',
    
    // Accommodation
  accommodation: 'आवास प्राथमिकताएं',
  luxury: 'लग्जरी',
  midRange: 'मध्यम श्रेणी',
  accommodationBudget: 'बजट',
    hostel: 'छात्रावास',
    homeStay: 'होम स्टे',
    
    // Transport
    transport: 'परिवहन',
    flight: 'हवाई जहाज',
    train: 'रेलगाड़ी',
    bus: 'बस',
    car: 'कार किराए पर',
    
    // Booking
    bookingPreference: 'बुकिंग प्राथमिकता',
    immediate: 'तुरंत बुक करें',
    later: 'बाद में बुक करें',
    flexible: 'लचीला',
    
    // Dietary
    dietaryRestrictions: 'आहार प्रतिबंध',
    vegetarian: 'शाकाहारी',
    vegan: 'शुद्ध शाकाहारी',
    nonVeg: 'मांसाहारी',
    jain: 'जैन',
    halal: 'हलाल',
    
    // Buttons
    generateItinerary: 'यात्रा कार्यक्रम बनाएं',
    generating: 'बना रहे हैं...',
    startOver: 'फिर से शुरू करें',
    bookNow: 'अभी बुक करें',
    editActivity: 'गतिविधि संपादित करें',
    viewDetails: 'विवरण देखें',
    bookCompleteTrip: 'पूरी यात्रा बुक करें',
    downloadPDF: 'PDF डाउनलोड करें',
    shareItinerary: 'यात्रा कार्यक्रम साझा करें',
    
    // Generating Page
    creatingItinerary: 'आपका परफेक्ट यात्रा कार्यक्रम बना रहे हैं',
    analyzingPreferences: 'आपकी प्राथमिकताओं का विश्लेषण कर रहे हैं...',
    fetchingWeather: 'मौसम पूर्वानुमान प्राप्त कर रहे हैं...',
    discoveringActivities: 'गतिविधियों की खोज कर रहे हैं...',
    optimizingRoute: 'आपके मार्ग को अनुकूलित कर रहे हैं...',
    finalizingPlan: 'आपकी योजना को अंतिम रूप दे रहे हैं...',
    almostReady: 'लगभग तैयार!',
    
    // Viewing Page - Itinerary
    yourItinerary: 'आपका यात्रा कार्यक्रम',
    day: 'दिन',
    morning: 'सुबह',
    afternoon: 'दोपहर',
    evening: 'शाम',
    activity: 'गतिविधि',
    duration: 'अवधि',
    cost: 'लागत',
    weather: 'मौसम',
    
    // Weather
    weatherForecast: 'मौसम पूर्वानुमान',
    temperature: 'तापमान',
    conditions: 'स्थितियां',
    humidity: 'आर्द्रता',
    windSpeed: 'हवा की गति',
    weatherAlert: 'मौसम चेतावनी',
    
    // Booking Dialog
    bookActivity: 'गतिविधि बुक करें',
    fullName: 'पूरा नाम',
    email: 'ईमेल',
    phone: 'फ़ोन नंबर',
    numberOfPeople: 'लोगों की संख्या',
    specialRequests: 'विशेष अनुरोध',
    confirmBooking: 'बुकिंग की पुष्टि करें',
    cancel: 'रद्द करें',
    bookingConfirmed: 'बुकिंग की पुष्टि हुई!',
    bookingFailed: 'बुकिंग विफल',
    
    // Complete Booking Dialog
    bookEntireTrip: 'पूरी यात्रा बुक करें',
    tripSummary: 'यात्रा सारांश',
    totalCost: 'कुल लागत',
    accommodationCost: 'आवास',
    transportationCost: 'परिवहन',
    activitiesCost: 'गतिविधियां',
    
    // Payment
    paymentMethod: 'भुगतान विधि',
    creditCard: 'क्रेडिट कार्ड',
    debitCard: 'डेबिट कार्ड',
    upi: 'UPI',
    netBanking: 'नेट बैंकिंग',
    wallet: 'वॉलेट',
    proceedToPayment: 'भुगतान के लिए आगे बढ़ें',
    
    // Messages
    success: 'सफलता',
    error: 'त्रुटि',
    loading: 'लोड हो रहा है...',
    noResults: 'कोई परिणाम नहीं मिला',
    tryAgain: 'कृपया पुनः प्रयास करें',
    
    // Errors
    requiredField: 'यह फ़ील्ड आवश्यक है',
    invalidEmail: 'अमान्य ईमेल पता',
    invalidPhone: 'अमान्य फ़ोन नंबर',
    selectDestination: 'कृपया गंतव्य चुनें',
    selectDates: 'कृपया यात्रा तिथियां चुनें',
    
    // AI Metrics
    aiMetrics: 'AI प्रभाव मीट्रिक',
    personalizationScore: 'वैयक्तिकरण स्कोर',
    optimizationEfficiency: 'मार्ग अनुकूलन',
    weatherAdaptation: 'मौसम अनुकूलन',
    costOptimization: 'लागत अनुकूलन',
    userSatisfaction: 'उपयोगकर्ता संतुष्टि',
    backToPlanning: 'योजना पर वापस जाएं',
    
    // Footer
    about: 'हमारे बारे में',
    contact: 'संपर्क करें',
    privacy: 'गोपनीयता नीति',
    terms: 'सेवा की शर्तें',
    
    // Activity Types
    sightseeing: 'दर्शनीय स्थल',
    museum: 'संग्रहालय',
    temple: 'मंदिर',
    fort: 'किला',
    palace: 'महल',
    beach: 'समुद्र तट',
    park: 'पार्क',
    restaurant: 'रेस्तरां',
    cafe: 'कैफ़े',
    market: 'बाज़ार',
    
    // Time of Day
    allDay: 'पूरा दिन',
    hours: 'घंटे',
    minutes: 'मिनट',
  },
  
  kn: {
    // Header & Navigation
    appTitle: 'AI ಟ್ರಾವೆಲ್ ಪ್ಲಾನರ್',
    appSubtitle: 'EaseMyTrip ನಿಂದ ನಡೆಸಲ್ಪಡುತ್ತಿದೆ',
    selectLanguage: 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',
    
    // Planning Page
    planYourTrip: 'ನಿಮ್ಮ ಪರಿಪೂರ್ಣ ಪ್ರವಾಸವನ್ನು ಯೋಜಿಸಿ',
    planYourTripSubtitle: 'AI ನಿಮಗೆ ವೈಯಕ್ತಿಕ ಪ್ರಯಾಣ ಕಾರ್ಯಕ್ರಮವನ್ನು ರಚಿಸಲಿ',
    destination: 'ಗಮ್ಯಸ್ಥಾನ',
    destinationPlaceholder: 'ನಗ���ದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ (ಉದಾ: ಬೆಂಗಳೂರು, ಮುಂಬೈ)',
  startDate: 'ಪ್ರಾರಂಭ ದಿನಾಂಕ',
  endDate: 'ಅಂತಿಮ ದಿನಾಂಕ',
  selectDate: 'ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ',
  tripDuration: 'ಅವಧಿ',
  days: 'ದಿನಗಳು',
  budget: 'ಬಜೆಟ್ (₹)',
    budgetPlaceholder: 'ನಿಮ್ಮ ಬಜೆಟ್ ಅನ್ನು ರೂಪಾಯಿಗಳಲ್ಲಿ ನಮೂದಿಸಿ',
    travelers: 'ಪ್ರಯಾಣಿಕರ ಸಂಖ್ಯೆ',
    travelersPlaceholder: 'ಎಷ್ಟು ಜನರು?',
    
    // Trip Type & Theme
    tripType: 'ಪ್ರವಾಸದ ಪ್ರಕಾರ',
    solo: 'ಒಬ್ಬಂಟಿಯಾಗಿ',
    family: 'ಕುಟುಂಬ',
    couple: 'ದಂಪತಿಗಳು',
    friends: 'ಸ್ನೇಹಿತರು',
    business: 'ವ್ಯಾಪಾರ',
    
    tripTheme: 'ಪ್ರವಾಸದ ವಿಷಯ',
    heritage: 'ಪರಂಪರೆ',
    adventure: 'ಸಾಹಸ',
    relaxation: 'ವಿಶ್ರಾಂತಿ',
    nightlife: 'ರಾತ್ರಿ ಜೀವನ',
    shopping: 'ಶಾಪಿಂಗ್',
    spiritual: 'ಆಧ್ಯಾತ್ಮಿಕ',
    wildlife: 'ವನ್ಯಜೀವಿ',
    foodie: 'ಆಹಾರ ಪ್ರೇಮಿ',
    
    // Preferences
    preferences: 'ಆದ್ಯತೆಗಳು',
    hiddenGems: 'ಗುಪ್ತ ರತ್ನಗಳನ್ನು ಸೇರಿಸಿ',
    hiddenGemsDesc: 'ಅಜ್ಞಾತ ಸ್ಥಳಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
    localExperience: 'ಸ್ಥಳೀಯ ಅನುಭವಗಳು',
    localExperienceDesc: 'ಅಧಿಕೃತ ಸ್ಥಳೀಯ ಸಂಸ್ಕೃತಿ ಮತ್ತು ಪಾಕಪದ್ಧತಿ',
    photographyFocus: 'ಛಾಯಾಗ್ರಹಣ ಸ್ಥಳಗಳು',
    photographyFocusDesc: 'ಫೋಟೋಗಳಿಗಾಗಿ ಅತ್ಯುತ್ತಮ ಸ್ಥಳಗಳು',
    accessibilityNeeds: 'ಪ್ರವೇಶಾತಿ ಅಗತ್ಯತೆಗಳು',
    accessibilityNeedsDesc: 'ವೀಲ್‌ಚೇರ್ ಪ್ರವೇಶ, ಇತ್ಯಾದಿ',
    
    // Accommodation
  accommodation: 'ವಸತಿ ಆದ್ಯತೆಗಳು',
  luxury: 'ಐಷಾರಾಮಿ',
  midRange: 'ಮಧ್ಯಮ ಶ್ರೇಣಿ',
  accommodationBudget: 'ಬಜೆಟ್',
    hostel: 'ಹಾಸ್ಟೆಲ್',
    homeStay: 'ಹೋಮ್ ಸ್ಟೇ',
    
    // Transport
    transport: 'ಸಾರಿಗೆ',
    flight: 'ವಿಮಾನ',
    train: 'ರೈಲು',
    bus: 'ಬಸ್',
    car: 'ಕಾರ್ ಬಾಡಿಗೆ',
    
    // Booking
    bookingPreference: 'ಬುಕಿಂಗ್ ಆದ್ಯತೆ',
    immediate: 'ತಕ್ಷಣ ಬುಕ್ ಮಾಡ��',
    later: 'ನಂತರ ಬುಕ್ ಮಾಡಿ',
    flexible: 'ಹೊಂದಿಕೊಳ್ಳುವ',
    
    // Dietary
    dietaryRestrictions: 'ಆಹಾರ ನಿರ್ಬಂಧಗಳು',
    vegetarian: 'ಸಸ್ಯಾಹಾರಿ',
    vegan: 'ಶುದ್ಧ ಸಸ್ಯಾಹಾರಿ',
    nonVeg: 'ಮಾಂಸಾಹಾರಿ',
    jain: 'ಜೈನ',
    halal: 'ಹಲಾಲ್',
    
    // Buttons
    generateItinerary: 'ಪ್ರಯಾಣ ಕಾರ್ಯಕ್ರಮ ರಚಿಸಿ',
    generating: 'ರಚಿಸುತ್ತಿದೆ...',
    startOver: 'ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಿ',
    bookNow: 'ಈಗ ಬುಕ್ ಮಾಡಿ',
    editActivity: 'ಚಟುವಟಿಕೆ ಸಂಪಾದಿಸಿ',
    viewDetails: 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    bookCompleteTrip: 'ಸಂಪೂರ್ಣ ಪ್ರವಾಸ ಬುಕ್ ಮಾಡಿ',
    downloadPDF: 'PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    shareItinerary: 'ಪ್ರಯಾಣ ಕಾರ್ಯಕ್ರಮ ಹಂಚಿಕೊಳ್ಳಿ',
    
    // Generating Page
    creatingItinerary: 'ನಿಮ್ಮ ಪರಿಪೂರ್ಣ ಪ್ರಯಾಣ ಕಾರ್ಯಕ್ರಮ ರಚಿಸುತ್ತಿದೆ',
    analyzingPreferences: 'ನಿಮ್ಮ ಆದ್ಯತೆಗಳನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...',
    fetchingWeather: 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆಗಳನ್ನು ಪಡೆಯುತ್ತಿದೆ...',
    discoveringActivities: 'ಚಟುವಟಿಕೆಗಳನ್ನು ಅನ್ವೇಷಿಸುತ್ತಿದೆ...',
    optimizingRoute: 'ನಿಮ್ಮ ಮಾರ್ಗವನ್ನು ಅತ್ಯುತ್ತಮಗೊಳಿಸುತ್ತಿದೆ...',
    finalizingPlan: 'ನಿಮ್ಮ ಯೋಜನೆಯನ್ನು ಅಂತಿಮಗೊಳಿಸುತ್ತಿದೆ...',
    almostReady: 'ಬಹುತೇಕ ಸಿದ್ಧವಾಗಿದೆ!',
    
    // Viewing Page - Itinerary
    yourItinerary: 'ನಿಮ್ಮ ಪ್ರಯಾಣ ಕಾರ್ಯಕ್ರಮ',
    day: 'ದಿನ',
    morning: 'ಬೆಳಿಗ್ಗೆ',
    afternoon: 'ಮಧ್ಯಾಹ್ನ',
    evening: 'ಸಂಜೆ',
    activity: 'ಚಟುವಟಿಕೆ',
    duration: 'ಅವಧಿ',
    cost: 'ವೆಚ್ಚ',
    weather: 'ಹವಾಮಾನ',
    
    // Weather
    weatherForecast: 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ',
    temperature: 'ತಾಪಮಾನ',
    conditions: 'ಪರಿಸ್ಥಿತಿಗಳು',
    humidity: 'ಆರ್ದ್ರತೆ',
    windSpeed: 'ಗಾಳಿ ವೇಗ',
    weatherAlert: 'ಹವಾಮಾನ ಎಚ್ಚರಿಕೆ',
    
    // Booking Dialog
    bookActivity: 'ಚಟುವಟಿಕೆ ಬುಕ್ ಮಾಡಿ',
    fullName: 'ಪೂರ್ಣ ಹೆಸರು',
    email: 'ಇಮೇಲ್',
    phone: 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ',
    numberOfPeople: 'ಜನರ ಸಂಖ್ಯೆ',
    specialRequests: 'ವಿಶೇಷ ವಿನಂತಿಗಳು',
    confirmBooking: 'ಬುಕಿಂಗ್ ದೃಢೀಕರಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    bookingConfirmed: 'ಬುಕಿಂಗ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ!',
    bookingFailed: 'ಬುಕಿಂಗ್ ವಿಫಲವಾಗಿದೆ',
    
    // Complete Booking Dialog
    bookEntireTrip: 'ಸಂಪೂರ್ಣ ಪ್ರವಾಸ ಬುಕ್ ಮಾಡಿ',
    tripSummary: 'ಪ್ರವಾಸ ಸಾರಾಂಶ',
    totalCost: 'ಒಟ್ಟು ವೆಚ್ಚ',
    accommodationCost: 'ವಸತಿ',
    transportationCost: 'ಸಾರಿಗೆ',
    activitiesCost: 'ಚಟುವಟಿಕೆಗಳು',
    
    // Payment
    paymentMethod: 'ಪಾವತಿ ವಿಧಾನ',
    creditCard: 'ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್',
    debitCard: 'ಡೆಬಿಟ್ ಕಾರ್ಡ್',
    upi: 'UPI',
    netBanking: 'ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್',
    wallet: 'ವಾಲೆಟ್',
    proceedToPayment: 'ಪಾವತಿಗೆ ಮುಂದುವರಿಯಿರಿ',
    
    // Messages
    success: 'ಯಶಸ್ಸು',
    error: 'ದೋಷ',
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    noResults: 'ಯಾವುದೇ ಫಲಿತಾಂಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    tryAgain: 'ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
    
    // Errors
    requiredField: 'ಈ ಕ್ಷೇತ್ರ ಅಗತ್ಯವಿದೆ',
    invalidEmail: 'ಅಮಾನ್ಯ ಇಮೇಲ್ ವಿಳಾಸ',
    invalidPhone: 'ಅಮಾನ್ಯ ದೂರವಾಣಿ ಸಂಖ್ಯೆ',
    selectDestination: 'ದಯವಿಟ್ಟು ಗಮ್ಯಸ್ಥಾನ ಆಯ್ಕೆಮಾಡಿ',
    selectDates: 'ದಯವಿಟ್ಟು ಪ್ರಯಾಣ ದಿನಾಂಕಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    
    // AI Metrics
    aiMetrics: 'AI ಪ್ರಭಾವ ಮೆಟ್ರಿಕ್ಸ್',
    personalizationScore: 'ವೈಯಕ್ತೀಕರಣ ಅಂಕ',
    optimizationEfficiency: 'ಮಾರ್ಗ ಅತ್ಯುತ್ತಮೀಕರಣ',
    weatherAdaptation: 'ಹವಾಮಾನ ರೂಪಾಂತರ',
    costOptimization: 'ವೆಚ್ಚ ಅತ್ಯುತ್ತಮೀಕರಣ',
    userSatisfaction: 'ಬಳಕೆದಾರ ತೃಪ್ತಿ',
    backToPlanning: 'ಯೋಜನೆಗೆ ಹಿಂತಿರುಗಿ',
    
    // Footer
    about: 'ನಮ್ಮ ಬಗ್ಗೆ',
    contact: 'ಸಂಪರ್ಕಿಸಿ',
    privacy: 'ಗೌಪ್ಯತಾ ನೀತಿ',
    terms: 'ಸೇವಾ ನಿಯಮಗಳು',
    
    // Activity Types
    sightseeing: 'ದರ್ಶನೀಯ ಸ್ಥಳಗಳು',
    museum: 'ವಸ್ತುಸಂಗ್ರಹಾಲಯ',
    temple: 'ದೇವಾಲಯ',
    fort: 'ಕೋಟೆ',
    palace: 'ಅರಮನೆ',
    beach: 'ಸಮುದ್ರತೀರ',
    park: 'ಉದ್ಯಾನವನ',
    restaurant: 'ರೆಸ್ಟೋರೆಂಟ್',
    cafe: 'ಕೆಫೆ',
    market: 'ಮಾರುಕಟ್ಟೆ',
    
    // Time of Day
    allDay: 'ಇಡೀ ದಿನ',
    hours: 'ಗಂಟೆಗಳು',
    minutes: 'ನಿಮಿಷಗಳು',
  },
  
  ta: {
    // Header & Navigation
    appTitle: 'AI பயண திட்டமிடுபவர்',
    appSubtitle: 'EaseMyTrip மூலம் இயக்கப்படுகிறது',
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    
    // Planning Page
    planYourTrip: 'உங்கள் சரியான பயணத்தைத் திட்டமிடுங்கள்',
    planYourTripSubtitle: 'AI உங்களுக்காக தனிப்பயன் பயண அட்டவணையை உருவாக்கட்டும்',
    destination: 'இலக்கு',
    destinationPlaceholder: 'நகர பெயரை உள்ளிடவும் (எ.கா., பெங்களூர், மும்பை)',
  startDate: 'தொடக்க தேதி',
  endDate: 'முடிவு தேதி',
  selectDate: 'தேதியைத் தேர்ந்தெடுக்கவும்',
  tripDuration: 'காலம்',
  days: 'நாட்கள்',
  budget: 'பட்ஜெட் (₹)',
    budgetPlaceholder: 'உங்கள் பட்ஜெட்டை ரூபாயில் உள்ளிடவும்',
    travelers: 'பயணிகளின் எண்ணிக்கை',
    travelersPlaceholder: 'எத்தனை பேர்?',
    
    // Trip Type & Theme
    tripType: 'பயண வகை',
    solo: 'தனியாக',
    family: 'குடும்பம்',
    couple: 'ஜோடி',
    friends: 'நண்பர்கள்',
    business: 'வணிகம்',
    
    tripTheme: 'பயண தீம்',
    heritage: 'பாரம்பரியம்',
    adventure: 'சாகசம்',
    relaxation: 'ஓய்வு',
    nightlife: 'இரவு வாழ்க்கை',
    shopping: 'ஷாப்பிங்',
    spiritual: 'ஆன்மீகம்',
    wildlife: 'வனவிலங்கு',
    foodie: 'உணவு பிரியர்',
    
    // Preferences
    preferences: 'விருப்பத்தேர்வுகள்',
    hiddenGems: 'மறைக்கப்பட்ட இரத்தினங்களைச் சேர்க்கவும்',
    hiddenGemsDesc: 'தெரியாத இடங்களைக் கண்டறியவும்',
    localExperience: 'உள்ளூர் அனுபவங்கள்',
    localExperienceDesc: 'உண்மையான உள்ளூர் கலாச்சாரம் மற்றும் உணவு',
    photographyFocus: 'புகைப்பட இடங்கள்',
    photographyFocusDesc: 'புகைப்படங்களுக்கான சிறந்த இடங்கள்',
    accessibilityNeeds: 'அணுகல் தேவைகள்',
    accessibilityNeedsDesc: 'சக்கர நாற்காலி அணுகல், போன்றவை',
    
    // Accommodation
  accommodation: 'தங்குமிட விருப்பத்தேர்வுகள்',
  luxury: 'ஆடம்பரம்',
  midRange: 'நடுக்கேற்ற வரம்பு',
  accommodationBudget: 'பட்ஜெட்',
    hostel: 'விடுதி',
    homeStay: 'ஹோம் ஸ்டே',
    
    // Transport
    transport: 'போக்குவரத்து',
    flight: 'விமானம்',
    train: 'ரயில்',
    bus: 'பேருந்து',
    car: 'கார் வாடகை',
    
    // Booking
    bookingPreference: 'முன்பதிவு விருப்பம்',
    immediate: 'உடனடியாக முன்பதிவு செய்',
    later: 'பின்னர் முன்பதிவு செய்',
    flexible: 'நெகிழ்வான',
    
    // Dietary
    dietaryRestrictions: 'உணவு கட்டுப்பாடுகள்',
    vegetarian: 'சைவம்',
    vegan: 'முழு சைவம்',
    nonVeg: 'அசைவம்',
    jain: 'ஜைன',
    halal: 'ஹலால்',
    
    // Buttons
    generateItinerary: 'பயண அட்டவணையை உருவாக்கு',
    generating: 'உருவாக்குகிறது...',
    startOver: 'மீண்டும் தொடங்கு',
    bookNow: 'இப்போது முன்பதிவு செய்',
    editActivity: 'செயல்பாட்டைத் திருத்து',
    viewDetails: 'விவரங்களைக் காண்க',
    bookCompleteTrip: 'முழு பயணத்தையும் முன்பதிவு செய்',
    downloadPDF: 'PDF பதிவிறக்கம்',
    shareItinerary: 'பயண அட்டவணையைப் பகிர்',
    
    // Generating Page
    creatingItinerary: 'உங்கள் சரியான பயண அட்டவணையை உருவாக்குகிறது',
    analyzingPreferences: 'உங்கள் விருப்பத்தேர்வுகளை ஆராய்கிறது...',
    fetchingWeather: 'வானிலை முன்னறிவிப்புகளைப் பெறுகிறது...',
    discoveringActivities: 'செயல்பாடுகளைக் கண்டறிகிறது...',
    optimizingRoute: 'உங்கள் வழியை உகந்ததாக்குகிறது...',
    finalizingPlan: 'உங்கள் திட்டத்தை இறுதிசெய்கிறது...',
    almostReady: 'கிட்டத்தட்ட தயார்!',
    
    // Viewing Page - Itinerary
    yourItinerary: 'உங்கள் பயண அட்டவணை',
    day: 'நாள்',
    morning: 'காலை',
    afternoon: 'மதியம்',
    evening: 'மாலை',
    activity: 'செயல்பாடு',
    duration: 'காலம்',
    cost: 'செலவு',
    weather: 'வானிலை',
    
    // Weather
    weatherForecast: 'வானிலை முன்னறிவிப்பு',
    temperature: 'வெப்பநிலை',
    conditions: 'நிலைமைகள்',
    humidity: 'ஈரப்பதம்',
    windSpeed: 'காற்று வேகம்',
    weatherAlert: 'வானிலை எச்சரிக்கை',
    
    // Booking Dialog
    bookActivity: 'செயல்பாட்டை முன்பதிவு செய்',
    fullName: 'முழு பெயர்',
    email: 'மின்னஞ்சல்',
    phone: 'தொலைபேசி எண்',
    numberOfPeople: 'நபர்களின் எண்ணிக்கை',
    specialRequests: 'சிறப்பு கோரிக்கைகள்',
    confirmBooking: 'முன்பதிவை உறுதிப்படுத்து',
    cancel: 'ரத்துசெய்',
    bookingConfirmed: 'முன்பதிவு உறுதிப்படுத்தப்பட்டது!',
    bookingFailed: 'முன்பதிவு தோல்வியுற்றது',
    
    // Complete Booking Dialog
    bookEntireTrip: 'முழு பயணத்தையும் முன்பதிவு செய்',
    tripSummary: 'பயண சுருக்கம்',
    totalCost: 'மொத்த செலவு',
    accommodationCost: 'தங்குமிடம்',
    transportationCost: 'போக்குவரத்து',
    activitiesCost: 'செயல்பாடுகள்',
    
    // Payment
    paymentMethod: 'பணம் செலுத்தும் முறை',
    creditCard: 'கிரெடிட் கார்டு',
    debitCard: 'டெபிட் கார்டு',
    upi: 'UPI',
    netBanking: 'நெட் பேங்கிங்',
    wallet: 'வாலட்',
    proceedToPayment: 'பணம் செலுத்துவதற்குச் செல்',
    
    // Messages
    success: 'வெற்றி',
    error: 'பிழை',
    loading: 'ஏற்றுகிறது...',
    noResults: 'முடிவுகள் எதுவும் இல்லை',
    tryAgain: 'மீண்டும் முயற்சிக்கவும்',
    
    // Errors
    requiredField: 'இந்த புலம் அவசியம்',
    invalidEmail: 'தவறான மின்னஞ்சல் முகவரி',
    invalidPhone: 'தவறான தொலைபேசி எண்',
    selectDestination: 'தயவுசெய்து இலக்கைத் தேர்ந்தெடுக்கவும்',
    selectDates: 'தயவுசெய்து பயண தேதிகளைத் தேர்ந்தெடுக்கவும்',
    
    // AI Metrics
    aiMetrics: 'AI தாக்க அளவீடுகள்',
    personalizationScore: 'தனிப்பயனாக்கல் மதிப்பெண்',
    optimizationEfficiency: 'வழி உகப்பாக்கம்',
    weatherAdaptation: 'வானிலை தகவமைப்பு',
    costOptimization: 'செலவு உகப்பாக்கம்',
    userSatisfaction: 'பயனர் திருப்தி',
    backToPlanning: 'திட்டமிடலுக்குத் திரும்பு',
    
    // Footer
    about: 'எங்களைப் பற்றி',
    contact: 'தொடர்பு கொள்ள',
    privacy: 'தனியுரிமை கொள்கை',
    terms: 'சேவை விதிமுறைகள்',
    
    // Activity Types
    sightseeing: 'சுற்றுலா',
    museum: 'அருங்காட்சியகம்',
    temple: 'கோவில்',
    fort: 'கோட்டை',
    palace: 'அரண்மனை',
    beach: 'கடற்கரை',
    park: 'பூங்கா',
    restaurant: 'உணவகம்',
    cafe: 'காஃபி',
    market: 'சந்தை',
    
    // Time of Day
    allDay: 'முழு நாள்',
    hours: 'மணிநேரங்கள்',
    minutes: 'நிமிடங்கள்',
  },
  
  te: {
    // Header & Navigation
    appTitle: 'AI ట్రావెల్ ప్లానర్',
    appSubtitle: 'EaseMyTrip ద్వారా శక్తినిచ్చింది',
    selectLanguage: 'భాషను ఎంచుకోండి',
    
    // Planning Page
    planYourTrip: 'మీ పర్ఫెక్ట్ ట్రిప్‌ను ప్లాన్ చేయండి',
    planYourTripSubtitle: 'AI మీ కోసం వ్యక్తిగత ప్రయాణ కార్యక్రమాన్ని సృష్టించనివ్వండి',
    destination: 'గమ్యస్థానం',
    destinationPlaceholder: 'నగరం పేరును నమోదు చేయండి (ఉదా, బెంగళూరు, ముంబై)',
  startDate: 'ప్రారంభ తేదీ',
  endDate: 'ముగింపు తేదీ',
  selectDate: 'తేదీని ఎంచుకోండి',
  tripDuration: 'వ్యవధి',
  days: 'రోజులు',
  budget: 'బడ్జెట్ (₹)',
    budgetPlaceholder: 'మీ బడ్జెట్‌ను రూపాయిలో నమోదు చేయండి',
    travelers: 'ప్రయాణికుల సంఖ్య',
    travelersPlaceholder: 'ఎంత మంది?',
    
    // Trip Type & Theme
    tripType: 'ట్రిప్ రకం',
    solo: 'ఒంటరిగా',
    family: 'కుటుంబం',
    couple: 'జంట',
    friends: 'స్నేహితులు',
    business: 'వ్యాపారం',
    
    tripTheme: 'ట్రిప్ థీమ్',
    heritage: 'వారసత్వం',
    adventure: 'సాహసం',
    relaxation: 'విశ్రాంతి',
    nightlife: 'నైట్‌లైఫ్',
    shopping: 'షాపింగ్',
    spiritual: 'ఆధ్యాత్మికం',
    wildlife: 'వన్యప్రాణి',
    foodie: 'ఆహార ప్రియుడు',
    
    // Preferences
    preferences: 'ప్రాధాన్యతలు',
    hiddenGems: 'దాచిన రత్నాలను చేర్చండి',
    hiddenGemsDesc: 'తెలియని ప్రదేశాలను కనుగొనండి',
    localExperience: 'స్థానిక అనుభవాలు',
    localExperienceDesc: 'ప్రామాణిక స్థానిక సంస్కృతి మరియు వంటకాలు',
    photographyFocus: 'ఫోటోగ్రఫీ స్థలాలు',
    photographyFocusDesc: 'ఫోటోల కోసం ఉత్తమ స్థలాలు',
    accessibilityNeeds: 'యాక్సెస్ అవసరాలు',
    accessibilityNeedsDesc: 'వీల్‌చైర్ యాక్సెస్, మొదలైనవి',
    
    // Accommodation
  accommodation: 'వసతి ప్రాధాన్యతలు',
  luxury: 'లగ్జరీ',
  midRange: 'మిడ్-రేంజ్',
  accommodationBudget: 'బడ్జెట్',
    hostel: 'హాస్టల్',
    homeStay: 'హోమ్ స్టే',
    
    // Transport
    transport: 'రవాణా',
    flight: 'విమానం',
    train: 'రైలు',
    bus: 'బస్సు',
    car: 'కారు అద్దె',
    
    // Booking
    bookingPreference: 'బుకింగ్ ప్రాధాన్యత',
    immediate: 'వెంటనే బుక్ చేయండి',
    later: 'తరువాత బుక్ చేయండి',
    flexible: 'సౌకర్యవంతమైన',
    
    // Dietary
    dietaryRestrictions: 'ఆహార పరిమితులు',
    vegetarian: 'శాకాహారం',
    vegan: 'పూర్తి శాకాహారం',
    nonVeg: 'మాంసాహారం',
    jain: 'జైన',
    halal: 'హలాల్',
    
    // Buttons
    generateItinerary: 'ప్రయాణ కార్యక్రమాన్ని సృష్టించండి',
    generating: 'సృష్టిస్తోంది...',
    startOver: 'మళ్లీ ప్రారంభించండి',
    bookNow: 'ఇప్పుడు బుక్ చేయండి',
    editActivity: 'కార్యకలాపాన్ని సవరించండి',
    viewDetails: 'వివరాలను చూడండి',
    bookCompleteTrip: 'పూర్తి ట్రిప్‌ను బుక్ చేయండి',
    downloadPDF: 'PDF డౌన్‌లోడ్ చేయండి',
    shareItinerary: 'ప్రయాణ కార్యక్రమాన్ని షేర్ చేయండి',
    
    // Generating Page
    creatingItinerary: 'మీ పర్ఫెక్ట్ ప్రయాణ కార్యక్రమాన్ని సృష్టిస్తోంది',
    analyzingPreferences: 'మీ ప్రాధాన్యతలను విశ్లేషిస్తోంది...',
    fetchingWeather: 'వాతావరణ అంచనాలను పొందుతోంది...',
    discoveringActivities: 'కార్యకలాపాలను కనుగొంటోంది...',
    optimizingRoute: 'మీ మార్గాన్ని ఆప్టిమైజ్ చేస్తోంది...',
    finalizingPlan: 'మీ ప్రణాళికను ఖరారు చేస్తోంది...',
    almostReady: 'దాదాపు సిద్ధంగా ఉంది!',
    
    // Viewing Page - Itinerary
    yourItinerary: 'మీ ప్రయాణ కార్యక్రమం',
    day: 'రోజు',
    morning: 'ఉదయం',
    afternoon: 'మధ్యాహ్నం',
    evening: 'సాయంత్రం',
    activity: 'కార్యకలాపం',
    duration: 'వ్యవధి',
    cost: 'ఖర్చు',
    weather: 'వాతావరణం',
    
    // Weather
    weatherForecast: 'వాతావరణ అంచనా',
    temperature: 'ఉష్ణోగ్రత',
    conditions: 'పరిస్థితులు',
    humidity: 'తేమ',
    windSpeed: 'గాలి వేగం',
    weatherAlert: 'వాతావరణ హెచ్చరిక',
    
    // Booking Dialog
    bookActivity: 'కార్యకలాపాన్ని బుక్ చేయండి',
    fullName: 'పూర్తి పేరు',
    email: 'ఇమెయిల్',
    phone: 'ఫోన్ నంబర్',
    numberOfPeople: 'వ్యక్తుల సంఖ్య',
    specialRequests: 'ప్రత్యేక అభ్యర్థనలు',
    confirmBooking: 'బుకింగ్‌ను నిర్ధారించండి',
    cancel: 'రద్దు చేయండి',
    bookingConfirmed: 'బుకింగ్ నిర్ధారించబడింది!',
    bookingFailed: 'బుకింగ్ విఫలమైంది',
    
    // Complete Booking Dialog
    bookEntireTrip: 'పూర్తి ట్రిప్‌ను బుక్ చేయండి',
    tripSummary: 'ట్రిప్ సారాంశం',
    totalCost: 'మొత్తం ఖర్చు',
    accommodationCost: 'వసతి',
    transportationCost: 'రవాణా',
    activitiesCost: 'కార్యకలాపాలు',
    
    // Payment
    paymentMethod: 'చెల్లింపు పద్ధతి',
    creditCard: 'క్రెడిట్ కార్డ్',
    debitCard: 'డెబిట్ కార్డ్',
    upi: 'UPI',
    netBanking: 'నెట్ బ్యాంకింగ్',
    wallet: 'వాలెట్',
    proceedToPayment: 'చెల్లింపుకు కొనసాగండి',
    
    // Messages
    success: 'విజయం',
    error: 'లోపం',
    loading: 'లోడ్ అవుతోంది...',
    noResults: 'ఫలితాలు కనిపించలేదు',
    tryAgain: 'దయచేసి మళ్లీ ప్రయత్నించండి',
    
    // Errors
    requiredField: 'ఈ ఫీల్డ్ అవసరం',
    invalidEmail: 'చెల్లని ఇమెయిల్ చిరునామా',
    invalidPhone: 'చెల్లని ఫోన్ నంబర్',
    selectDestination: 'దయచేసి గమ్యస్థానాన్ని ఎంచుకోండి',
    selectDates: 'దయచేసి ప్రయాణ తేదీలను ఎంచుకోండి',
    
    // AI Metrics
    aiMetrics: 'AI ప్రభావ మెట్రిక్స్',
    personalizationScore: 'వ్యక్తిగతీకరణ స్కోర్',
    optimizationEfficiency: 'మార్గం ఆప్టిమైజేషన్',
    weatherAdaptation: 'వాతావరణ అనుకూలత',
    costOptimization: 'ఖర్చు ఆప్టిమైజేషన్',
    userSatisfaction: 'వినియోగదారు సంతృప్తి',
    backToPlanning: 'ప్రణాళికకు తిరిగి వెళ్ళండి',
    
    // Footer
    about: 'మా గురించి',
    contact: 'సంప్రదించండి',
    privacy: 'గోప్యతా విధానం',
    terms: 'సేవా నిబంధనలు',
    
    // Activity Types
    sightseeing: 'సందర్శనీయ స్థలాలు',
    museum: 'మ్యూజియం',
    temple: 'ఆలయం',
    fort: 'కోట',
    palace: 'రాజభవనం',
    beach: 'బీచ్',
    park: 'పార్క్',
    restaurant: 'రెస్టారెంట్',
    cafe: 'కేఫ్',
    market: 'మార్కెట్',
    
    // Time of Day
    allDay: 'రోజంతా',
    hours: 'గంటలు',
    minutes: 'నిమిషాలు',
  },
  
  ml: {
    // Header & Navigation
    appTitle: 'AI ട്രാവൽ പ്ലാനർ',
    appSubtitle: 'EaseMyTrip പവർ ചെയ്യുന്നത്',
    selectLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    
    // Planning Page
    planYourTrip: 'നിങ്ങളുടെ പെർഫെക്റ്റ് യാത്ര ആസൂത്രണം ചെയ്യുക',
    planYourTripSubtitle: 'AI നിങ്ങൾക്കായി വ്യക്തിഗത യാത്രാ പദ്ധതി സൃഷ്ടിക്കട്ടെ',
    destination: 'ലക്ഷ്യസ്ഥാനം',
    destinationPlaceholder: 'നഗരത്തിന്റെ പേര് നൽകുക (ഉദാ, ബെംഗളൂരു, മുംബൈ)',
  startDate: 'ആരംഭ തീയതി',
  endDate: 'അവസാന തീയതി',
  selectDate: 'തിയതി തിരഞ്ഞെടുക്കുക',
  tripDuration: 'കാലാവധി',
  days: 'ദിവസങ്ങൾ',
  budget: 'ബജറ്റ് (₹)',
    budgetPlaceholder: 'നിങ്ങളുടെ ബജറ്റ് രൂപയിൽ നൽകുക',
    travelers: 'യാത്രക്കാരുടെ എണ്ണം',
    travelersPlaceholder: 'എത്ര പേർ?',
    
    // Trip Type & Theme
    tripType: 'യാത്രാ തരം',
    solo: 'ഒറ്റയ്ക്ക്',
    family: 'കുടുംബം',
    couple: 'ദമ്പതികൾ',
    friends: 'സുഹൃത്തുക്കൾ',
    business: 'ബിസിനസ്',
    
    tripTheme: 'യാത്രാ തീം',
    heritage: 'പാരമ്പര്യം',
    adventure: 'സാഹസികത',
    relaxation: 'വിശ്രമം',
    nightlife: 'രാത്രിജീവിതം',
    shopping: 'ഷോപ്പിംഗ്',
    spiritual: 'ആത്മീയം',
    wildlife: 'വന്യജീവി',
    foodie: 'ഭക്ഷണപ്രേമി',
    
    // Preferences
    preferences: 'മുൻഗണനകൾ',
    hiddenGems: 'മറഞ്ഞിരിക്കുന്ന രത്നങ്ങൾ ഉൾപ്പെടുത്തുക',
    hiddenGemsDesc: 'അറിയപ്പെടാത്ത സ്ഥലങ്ങൾ കണ്ടെത്തുക',
    localExperience: 'പ്രാദേശിക അനുഭവങ്ങൾ',
    localExperienceDesc: 'യഥാർത്ഥ പ്രാദേശിക സംസ്കാരവും ഭക്ഷണവും',
    photographyFocus: 'ഫോട്ടോഗ്രാഫി സ്ഥലങ്ങൾ',
    photographyFocusDesc: 'ഫോട്ടോകൾക്കായുള്ള മികച്ച സ്ഥലങ്ങൾ',
    accessibilityNeeds: 'പ്രവേശന ആവശ്യങ്ങൾ',
    accessibilityNeedsDesc: 'വീൽചെയർ പ്രവേ���നം മുതലായവ',
    
    // Accommodation
  accommodation: 'താമസ മുൻഗണനകൾ',
  luxury: 'ആഡംബരം',
  midRange: 'മിഡ്-റേഞ്ച്',
  accommodationBudget: 'ബജറ്റ്',
    hostel: 'ഹോസ്റ്റൽ',
    homeStay: 'ഹോം സ്റ്റേ',
    
    // Transport
    transport: 'ഗതാഗതം',
    flight: 'വിമാനം',
    train: 'തീവണ്ടി',
    bus: 'ബസ്',
    car: 'കാർ വാടക',
    
    // Booking
    bookingPreference: 'ബുക്കിംഗ് മുൻഗണന',
    immediate: 'ഉടനെ ബുക്ക് ചെയ്യുക',
    later: 'പിന്നീട് ബുക്ക് ചെയ്യുക',
    flexible: 'ഫ്ലെക്സിബിൾ',
    
    // Dietary
    dietaryRestrictions: 'ഭക്ഷണ നിയന്ത്രണങ്ങൾ',
    vegetarian: 'സസ്യാഹാരം',
    vegan: 'ശുദ്ധ സസ്യാഹാരം',
    nonVeg: 'മാംസാഹാരം',
    jain: 'ജൈന',
    halal: 'ഹലാൽ',
    
    // Buttons
    generateItinerary: 'യാത്രാ പദ്ധതി സൃഷ്ടിക്കുക',
    generating: 'സൃഷ്ടിക്കുന്നു...',
    startOver: 'വീണ്ടും ആരംഭിക്കുക',
    bookNow: 'ഇപ്പോൾ ബുക്ക് ചെയ്യുക',
    editActivity: 'പ്രവർത്തനം എഡിറ്റ് ചെയ്യുക',
    viewDetails: 'വിശദാംശങ്ങൾ കാണുക',
    bookCompleteTrip: 'പൂർണ്ണ യാത്ര ബുക്ക് ചെയ്യുക',
    downloadPDF: 'PDF ഡൗൺലോഡ് ചെയ്യുക',
    shareItinerary: 'യാത്രാ പദ്ധതി പങ്കിടുക',
    
    // Generating Page
    creatingItinerary: 'നിങ്ങളുടെ പെർഫെക്റ്റ് യാത്രാ പദ്ധതി സൃഷ്ടിക്കുന്നു',
    analyzingPreferences: 'നിങ്ങളുടെ മുൻഗണനകൾ വിശകലനം ചെയ്യുന്നു...',
    fetchingWeather: 'കാലാവസ്ഥാ പ്രവചനങ്ങൾ എടുക്കുന്നു...',
    discoveringActivities: 'പ്രവർത്തനങ്ങൾ കണ്ടെത്തുന്നു...',
    optimizingRoute: 'നിങ്ങളുടെ റൂട്ട് ഒപ്റ്റിമൈസ് ചെയ്യുന്നു...',
    finalizingPlan: 'നിങ്ങളുടെ പ്ലാൻ അന്തിമമാക്കുന്നു...',
    almostReady: 'ഏതാണ്ട് തയ്യാർ!',
    
    // Viewing Page - Itinerary
    yourItinerary: 'നിങ്ങളുടെ യാത്രാ പദ്ധതി',
    day: 'ദിവസം',
    morning: 'രാവിലെ',
    afternoon: 'ഉച്ചയ്ക്ക്',
    evening: 'വൈകുന്നേരം',
    activity: 'പ്രവർത്തനം',
    duration: 'കാലാവധി',
    cost: 'ചെലവ്',
    weather: 'കാലാവസ്ഥ',
    
    // Weather
    weatherForecast: 'കാലാവസ്ഥാ പ്രവചനം',
    temperature: 'താപനില',
    conditions: 'സാഹചര്യങ്ങൾ',
    humidity: 'ആർദ്രത',
    windSpeed: 'കാറ്റിന്റെ വേഗത',
    weatherAlert: 'കാലാവസ്ഥാ മുന്നറിയിപ്പ്',
    
    // Booking Dialog
    bookActivity: 'പ്രവർത്തനം ബുക്ക് ചെയ്യുക',
    fullName: 'പൂർണ്ണ പേര്',
    email: 'ഇമെയിൽ',
    phone: 'ഫോൺ നമ്പർ',
    numberOfPeople: 'ആളുകളുടെ എണ്ണം',
    specialRequests: 'പ്രത്യേക അഭ്യർത്ഥനകൾ',
    confirmBooking: 'ബുക്കിംഗ് സ്ഥിരീകരിക്കുക',
    cancel: 'റദ്ദാക്കുക',
    bookingConfirmed: 'ബുക്കിംഗ് സ്ഥിരീകരിച്ചു!',
    bookingFailed: 'ബുക്കിംഗ് പരാജയപ്പെട്ടു',
    
    // Complete Booking Dialog
    bookEntireTrip: 'പൂർണ്ണ യാത്ര ബുക്ക് ചെയ്യുക',
    tripSummary: 'യാത്രാ സംഗ്രഹം',
    totalCost: 'മൊത്തം ചെലവ്',
    accommodationCost: 'താമസം',
    transportationCost: 'ഗതാഗതം',
    activitiesCost: 'പ്രവർത്തനങ്ങൾ',
    
    // Payment
    paymentMethod: 'പേയ്മെന്റ് രീതി',
    creditCard: 'ക്രെഡിറ്റ് കാർഡ്',
    debitCard: 'ഡെബിറ്റ് കാർഡ്',
    upi: 'UPI',
    netBanking: 'നെറ്റ് ബാങ്കിംഗ്',
    wallet: 'വാലറ്റ്',
    proceedToPayment: 'പേയ്മെന്റിലേക്ക് പോകുക',
    
    // Messages
    success: 'വിജയം',
    error: 'പിശക്',
    loading: 'ലോഡ് ചെയ്യുന്നു...',
    noResults: 'ഫലങ്ങളൊന്നും കണ്ടെത്തിയില്ല',
    tryAgain: 'ദയവായി വീണ്ടും ശ്രമിക്കുക',
    
    // Errors
    requiredField: 'ഈ ഫീൽഡ് ആവശ്യമാണ്',
    invalidEmail: 'അസാധുവായ ഇമെയിൽ വിലാസം',
    invalidPhone: 'അസാധുവായ ഫോൺ നമ്പർ',
    selectDestination: 'ദയവായി ലക്ഷ്യസ്ഥാനം തിരഞ്ഞെടുക്കുക',
    selectDates: 'ദയവായി യാത്രാ തീയതികൾ തിരഞ്ഞെടുക്കുക',
    
    // AI Metrics
    aiMetrics: 'AI ആഘാത മെട്രിക്സ്',
    personalizationScore: 'വ്യക്തിഗതമാക്കൽ സ്കോർ',
    optimizationEfficiency: 'റൂട്ട് ഒപ്റ്റിമൈസേഷൻ',
    weatherAdaptation: 'കാലാവസ്ഥാ അനുരൂപമാക്കൽ',
    costOptimization: 'ചെലവ് ഒപ്റ്റിമൈസേഷൻ',
    userSatisfaction: 'ഉപയോക്തൃ സംതൃപ്തി',
    backToPlanning: 'ആസൂത്രണത്തിലേക്ക് മടങ്ങുക',
    
    // Footer
    about: 'ഞങ്ങളെക്കുറിച്ച്',
    contact: 'ബന്ധപ്പെടുക',
    privacy: 'സ്വകാര്യതാ നയം',
    terms: 'സേവന നിബന്ധനകൾ',
    
    // Activity Types
    sightseeing: 'കാഴ്ചകൾ',
    museum: 'മ്യൂസിയം',
    temple: 'ക്ഷേത്രം',
    fort: 'കോട്ട',
    palace: 'കൊട്ടാരം',
    beach: 'കടൽത്തീരം',
    park: 'പാർക്ക്',
    restaurant: 'റെസ്റ്റോറന്റ്',
    cafe: 'കഫേ',
    market: 'മാർക്കറ്റ്',
    
    // Time of Day
    allDay: 'മുഴുവൻ ദിവസം',
    hours: 'മണിക്കൂറുകൾ',
    minutes: 'മിനിറ്റുകൾ',
  },
  
  bn: {
    // Header & Navigation
    appTitle: 'AI ট্রাভেল প্ল্যানার',
    appSubtitle: 'EaseMyTrip দ্বারা চালিত',
    selectLanguage: 'ভাষা নির্বাচন করুন',
    
    // Planning Page
    planYourTrip: 'আপনার নিখুঁত ভ্রমণ পরিকল্পনা করুন',
    planYourTripSubtitle: 'AI আপনার জন্য ব্যক্তিগত ভ্রমণসূচী তৈরি করুক',
    destination: 'গন্তব্য',
    destinationPlaceholder: 'শহরের নাম লিখুন (যেমন, ব্যাঙ্গালোর, মুম্বাই)',
  startDate: 'শুরুর তারিখ',
  endDate: 'শেষ তারিখ',
  selectDate: 'তারিখ নির্বাচন করুন',
  tripDuration: 'সময়কাল',
  days: 'দিন',
  budget: 'বাজেট (₹)',
    budgetPlaceholder: 'আপনার বাজেট টাকায় লিখুন',
    travelers: 'ভ্রমণকারীর সংখ্যা',
    travelersPlaceholder: 'কত জন?',
    
    // Trip Type & Theme
    tripType: 'ভ্রমণের ধরন',
    solo: 'একা',
    family: 'পরিবার',
    couple: 'দম্পতি',
    friends: 'বন্ধুরা',
    business: 'ব্যবসা',
    
    tripTheme: 'ভ্রমণের থিম',
    heritage: 'ঐতিহ্য',
    adventure: 'অ্যাডভেঞ্চার',
    relaxation: 'বিশ্রাম',
    nightlife: 'নাইটলাইফ',
    shopping: 'শপিং',
    spiritual: 'আধ্যাত্মিক',
    wildlife: 'বন্যপ্রাণী',
    foodie: 'খাদ্যপ্রেমী',
    
    // Preferences
    preferences: 'পছন্দসমূহ',
    hiddenGems: 'লুকানো রত্ন অন্তর্ভুক্ত করুন',
    hiddenGemsDesc: 'অজানা স্থান আবিষ্কার করুন',
    localExperience: 'স্থানীয় অভিজ্ঞতা',
    localExperienceDesc: 'প্রকৃত স্থানীয় সংস্কৃতি ও খাবার',
    photographyFocus: 'ফটোগ্রাফি স্পট',
    photographyFocusDesc: 'ফটোর জন্য সেরা স্থান',
    accessibilityNeeds: 'প্রবেশযোগ্যতার প্রয়োজন',
    accessibilityNeedsDesc: 'হুইলচেয়ার অ্যাক্সেস ইত্যাদি',
    
    // Accommodation
  accommodation: 'থাকার ব্যবস্থা পছন্দ',
  luxury: 'বিলাসবহুল',
  midRange: 'মধ্যম শ্রেণি',
  accommodationBudget: 'বাজেট',
    hostel: 'হোস্টেল',
    homeStay: 'হোম স্টে',
    
    // Transport
    transport: 'পরিবহন',
    flight: 'বিমান',
    train: 'ট্রেন',
    bus: 'বাস',
    car: 'গাড়ি ভাড়া',
    
    // Booking
    bookingPreference: 'বুকিং পছন্দ',
    immediate: 'এখনই বুক করুন',
    later: 'পরে বুক করুন',
    flexible: 'নমনীয়',
    
    // Dietary
    dietaryRestrictions: 'খাদ্য নিষেধাজ্ঞা',
    vegetarian: 'নিরামিষ',
    vegan: 'বিশুদ্ধ নিরামিষ',
    nonVeg: 'আমিষ',
    jain: 'জৈন',
    halal: 'হালাল',
    
    // Buttons
    generateItinerary: 'ভ্রমণসূচী তৈরি করুন',
    generating: 'তৈরি করা হচ্ছে...',
    startOver: 'আবার শুরু করুন',
    bookNow: 'এখনই বুক করুন',
    editActivity: 'কার্যকলাপ সম্পাদনা করুন',
    viewDetails: 'বিস্তারিত দেখুন',
    bookCompleteTrip: 'সম্পূর্ণ ভ্রমণ বুক করুন',
    downloadPDF: 'PDF ডাউনলোড করুন',
    shareItinerary: 'ভ্রমণসূচী শেয়ার করুন',
    
    // Generating Page
    creatingItinerary: 'আপনার নিখুঁত ভ্রমণসূচী তৈরি করা হচ্ছে',
    analyzingPreferences: 'আপনার পছন্দ বিশ্লেষণ করা হচ্ছে...',
    fetchingWeather: 'আবহাওয়া পূর্বাভাস আনা হচ্ছে...',
    discoveringActivities: 'কার্যকলাপ আবিষ্কার করা হচ্ছে...',
    optimizingRoute: 'আপনার রুট অপ্টিমাইজ করা হচ্ছে...',
    finalizingPlan: 'আপনার পরিকল্পনা চূড়ান্ত করা হচ্ছে...',
    almostReady: 'প্রায় প্রস্তুত!',
    
    // Viewing Page - Itinerary
    yourItinerary: 'আপনার ভ্রমণসূচী',
    day: 'দিন',
    morning: 'সকাল',
    afternoon: 'বিকাল',
    evening: 'সন্ধ্যা',
    activity: 'কার্যকলাপ',
    duration: 'সময়কাল',
    cost: 'খরচ',
    weather: 'আবহাওয়া',
    
    // Weather
    weatherForecast: 'আবহাওয়া পূর্বাভাস',
    temperature: 'তাপমাত্রা',
    conditions: 'অবস্থা',
    humidity: 'আর্দ্রতা',
    windSpeed: 'বাতাসের গতি',
    weatherAlert: 'আবহাওয়া সতর্কতা',
    
    // Booking Dialog
    bookActivity: 'কার্যকলাপ বুক করুন',
    fullName: 'পুরো নাম',
    email: 'ইমেল',
    phone: 'ফোন নম্বর',
    numberOfPeople: 'লোকের সংখ্যা',
    specialRequests: 'বিশেষ অনুরোধ',
    confirmBooking: 'বুকিং নিশ্চিত করুন',
    cancel: 'বাতিল করুন',
    bookingConfirmed: 'বুকিং নিশ্চিত হয়েছে!',
    bookingFailed: 'বুকিং ব্যর্থ হয়েছে',
    
    // Complete Booking Dialog
    bookEntireTrip: 'সম্পূর্ণ ভ্রমণ বুক করুন',
    tripSummary: 'ভ্রমণ সারাংশ',
    totalCost: 'মোট খরচ',
    accommodationCost: 'থাকার ব্যবস্থা',
    transportationCost: 'পরিবহন',
    activitiesCost: 'কার্যকলাপ',
    
    // Payment
    paymentMethod: 'পেমেন্ট পদ্ধতি',
    creditCard: 'ক্রেডিট কার্ড',
    debitCard: 'ডেবিট কার্ড',
    upi: 'UPI',
    netBanking: 'নেট ব্যাংকিং',
    wallet: 'ওয়ালেট',
    proceedToPayment: 'পেমেন্টে এগিয়ে যান',
    
    // Messages
    success: 'সফলতা',
    error: 'ত্রুটি',
    loading: 'লোড হচ্ছে...',
    noResults: 'কোনো ফলাফল পাওয়া যায়নি',
    tryAgain: 'অনুগ্রহ করে আবার চেষ্টা করুন',
    
    // Errors
    requiredField: 'এই ক্ষেত্রটি আবশ্যক',
    invalidEmail: 'অবৈধ ইমেল ঠিকানা',
    invalidPhone: 'অবৈধ ফোন নম্বর',
    selectDestination: 'অনুগ্রহ করে গন্তব্য নির্বাচন করুন',
    selectDates: 'অনুগ্রহ করে ভ্রমণের তারিখ নির্বাচন করুন',
    
    // AI Metrics
    aiMetrics: 'AI প্রভাব মেট্রিক্স',
    personalizationScore: 'ব্যক্তিগতকরণ স্কোর',
    optimizationEfficiency: 'রুট অপ্টিমাইজেশন',
    weatherAdaptation: 'আবহাওয়া অভিযোজন',
    costOptimization: 'খরচ অপ্টিমাইজেশন',
    userSatisfaction: 'ব্যবহারকারী সন্তুষ্টি',
    backToPlanning: 'পরিকল্পনায় ফিরে যান',
    
    // Footer
    about: 'আমাদের সম্পর্কে',
    contact: 'যোগাযোগ করুন',
    privacy: 'গোপনীয়তা নীতি',
    terms: 'সেবার শর্তাবলী',
    
    // Activity Types
    sightseeing: 'দর্শনীয় স্থান',
    museum: 'জাদুঘর',
    temple: 'মন্দির',
    fort: 'দুর্গ',
    palace: 'প্রাসাদ',
    beach: 'সমুদ্র সৈকত',
    park: 'পার্ক',
    restaurant: 'রেস্তোরাঁ',
    cafe: 'ক্যাফে',
    market: 'বাজার',
    
    // Time of Day
    allDay: 'সারাদিন',
    hours: 'ঘণ্টা',
    minutes: 'মিনিট',
  },
  
  mr: {
    // Header & Navigation
    appTitle: 'AI ट्रॅव्हल प्लॅनर',
    appSubtitle: 'EaseMyTrip द्वारे समर्थित',
    selectLanguage: 'भाषा निवडा',
    
    // Planning Page
    planYourTrip: 'तुमचा परफेक्ट ट्रिप प्लॅन करा',
    planYourTripSubtitle: 'AI तुमच्यासाठी वैयक्तिक प्रवास कार्यक्रम तयार करू द्या',
    destination: 'गंतव्य',
    destinationPlaceholder: 'शहराचे नाव प्रविष्ट करा (उदा., बेंगलुरु, मुंबई)',
  startDate: 'प्रारंभ तारीख',
  endDate: 'समाप्ती तारीख',
  selectDate: 'तारीख निवडा',
  tripDuration: 'कालावधी',
  days: 'दिवस',
  budget: 'बजेट (₹)',
    budgetPlaceholder: 'तुमचे बजेट रुपयात प्रविष्ट करा',
    travelers: 'प्रवाशांची संख्या',
    travelersPlaceholder: 'किती लोक?',
    
    // Trip Type & Theme
    tripType: 'प्रवासाचा प्रकार',
    solo: 'एकटे',
    family: 'कुटुंब',
    couple: 'जोडपे',
    friends: 'मित्र',
    business: 'व्यवसाय',
    
    tripTheme: 'प्रवासाची थीम',
    heritage: 'वारसा',
    adventure: 'साहस',
    relaxation: 'विश्रांती',
    nightlife: 'नाइटलाइफ',
    shopping: 'खरेदी',
    spiritual: 'अध्यात्मिक',
    wildlife: 'वन्यजीव',
    foodie: 'खाद्यप्रेमी',
    
    // Preferences
    preferences: 'प्राधान्यक्रम',
    hiddenGems: 'लपलेली रत्ने समाविष्ट करा',
    hiddenGemsDesc: 'अज्ञात ठिकाणे शोधा',
    localExperience: 'स्थानिक अनुभव',
    localExperienceDesc: 'अस्सल स्थानिक संस्कृती आणि पाककृती',
    photographyFocus: 'फोटोग्राफी ठिकाणे',
    photographyFocusDesc: 'फोटोंसाठी सर्वोत्तम ठिकाणे',
    accessibilityNeeds: 'प्रवेशयोग्यता आवश्यकता',
    accessibilityNeedsDesc: 'व्हीलचेअर प्रवेश इ.',
    
    // Accommodation
  accommodation: 'निवास प्राधान्यक्रम',
  luxury: 'लक्झरी',
  midRange: 'मिड-रेंज',
  accommodationBudget: 'बजेट',
    hostel: 'हॉस्टेल',
    homeStay: 'होम स्टे',
    
    // Transport
    transport: 'वाहतूक',
    flight: 'विमान',
    train: 'ट्रेन',
    bus: 'बस',
    car: 'कार भाड्याने',
    
    // Booking
    bookingPreference: 'बुकिंग प्राधान्य',
    immediate: 'ताबडतोब बुक करा',
    later: 'नंतर बुक करा',
    flexible: 'लवचिक',
    
    // Dietary
    dietaryRestrictions: 'आहार निर्बंध',
    vegetarian: 'शाकाहारी',
    vegan: 'शुद्ध शाकाहारी',
    nonVeg: 'मांसाहारी',
    jain: 'जैन',
    halal: 'हलाल',
    
    // Buttons
    generateItinerary: 'प्रवास कार्यक्रम तयार करा',
    generating: 'तयार करत आहे...',
    startOver: 'पुन्हा सुरू करा',
    bookNow: 'आता बुक करा',
    editActivity: 'क्रियाकलाप संपादित करा',
    viewDetails: 'तपशील पहा',
    bookCompleteTrip: 'संपूर्ण प्रवास बुक करा',
    downloadPDF: 'PDF डाउनलोड करा',
    shareItinerary: 'प्रवास कार्यक्रम शेअर करा',
    
    // Generating Page
    creatingItinerary: 'तुमचा परफेक्ट प्रवास कार्यक्रम तयार करत आहे',
    analyzingPreferences: 'तुमच्या प्राधान्यक्रमांचे विश्लेषण करत आहे...',
    fetchingWeather: 'हवामान अंदाज मिळवत आहे...',
    discoveringActivities: 'क्रियाकलाप शोधत आहे...',
    optimizingRoute: 'तुमचा मार्ग अनुकूल करत आहे...',
    finalizingPlan: 'तुमची योजना अंतिम करत आहे...',
    almostReady: 'जवळजवळ तयार!',
    
    // Viewing Page - Itinerary
    yourItinerary: 'तुमचा प्रवास कार्यक्रम',
    day: 'दिवस',
    morning: 'सकाळ',
    afternoon: 'दुपार',
    evening: 'संध्याकाळ',
    activity: 'क्रियाकलाप',
    duration: 'कालावधी',
    cost: 'खर्च',
    weather: 'हवामान',
    
    // Weather
    weatherForecast: 'हवामान अंदाज',
    temperature: 'तापमान',
    conditions: 'परिस्थिती',
    humidity: 'आर्द्रता',
    windSpeed: 'वाऱ्याचा वेग',
    weatherAlert: 'हवामान सतर्कता',
    
    // Booking Dialog
    bookActivity: 'क्रियाकलाप बुक करा',
    fullName: 'पूर्ण नाव',
    email: 'ईमेल',
    phone: 'फोन नंबर',
    numberOfPeople: 'लोकांची संख्या',
    specialRequests: 'विशेष विनंत्या',
    confirmBooking: 'बुकिंगची पुष्टी करा',
    cancel: 'रद्द करा',
    bookingConfirmed: 'बुकिंगची पुष्टी झाली!',
    bookingFailed: 'बुकिंग अयशस्वी',
    
    // Complete Booking Dialog
    bookEntireTrip: 'संपूर्ण प्रवास बुक करा',
    tripSummary: 'प्रवास सारांश',
    totalCost: 'एकूण खर्च',
    accommodationCost: 'निवास',
    transportationCost: 'वाहतूक',
    activitiesCost: 'क्रियाकलाप',
    
    // Payment
    paymentMethod: 'पेमेंट पद्धत',
    creditCard: 'क्रेडिट कार्ड',
    debitCard: 'डेबिट कार्ड',
    upi: 'UPI',
    netBanking: 'नेट बँकिंग',
    wallet: 'वॉलेट',
    proceedToPayment: 'पेमेंटसाठी पुढे जा',
    
    // Messages
    success: 'यश',
    error: 'त्रुटी',
    loading: 'लोड होत आहे...',
    noResults: 'कोणतेही परिणाम आढळले नाहीत',
    tryAgain: 'कृपया पुन्हा प्रयत्न करा',
    
    // Errors
    requiredField: 'हे फील्ड आवश्यक आहे',
    invalidEmail: 'अवैध ईमेल पत्ता',
    invalidPhone: 'अवैध फोन नंबर',
    selectDestination: 'कृपया गंतव्य निवडा',
    selectDates: 'कृपया प्रवास तारखा निवडा',
    
    // AI Metrics
    aiMetrics: 'AI प्रभाव मेट्रिक्स',
    personalizationScore: 'वैयक्तिकरण स्कोअर',
    optimizationEfficiency: 'मार्ग अनुकूलन',
    weatherAdaptation: 'हवामान अनुकूलन',
    costOptimization: 'खर्च अनुकूलन',
    userSatisfaction: 'वापरकर्ता समाधान',
    backToPlanning: 'योजनेकडे परत',
    
    // Footer
    about: 'आमच्याबद्दल',
    contact: 'संपर्क करा',
    privacy: 'गोपनीयता धोरण',
    terms: 'सेवा अटी',
    
    // Activity Types
    sightseeing: 'प्रेक्षणीय स्थळे',
    museum: 'संग्रहालय',
    temple: 'मंदिर',
    fort: 'किल्ला',
    palace: 'राजवाडा',
    beach: 'समुद्रकिनारा',
    park: 'उद्यान',
    restaurant: 'रेस्टॉरंट',
    cafe: 'कॅफे',
    market: 'बाजार',
    
    // Time of Day
    allDay: 'पूर्ण दिवस',
    hours: 'तास',
    minutes: 'मिनिटे',
  },
  
  gu: {
    // Header & Navigation
    appTitle: 'AI ટ્રાવેલ પ્લાનર',
    appSubtitle: 'EaseMyTrip દ્વારા સંચાલિત',
    selectLanguage: 'ભાષા પસંદ કરો',
    
    // Planning Page
    planYourTrip: 'તમારી પરફેક્ટ ટ્રિપ પ્લાન કરો',
    planYourTripSubtitle: 'AI તમારા માટે વ્યક્તિગત પ્રવાસ કાર્યક્રમ બનાવવા દો',
    destination: 'ગંતવ્ય',
    destinationPlaceholder: 'શહેરનું નામ દાખલ કરો (ઉદા., બેંગલુરુ, મુંબઈ)',
  startDate: 'શરૂઆત તારીખ',
  endDate: 'અંતિમ તારીખ',
  selectDate: 'તારીખ પસંદ કરો',
  tripDuration: 'અવધિ',
  days: 'દિવસો',
  budget: 'બજેટ (₹)',
    budgetPlaceholder: 'તમારું બજેટ રૂપિયામાં દાખલ કરો',
    travelers: 'પ્રવાસીઓની સંખ્યા',
    travelersPlaceholder: 'કેટલા લોકો?',
    
    // Trip Type & Theme
    tripType: 'ટ્રિપનો પ્રકાર',
    solo: 'એકલા',
    family: 'પરિવાર',
    couple: 'યુગલ',
    friends: 'મિત્રો',
    business: 'વ્યવસાય',
    
    tripTheme: 'ટ્રિપ થીમ',
    heritage: 'વારસો',
    adventure: 'સાહસ',
    relaxation: 'આરામ',
    nightlife: 'નાઇટલાઇફ',
    shopping: 'શોપિંગ',
    spiritual: 'આધ્યાત્મિક',
    wildlife: 'વન્યજીવન',
    foodie: 'ખોરાક પ્રેમી',
    
    // Preferences
    preferences: 'પસંદગીઓ',
    hiddenGems: 'છુપાયેલા રત્નોનો સમાવેશ કરો',
    hiddenGemsDesc: 'અજાણ્યા સ્થળો શોધો',
    localExperience: 'સ્થાનિક અનુભવો',
    localExperienceDesc: 'અસલી સ્થાનિક સંસ્કૃતિ અને રાંધણકળા',
    photographyFocus: 'ફોટોગ્રાફી સ્થળો',
    photographyFocusDesc: 'ફોટા માટે શ્રેષ્ઠ સ્થળો',
    accessibilityNeeds: 'સુલભતા જરૂરિયાતો',
    accessibilityNeedsDesc: 'વ્હીલચેર એક્સેસ વગેરે',
    
    // Accommodation
  accommodation: 'રહેવાની પસંદગીઓ',
  luxury: 'લક્ઝરી',
  midRange: 'મિડ-રેન્જ',
  accommodationBudget: 'બજેટ',
    hostel: 'હોસ્ટેલ',
    homeStay: 'હોમ સ્ટે',
    
    // Transport
    transport: 'પરિવહન',
    flight: 'વિમાન',
    train: 'ટ્રેન',
    bus: 'બસ',
    car: 'કાર ભાડે',
    
    // Booking
    bookingPreference: 'બુકિંગ પસંદગી',
    immediate: 'તાત્કાલિક બુક કરો',
    later: 'પછી બુક કરો',
    flexible: 'લવચીક',
    
    // Dietary
    dietaryRestrictions: 'આહાર પ્રતિબંધો',
    vegetarian: 'શાકાહારી',
    vegan: 'શુદ્ધ શાકાહારી',
    nonVeg: 'માંસાહારી',
    jain: 'જૈન',
    halal: 'હલાલ',
    
    // Buttons
    generateItinerary: 'પ્રવાસ કાર્યક્રમ બનાવો',
    generating: 'બનાવી રહ્યા છીએ...',
    startOver: 'ફરી શરૂ કરો',
    bookNow: 'હવે બુક કરો',
    editActivity: 'પ્રવૃત્તિ સંપાદિત કરો',
    viewDetails: 'વિગતો જુઓ',
    bookCompleteTrip: 'સંપૂર્ણ ટ્રિપ બુક કરો',
    downloadPDF: 'PDF ડાઉનલોડ કરો',
    shareItinerary: 'પ્રવાસ કાર્યક્રમ શેર કરો',
    
    // Generating Page
    creatingItinerary: 'તમારો પરફેક્ટ પ્રવાસ કાર્યક્રમ બનાવી રહ્યા છીએ',
    analyzingPreferences: 'તમારી પસંદગીઓનું વિશ્લેષણ કરી રહ્યા છીએ...',
    fetchingWeather: 'હવામાન આગાહી મેળવી રહ્યા છીએ...',
    discoveringActivities: 'પ્રવૃત્તિઓ શોધી રહ્યા છીએ...',
    optimizingRoute: 'તમારો રસ્તો ઑપ્ટિમાઇઝ કરી રહ્યા છીએ...',
    finalizingPlan: 'તમારી યોજના અંતિમ બનાવી રહ્યા છીએ...',
    almostReady: 'લગભગ તૈયાર!',
    
    // Viewing Page - Itinerary
    yourItinerary: 'તમારો પ્રવાસ કાર્યક્રમ',
    day: 'દિવસ',
    morning: 'સવાર',
    afternoon: 'બપોર',
    evening: 'સાંજ',
    activity: 'પ્રવૃત્તિ',
    duration: 'અવધિ',
    cost: 'ખર્ચ',
    weather: 'હવામાન',
    
    // Weather
    weatherForecast: 'હવામાન આગાહી',
    temperature: 'તાપમાન',
    conditions: 'સ્થિતિઓ',
    humidity: 'ભેજ',
    windSpeed: 'પવનની ગતિ',
    weatherAlert: 'હવામાન ચેતવણી',
    
    // Booking Dialog
    bookActivity: 'પ્રવૃત્તિ બુક કરો',
    fullName: 'પૂરું નામ',
    email: 'ઇમેઇલ',
    phone: 'ફોન નંબર',
    numberOfPeople: 'લોકોની સંખ્યા',
    specialRequests: 'ખાસ વિનંતીઓ',
    confirmBooking: 'બુકિંગની પુષ્ટિ કરો',
    cancel: 'રદ કરો',
    bookingConfirmed: 'બુકિંગની પુષ્ટિ થઈ!',
    bookingFailed: 'બુકિંગ નિષ્ફળ',
    
    // Complete Booking Dialog
    bookEntireTrip: 'સંપૂર્ણ ટ્રિપ બુક કરો',
    tripSummary: 'ટ્રિપ સારાંશ',
    totalCost: 'કુલ ખર્ચ',
    accommodationCost: 'રહેવાની વ્યવસ્થા',
    transportationCost: 'પરિવહન',
    activitiesCost: 'પ્રવૃત્તિઓ',
    
    // Payment
    paymentMethod: 'ચુકવણી પદ્ધતિ',
    creditCard: 'ક્રેડિટ કાર્ડ',
    debitCard: 'ડેબિટ કાર્ડ',
    upi: 'UPI',
    netBanking: 'નેટ બેંકિંગ',
    wallet: 'વૉલેટ',
    proceedToPayment: 'ચુકવણી માટે આગળ વધો',
    
    // Messages
    success: 'સફળતા',
    error: 'ભૂલ',
    loading: 'લોડ થઈ રહ્યું છે...',
    noResults: 'કોઈ પરિણામો મળ્યા નથી',
    tryAgain: 'કૃપા કરીને ફરી પ્રયાસ કરો',
    
    // Errors
    requiredField: 'આ ફીલ્ડ આવશ્યક છે',
    invalidEmail: 'અમાન્ય ઇમેઇલ સરનામું',
    invalidPhone: 'અમાન્ય ફોન નંબર',
    selectDestination: 'કૃપા કરીને ગંતવ્ય પસંદ કરો',
    selectDates: 'કૃપા કરીને પ્રવાસની તારીખો પસંદ કરો',
    
    // AI Metrics
    aiMetrics: 'AI પ્રભાવ મેટ્રિક્સ',
    personalizationScore: 'વ્યક્તિગતકરણ સ્કોર',
    optimizationEfficiency: 'રૂટ ઑપ્ટિમાઇઝેશન',
    weatherAdaptation: 'હવામાન અનુકૂલન',
    costOptimization: 'ખર્ચ ઑપ્ટિમાઇઝેશન',
    userSatisfaction: 'વપરાશકર્તા સંતોષ',
    backToPlanning: 'યોજના પર પાછા જાઓ',
    
    // Footer
    about: 'અમારા વિશે',
    contact: 'સંપર્ક કરો',
    privacy: 'ગોપનીયતા નીતિ',
    terms: 'સેવાની શરતો',
    
    // Activity Types
    sightseeing: 'દર્શનીય સ્થળો',
    museum: 'સંગ્રહાલય',
    temple: 'મંદિર',
    fort: 'કિલ્લો',
    palace: 'મહેલ',
    beach: 'બીચ',
    park: 'ઉદ્યાન',
    restaurant: 'રેસ્ટોરન્ટ',
    cafe: 'કૅફે',
    market: 'બજાર',
    
    // Time of Day
    allDay: 'આખો દિવસ',
    hours: 'કલાકો',
    minutes: 'મિનિટ',
  },
};

export function useTranslation(language: Language) {
  return translations[language] || translations.en;
}
