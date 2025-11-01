// Voice Service using Google Cloud Speech-to-Text and Text-to-Speech APIs
// Enables hands-free trip planning via voice commands

export interface VoiceTranscription {
  transcript: string;
  confidence: number;
  language: string;
  duration_seconds: number;
  detected_intent?: TripIntent;
}

export interface TripIntent {
  type: 'destination' | 'dates' | 'budget' | 'interests' | 'travelers' | 'complete_query';
  extracted_data: Record<string, any>;
  confidence: number;
}

export interface VoiceResponse {
  text: string;
  audio_url?: string;
  suggestions?: string[];
}

export class VoiceService {
  private projectId: string;
  private location: string;
  private speechEndpoint: string;
  private ttsEndpoint: string;

  constructor() {
    this.projectId = Deno.env.get('GOOGLE_CLOUD_PROJECT') || 'figma-make-ai-travel';
    this.location = 'global';
    this.speechEndpoint = 'https://speech.googleapis.com/v1/speech:recognize';
    this.ttsEndpoint = 'https://texttospeech.googleapis.com/v1/text:synthesize';
  }

  // Transcribe audio to text using Speech-to-Text API
  async transcribeAudio(audioData: ArrayBuffer, options?: {
    language?: string;
    model?: string;
  }): Promise<VoiceTranscription> {
    try {
      console.log('Transcribing audio...');
      
      // In production, call Google Cloud Speech-to-Text API
      // For demo, simulate transcription
      
      const language = options?.language || 'en-IN'; // Indian English
      const model = options?.model || 'default';
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock transcription results (in production, parse actual API response)
      const mockTranscripts = [
        {
          text: "I want to plan a 5 day trip to Jaipur with a budget of 25000 rupees for 2 people",
          intent: {
            type: 'complete_query' as const,
            extracted_data: {
              destination: 'Jaipur',
              duration_days: 5,
              budget: 25000,
              travelers: 2,
              currency: 'INR'
            },
            confidence: 0.92
          }
        },
        {
          text: "Show me heritage and culture activities in Rajasthan",
          intent: {
            type: 'interests' as const,
            extracted_data: {
              interests: ['heritage', 'culture'],
              destination: 'Rajasthan'
            },
            confidence: 0.88
          }
        },
        {
          text: "I want to go to Goa next month for adventure sports and nightlife",
          intent: {
            type: 'complete_query' as const,
            extracted_data: {
              destination: 'Goa',
              interests: ['adventure', 'nightlife'],
              timeframe: 'next month'
            },
            confidence: 0.85
          }
        }
      ];
      
      // Select random mock response
      const mockResult = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      
      return {
        transcript: mockResult.text,
        confidence: mockResult.intent.confidence,
        language: language,
        duration_seconds: 3.5,
        detected_intent: mockResult.intent
      };
      
    } catch (error) {
      console.error('Transcription error:', error);
      throw new Error(`Failed to transcribe audio: ${error.message}`);
    }
  }

