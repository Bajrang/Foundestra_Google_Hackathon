// Conversational AI Service using Vertex AI for natural dialogue-based trip planning
// Enables multi-turn conversations for refining trip preferences

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ConversationContext {
  conversation_id: string;
  user_id?: string;
  messages: ConversationMessage[];
  extracted_preferences: TripPreferences;
  current_stage: ConversationStage;
  created_at: string;
  updated_at: string;
}

export interface TripPreferences {
  destination?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  travelers?: number;
  interests?: string[];
  travel_style?: 'relaxed' | 'moderate' | 'packed';
  priority?: 'budget' | 'experience' | 'comfort';
  accommodation_type?: string;
  must_visit?: string[];
  dietary_restrictions?: string[];
  accessibility_needs?: string[];
  completeness_score: number; // 0-100
}

export type ConversationStage = 
  | 'greeting'
  | 'destination_discovery'
  | 'date_selection'
  | 'budget_setting'
  | 'interest_gathering'
  | 'preference_refinement'
  | 'itinerary_preview'
  | 'confirmation'
  | 'completed';

export interface ConversationResponse {
  message: string;
  suggestions?: string[];
  quick_replies?: QuickReply[];
  updated_context: ConversationContext;
  action?: {
    type: 'show_destinations' | 'show_calendar' | 'generate_itinerary' | 'show_budget_slider';
    data?: Record<string, any>;
  };
  progress_percentage: number;
}

export interface QuickReply {
  text: string;
  value: string;
  icon?: string;
}

export class ConversationalAIService {
  private projectId: string;
  private location: string;
  private model: string;

  constructor() {
    this.projectId = Deno.env.get('GOOGLE_CLOUD_PROJECT') || 'figma-make-ai-travel';
    this.location = 'us-central1';
    this.model = 'gemini-1.5-pro';
  }