  // Extract trip planning intent from transcribed text using NLP
  async extractTripIntent(text: string): Promise<TripIntent> {
    try {
      console.log('Extracting intent from:', text);
      
      const textLower = text.toLowerCase();
      const extractedData: Record<string, any> = {};
      
      // Extract destination
      const destinations = ['jaipur', 'goa', 'kerala', 'manali', 'udaipur', 'rishikesh', 'hampi', 'coorg', 'mumbai', 'delhi', 'bangalore'];
      for (const dest of destinations) {
        if (textLower.includes(dest)) {
          extractedData.destination = dest.charAt(0).toUpperCase() + dest.slice(1);
          break;
        }
      }
      
      // Extract duration
      const durationMatch = textLower.match(/(\d+)\s*(day|days|night|nights)/);
      if (durationMatch) {
        extractedData.duration_days = parseInt(durationMatch[1]);
      }
      
      // Extract budget
      const budgetMatch = textLower.match(/(\d+)\s*(thousand|k|rupees|inr|₹)/);
      if (budgetMatch) {
        let budget = parseInt(budgetMatch[1]);
        if (budgetMatch[2] === 'thousand' || budgetMatch[2] === 'k') {
          budget *= 1000;
        }
        extractedData.budget = budget;
        extractedData.currency = 'INR';
      }
      
      // Extract number of travelers
      const travelersMatch = textLower.match(/(\d+)\s*(people|person|travelers|travellers|pax)/);
      if (travelersMatch) {
        extractedData.travelers = parseInt(travelersMatch[1]);
      }
      
      // Extract interests
      const interestKeywords = {
        heritage: ['heritage', 'culture', 'historical', 'monument', 'palace', 'fort'],
        adventure: ['adventure', 'trekking', 'hiking', 'sports', 'paragliding'],
        nature: ['nature', 'wildlife', 'forest', 'mountains', 'scenic'],
        food: ['food', 'cuisine', 'culinary', 'street food', 'restaurant'],
        beach: ['beach', 'coastal', 'seaside', 'ocean'],
        nightlife: ['nightlife', 'party', 'clubs', 'bars', 'entertainment'],
        spiritual: ['spiritual', 'temple', 'religious', 'meditation', 'yoga'],
        photography: ['photography', 'instagram', 'photos', 'pictures']
      };
      
      const detectedInterests: string[] = [];
      for (const [interest, keywords] of Object.entries(interestKeywords)) {
        if (keywords.some(keyword => textLower.includes(keyword))) {
          detectedInterests.push(interest);
        }
      }
      if (detectedInterests.length > 0) {
        extractedData.interests = detectedInterests;
      }
      
      // Extract dates
      const datePatterns = [
        /next (week|month|weekend)/,
        /(january|february|march|april|may|june|july|august|september|october|november|december)/,
        /in (\d+) (weeks|months)/
      ];
      
      for (const pattern of datePatterns) {
        const match = textLower.match(pattern);
        if (match) {
          extractedData.timeframe = match[0];
          break;
        }
      }
      
      // Determine intent type
      let intentType: TripIntent['type'] = 'complete_query';
      if (Object.keys(extractedData).length === 1) {
        if (extractedData.destination) intentType = 'destination';
        else if (extractedData.interests) intentType = 'interests';
        else if (extractedData.budget) intentType = 'budget';
        else if (extractedData.travelers) intentType = 'travelers';
      }
      
      // Calculate confidence based on extracted data completeness
      const confidence = Math.min(0.95, 0.6 + (Object.keys(extractedData).length * 0.08));
      
      return {
        type: intentType,
        extracted_data: extractedData,
        confidence: confidence
      };
      
    } catch (error) {
      console.error('Intent extraction error:', error);
      return {
        type: 'complete_query',
        extracted_data: {},
        confidence: 0.3
      };
    }
  }

  // Generate voice response using Text-to-Speech
  async generateVoiceResponse(text: string, options?: {
    language?: string;
    voice_name?: string;
    speaking_rate?: number;
  }): Promise<VoiceResponse> {
    try {
      console.log('Generating voice response for:', text);
      
      const language = options?.language || 'en-IN';
      const voiceName = options?.voice_name || 'en-IN-Wavenet-D';
      const speakingRate = options?.speaking_rate || 1.0;
      
      // In production, call Google Cloud Text-to-Speech API
      // For demo, return text with mock audio URL
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        text: text,
        audio_url: `https://storage.googleapis.com/${this.projectId}/tts-cache/${Date.now()}.mp3`,
        suggestions: this.generateFollowUpSuggestions(text)
      };
      
    } catch (error) {
      console.error('Voice response generation error:', error);
      throw new Error(`Failed to generate voice response: ${error.message}`);
    }
  }

  private generateFollowUpSuggestions(responseText: string): string[] {
    const suggestions: string[] = [];
    
    if (responseText.includes('destination')) {
      suggestions.push("Tell me about activities");
      suggestions.push("What's the budget?");
      suggestions.push("When do you want to go?");
    } else if (responseText.includes('budget')) {
      suggestions.push("Show me accommodation options");
      suggestions.push("What can I do there?");
    } else if (responseText.includes('itinerary')) {
      suggestions.push("Book this trip");
      suggestions.push("Make changes");
      suggestions.push("Share this itinerary");
    } else {
      suggestions.push("Plan my trip");
      suggestions.push("Show more options");
      suggestions.push("Change preferences");
    }
    
    return suggestions.slice(0, 3);
  }

  // Process voice command and generate appropriate response
  async processVoiceCommand(audioData: ArrayBuffer, currentContext?: Record<string, any>): Promise<{
    transcription: VoiceTranscription;
    response: VoiceResponse;
    action?: {
      type: string;
      data: Record<string, any>;
    };
  }> {
    try {
      // Transcribe audio
      const transcription = await this.transcribeAudio(audioData);
      
      // Extract intent if not already detected
      if (!transcription.detected_intent) {
        transcription.detected_intent = await this.extractTripIntent(transcription.transcript);
      }
      
      // Generate contextual response
      const responseText = this.generateContextualResponse(transcription.detected_intent, currentContext);
      const voiceResponse = await this.generateVoiceResponse(responseText);
      
      // Determine action to take
      const action = this.determineAction(transcription.detected_intent);
      
      return {
        transcription,
        response: voiceResponse,
        action
      };
      
    } catch (error) {
      console.error('Voice command processing error:', error);
      
      // Return error response
      return {
        transcription: {
          transcript: '',
          confidence: 0,
          language: 'en-IN',
          duration_seconds: 0
        },
        response: {
          text: "I'm sorry, I couldn't understand that. Could you please try again?",
          suggestions: ["Try speaking clearly", "Use simple phrases"]
        }
      };
    }
  }

  private generateContextualResponse(intent: TripIntent, context?: Record<string, any>): string {
    const { type, extracted_data } = intent;
    
    switch (type) {
      case 'destination':
        return `Great! You want to visit ${extracted_data.destination}. How many days are you planning for, and what's your budget?`;
      
      case 'dates':
        return `Perfect! You're planning for ${extracted_data.timeframe || extracted_data.duration_days + ' days'}. What's your budget for this trip?`;
      
      case 'budget':
        return `Understood. Your budget is ₹${extracted_data.budget}. What kind of experiences are you looking for - heritage, adventure, nature, or something else?`;
      
      case 'interests':
        return `Excellent! You're interested in ${extracted_data.interests?.join(', ')}. Let me suggest some perfect destinations for you.`;
      
      case 'travelers':
        return `Got it, ${extracted_data.travelers} travelers. Where would you like to go?`;
      
      case 'complete_query':
        const parts = [];
        if (extracted_data.destination) parts.push(`${extracted_data.destination}`);
        if (extracted_data.duration_days) parts.push(`${extracted_data.duration_days} days`);
        if (extracted_data.budget) parts.push(`₹${extracted_data.budget} budget`);
        if (extracted_data.travelers) parts.push(`${extracted_data.travelers} travelers`);
        
        return `Perfect! I'm planning a ${parts.join(', ')} trip${extracted_data.interests ? ' with focus on ' + extracted_data.interests.join(' and ') : ''}. Let me generate your personalized itinerary!`;
      
      default:
        return "I'm listening. Tell me about your dream trip - where, when, and what you'd like to experience!";
    }
  }

  private determineAction(intent: TripIntent): { type: string; data: Record<string, any> } | undefined {
    if (intent.type === 'complete_query' && intent.extracted_data.destination) {
      return {
        type: 'generate_itinerary',
        data: intent.extracted_data
      };
    }
    
    if (intent.type === 'destination' || intent.type === 'interests') {
      return {
        type: 'update_preferences',
        data: intent.extracted_data
      };
    }
    
    return undefined;
  }

  // Multilingual support - detect and process multiple Indian languages
  async processMultilingualVoice(audioData: ArrayBuffer, languageHint?: string): Promise<VoiceTranscription> {
    const supportedLanguages = [
      'en-IN', // English (India)
      'hi-IN', // Hindi
      'bn-IN', // Bengali
      'te-IN', // Telugu
      'mr-IN', // Marathi
      'ta-IN', // Tamil
      'gu-IN', // Gujarati
      'kn-IN', // Kannada
    ];
    
    const language = languageHint || 'en-IN';
    
    // Transcribe with language support
    const transcription = await this.transcribeAudio(audioData, { language });
    
    // If non-English, translate to English for intent extraction
    if (language !== 'en-IN' && transcription.transcript) {
      // In production, use Google Translate API
      console.log(`Translating from ${language} to English`);
    }
    
    return transcription;
  }
}

export const voiceService = new VoiceService();