  // Initialize new conversation
  async startConversation(userId?: string): Promise<ConversationContext> {
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const context: ConversationContext = {
      conversation_id: conversationId,
      user_id: userId,
      messages: [
        {
          role: 'system',
          content: 'You are a friendly AI travel assistant helping users plan their perfect Indian vacation. Ask questions naturally, show enthusiasm, and make personalized suggestions based on their responses.',
          timestamp: new Date().toISOString()
        },
        {
          role: 'assistant',
          content: "Hello! I'm your AI travel planner. I'm here to help you create an amazing trip to India. What kind of adventure are you dreaming of?",
          timestamp: new Date().toISOString()
        }
      ],
      extracted_preferences: {
        completeness_score: 0
      },
      current_stage: 'greeting',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return context;
  }

  // Process user message and generate response
  async processMessage(
    conversationId: string,
    userMessage: string,
    currentContext: ConversationContext
  ): Promise<ConversationResponse> {
    try {
      console.log(`Processing message in conversation ${conversationId}: "${userMessage}"`);
      
      // Add user message to conversation history
      currentContext.messages.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString()
      });
      
      // Extract information from user message
      const extractedInfo = await this.extractInformationFromMessage(userMessage);
      
      // Update preferences
      this.updatePreferences(currentContext.extracted_preferences, extractedInfo);
      
      // Determine next stage
      const nextStage = this.determineNextStage(currentContext);
      currentContext.current_stage = nextStage;
      
      // Generate contextual response
      const responseMessage = await this.generateResponse(currentContext, extractedInfo);
      
      // Add assistant message to history
      currentContext.messages.push({
        role: 'assistant',
        content: responseMessage.message,
        timestamp: new Date().toISOString()
      });
      
      // Calculate progress
      const progress = this.calculateProgress(currentContext.extracted_preferences);
      currentContext.extracted_preferences.completeness_score = progress;
      
      // Update timestamp
      currentContext.updated_at = new Date().toISOString();
      
      return {
        ...responseMessage,
        updated_context: currentContext,
        progress_percentage: progress
      };
      
    } catch (error) {
      console.error('Message processing error:', error);
      
      return {
        message: "I'm sorry, I didn't quite catch that. Could you rephrase?",
        suggestions: ["Tell me about your destination", "What's your budget?", "Start over"],
        updated_context: currentContext,
        progress_percentage: currentContext.extracted_preferences.completeness_score
      };
    }
  }

  // Extract information from natural language message
  private async extractInformationFromMessage(message: string): Promise<Partial<TripPreferences>> {
    const extracted: Partial<TripPreferences> = {};
    const messageLower = message.toLowerCase();
    
    // Extract destination
    const destinations = [
      'jaipur', 'goa', 'kerala', 'manali', 'udaipur', 'rishikesh', 'hampi', 'coorg',
      'mumbai', 'delhi', 'bangalore', 'chennai', 'kolkata', 'varanasi', 'agra',
      'ladakh', 'kashmir', 'darjeeling', 'ooty', 'shimla', 'rajasthan', 'himachal'
    ];
    
    for (const dest of destinations) {
      if (messageLower.includes(dest)) {
        extracted.destination = dest.charAt(0).toUpperCase() + dest.slice(1);
        break;
      }
    }
    
    // Extract budget
    const budgetPatterns = [
      /(\d+)\s*(?:thousand|k|lakh)/i,
      /(?:₹|rs\.?|rupees?)\s*(\d+)/i,
      /budget.*?(\d+)/i
    ];
    
    for (const pattern of budgetPatterns) {
      const match = messageLower.match(pattern);
      if (match) {
        let budget = parseInt(match[1]);
        if (messageLower.includes('thousand') || messageLower.includes('k')) {
          budget *= 1000;
        } else if (messageLower.includes('lakh')) {
          budget *= 100000;
        }
        extracted.budget = budget;
        break;
      }
    }
    
    // Extract number of travelers
    const travelersPatterns = [
      /(\d+)\s*(?:people|person|travelers?|pax|of us)/i,
      /(?:solo|alone)/i
    ];
    
    for (const pattern of travelersPatterns) {
      const match = messageLower.match(pattern);
      if (match) {
        if (match[0].includes('solo') || match[0].includes('alone')) {
          extracted.travelers = 1;
        } else if (match[1]) {
          extracted.travelers = parseInt(match[1]);
        }
        break;
      }
    }
    
    // Extract interests
    const interestKeywords: Record<string, string[]> = {
      heritage: ['heritage', 'culture', 'historical', 'monument', 'palace', 'fort', 'temple', 'ancient'],
      adventure: ['adventure', 'trekking', 'hiking', 'rafting', 'paragliding', 'sports', 'thrill'],
      nature: ['nature', 'wildlife', 'forest', 'mountains', 'scenic', 'greenery', 'natural'],
      food: ['food', 'cuisine', 'culinary', 'street food', 'restaurant', 'eating', 'foodie'],
      beach: ['beach', 'coastal', 'seaside', 'ocean', 'sea', 'sand'],
      nightlife: ['nightlife', 'party', 'clubs', 'bars', 'entertainment', 'dancing'],
      spiritual: ['spiritual', 'religious', 'meditation', 'yoga', 'peaceful', 'zen'],
      photography: ['photography', 'instagram', 'photos', 'pictures', 'photogenic'],
      shopping: ['shopping', 'market', 'bazaar', 'souvenirs', 'handicrafts']
    };
    
    const detectedInterests: string[] = [];
    for (const [interest, keywords] of Object.entries(interestKeywords)) {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        detectedInterests.push(interest);
      }
    }
    if (detectedInterests.length > 0) {
      extracted.interests = detectedInterests;
    }
    
    // Extract travel style
    if (messageLower.match(/\b(relaxed|slow|leisure|chill)\b/)) {
      extracted.travel_style = 'relaxed';
    } else if (messageLower.match(/\b(packed|busy|action|maximum|lots?)\b/)) {
      extracted.travel_style = 'packed';
    } else if (messageLower.match(/\b(balanced|moderate|mix)\b/)) {
      extracted.travel_style = 'moderate';
    }
    
    // Extract priority
    if (messageLower.match(/\b(budget|cheap|affordable|economical)\b/)) {
      extracted.priority = 'budget';
    } else if (messageLower.match(/\b(luxury|premium|comfort|best)\b/)) {
      extracted.priority = 'comfort';
    } else if (messageLower.match(/\b(experience|authentic|unique|special)\b/)) {
      extracted.priority = 'experience';
    }
    
    // Extract duration hints
    const durationMatch = messageLower.match(/(\d+)\s*(?:day|days|night|nights)/);
    if (durationMatch) {
      const days = parseInt(durationMatch[1]);
      // Convert to approximate dates (assuming trip starts in ~1 month)
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 30);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + days);
      
      extracted.start_date = startDate.toISOString().split('T')[0];
      extracted.end_date = endDate.toISOString().split('T')[0];
    }
    
    return extracted;
  }

  // Update preferences with new extracted information
  private updatePreferences(current: TripPreferences, extracted: Partial<TripPreferences>): void {
    if (extracted.destination) current.destination = extracted.destination;
    if (extracted.start_date) current.start_date = extracted.start_date;
    if (extracted.end_date) current.end_date = extracted.end_date;
    if (extracted.budget) current.budget = extracted.budget;
    if (extracted.travelers) current.travelers = extracted.travelers;
    if (extracted.travel_style) current.travel_style = extracted.travel_style;
    if (extracted.priority) current.priority = extracted.priority;
    if (extracted.accommodation_type) current.accommodation_type = extracted.accommodation_type;
    
    // Merge interests
    if (extracted.interests && extracted.interests.length > 0) {
      const currentInterests = current.interests || [];
      current.interests = Array.from(new Set([...currentInterests, ...extracted.interests]));
    }
  }

  // Determine next conversation stage
  private determineNextStage(context: ConversationContext): ConversationStage {
    const prefs = context.extracted_preferences;
    
    if (!prefs.destination) return 'destination_discovery';
    if (!prefs.start_date || !prefs.end_date) return 'date_selection';
    if (!prefs.budget) return 'budget_setting';
    if (!prefs.interests || prefs.interests.length === 0) return 'interest_gathering';
    if (!prefs.travel_style || !prefs.priority) return 'preference_refinement';
    if (prefs.completeness_score >= 70) return 'itinerary_preview';
    
    return 'preference_refinement';
  }

  // Generate contextual response based on stage
  private async generateResponse(
    context: ConversationContext,
    extractedInfo: Partial<TripPreferences>
  ): Promise<Omit<ConversationResponse, 'updated_context' | 'progress_percentage'>> {
    const stage = context.current_stage;
    const prefs = context.extracted_preferences;
    
    switch (stage) {
      case 'greeting':
        return {
          message: "Hello! I'm excited to help you plan your perfect Indian getaway! To get started, tell me - where in India are you dreaming of visiting?",
          suggestions: ["I want to explore Rajasthan", "Beach vacation in Goa", "Hill stations in Himachal", "I'm not sure yet"],
          quick_replies: [
            { text: "🏰 Heritage", value: "heritage destinations" },
            { text: "🏖️ Beaches", value: "beach destinations" },
            { text: "⛰️ Mountains", value: "mountain destinations" },
            { text: "🌴 Nature", value: "nature destinations" }
          ]
        };
      
      case 'destination_discovery':
        if (extractedInfo.interests && extractedInfo.interests.length > 0) {
          const suggestions = this.getDestinationSuggestionsForInterests(extractedInfo.interests);
          return {
            message: `Based on your interest in ${extractedInfo.interests.join(' and ')}, I'd recommend ${suggestions.join(', ')}. Which appeals to you most?`,
            suggestions: suggestions,
            quick_replies: suggestions.map(dest => ({ text: dest, value: dest }))
          };
        }
        return {
          message: "What kind of experience are you looking for? Adventure, relaxation, culture, or something else?",
          quick_replies: [
            { text: "🎭 Culture & Heritage", value: "heritage and culture" },
            { text: "🏔️ Adventure Sports", value: "adventure activities" },
            { text: "🧘 Wellness & Spa", value: "relaxation and wellness" },
            { text: "🍽️ Food Journey", value: "culinary experiences" }
          ]
        };
      
      case 'date_selection':
        return {
          message: `Perfect! ${prefs.destination} is a wonderful choice! When are you planning to visit? You can tell me the month or specific dates.`,
          suggestions: ["Next month", "In 2 weeks", "December 2024", "Flexible dates"],
          action: {
            type: 'show_calendar',
            data: { destination: prefs.destination }
          }
        };
      
      case 'budget_setting':
        const durationHint = prefs.start_date && prefs.end_date 
          ? this.calculateDays(prefs.start_date, prefs.end_date)
          : 5;
        
        return {
          message: `Great! Now, what's your budget per person for this ${durationHint}-day trip? This helps me tailor the perfect experience for you.`,
          suggestions: [
            "₹15,000 - Budget friendly",
            "₹25,000 - Comfortable",
            "₹50,000+ - Luxury"
          ],
          action: {
            type: 'show_budget_slider',
            data: { min: 10000, max: 100000, suggested: 25000 }
          }
        };
      
      case 'interest_gathering':
        return {
          message: `Wonderful! ${prefs.destination} has so much to offer. What activities interest you most? Feel free to pick multiple!`,
          quick_replies: [
            { text: "🏛️ Heritage Sites", value: "heritage" },
            { text: "🎨 Local Culture", value: "culture" },
            { text: "🍜 Street Food", value: "food" },
            { text: "🏞️ Nature", value: "nature" },
            { text: "📸 Photography", value: "photography" },
            { text: "🛍️ Shopping", value: "shopping" }
          ]
        };
      
      case 'preference_refinement':
        return {
          message: `Almost there! A few more details: How would you describe your travel style?`,
          quick_replies: [
            { text: "🧘 Relaxed pace", value: "relaxed" },
            { text: "⚖️ Balanced mix", value: "moderate" },
            { text: "⚡ Action-packed", value: "packed" }
          ]
        };
      
      case 'itinerary_preview':
        const summary = this.createTripSummary(prefs);
        return {
          message: `Perfect! Here's what I have:\n\n${summary}\n\nShall I generate your complete personalized itinerary now?`,
          quick_replies: [
            { text: "✅ Yes, generate it!", value: "generate" },
            { text: "✏️ Make changes", value: "modify" },
            { text: "💡 Show me options", value: "alternatives" }
          ],
          action: {
            type: 'generate_itinerary',
            data: prefs
          }
        };
      
      default:
        return {
          message: "Tell me more about what you're looking for in your trip!",
          suggestions: ["Change destination", "Adjust budget", "Modify dates"]
        };
    }
  }

  // Helper: Get destination suggestions based on interests
  private getDestinationSuggestionsForInterests(interests: string[]): string[] {
    const destinationMap: Record<string, string[]> = {
      heritage: ['Jaipur', 'Udaipur', 'Hampi', 'Agra'],
      adventure: ['Manali', 'Rishikesh', 'Ladakh', 'Coorg'],
      nature: ['Kerala', 'Coorg', 'Munnar', 'Darjeeling'],
      food: ['Jaipur', 'Mumbai', 'Delhi', 'Lucknow'],
      beach: ['Goa', 'Andaman', 'Gokarna', 'Pondicherry'],
      nightlife: ['Goa', 'Mumbai', 'Bangalore', 'Delhi'],
      spiritual: ['Rishikesh', 'Varanasi', 'Amritsar', 'Haridwar']
    };
    
    const suggestions = new Set<string>();
    for (const interest of interests) {
      const dests = destinationMap[interest] || [];
      dests.forEach(d => suggestions.add(d));
    }
    
    return Array.from(suggestions).slice(0, 4);
  }

  // Helper: Calculate days between dates
  private calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  // Helper: Create trip summary
  private createTripSummary(prefs: TripPreferences): string {
    const parts = [];
    
    if (prefs.destination) parts.push(`📍 Destination: ${prefs.destination}`);
    if (prefs.start_date && prefs.end_date) {
      const days = this.calculateDays(prefs.start_date, prefs.end_date);
      parts.push(`📅 Duration: ${days} days`);
    }
    if (prefs.budget) parts.push(`💰 Budget: ₹${prefs.budget.toLocaleString()} per person`);
    if (prefs.travelers) parts.push(`👥 Travelers: ${prefs.travelers}`);
    if (prefs.interests && prefs.interests.length > 0) {
      parts.push(`🎯 Interests: ${prefs.interests.join(', ')}`);
    }
    if (prefs.travel_style) parts.push(`⚡ Style: ${prefs.travel_style}`);
    
    return parts.join('\n');
  }

  // Calculate completeness percentage
  private calculateProgress(prefs: TripPreferences): number {
    let score = 0;
    const weights = {
      destination: 25,
      dates: 20,
      budget: 20,
      travelers: 10,
      interests: 15,
      travel_style: 5,
      priority: 5
    };
    
    if (prefs.destination) score += weights.destination;
    if (prefs.start_date && prefs.end_date) score += weights.dates;
    if (prefs.budget) score += weights.budget;
    if (prefs.travelers) score += weights.travelers;
    if (prefs.interests && prefs.interests.length > 0) score += weights.interests;
    if (prefs.travel_style) score += weights.travel_style;
    if (prefs.priority) score += weights.priority;
    
    return score;
  }

  // Get conversation history
  async getConversation(conversationId: string): Promise<ConversationContext | null> {
    // In production, retrieve from database
    // For demo, return null (would be implemented with KV store)
    return null;
  }

  // Export conversation to trip data format
  convertToTripData(preferences: TripPreferences): Record<string, any> {
    return {
      destination: preferences.destination || '',
      startDate: preferences.start_date || '',
      endDate: preferences.end_date || '',
      budget: preferences.budget || 25000,
      currency: 'INR',
      travelers: preferences.travelers || 2,
      interests: preferences.interests || [],
      travelStyle: preferences.travel_style || 'moderate',
      priorityType: preferences.priority || 'experience',
      accommodationType: preferences.accommodation_type || 'hotel',
      transportPreference: ['train', 'car'],
      mealPreferences: ['local'],
      accessibility: preferences.accessibility_needs || [],
      mustVisit: preferences.must_visit?.join(', ') || '',
      language: 'en'
    };
  }
}

export const conversationalAI = new ConversationalAIService();
