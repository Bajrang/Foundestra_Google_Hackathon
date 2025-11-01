import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Loader2, 
  MapPin, 
  Calendar, 
  IndianRupee,
  Heart,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestions?: string[];
  quick_replies?: Array<{ text: string; value: string; icon?: string }>;
}

interface ConversationalPlanningChatProps {
  onComplete: (tripData: any) => void;
  onProgress?: (progress: number) => void;
}

export function ConversationalPlanningChat({ 
  onComplete, 
  onProgress 
}: ConversationalPlanningChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [extractedPreferences, setExtractedPreferences] = useState<any>({});
  const [currentStage, setCurrentStage] = useState<string>('greeting');
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startConversation();
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (onProgress) {
      onProgress(progress);
    }
  }, [progress, onProgress]);

  const startConversation = async () => {
    setIsLoading(true);
    
    try {
      const projectId = 'figma-make-ai-travel';
      const publicAnonKey = 'demo-key';
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f7922768/conversation/start`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId: 'demo-user' })
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to start conversation');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setConversationId(data.conversation.conversation_id);
        
        // Add initial assistant message
        const assistantMessage = data.conversation.messages.find((m: any) => m.role === 'assistant');
        if (assistantMessage) {
          setMessages([assistantMessage]);
        }
      }
      
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Failed to start conversation');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    
    if (!text || !conversationId) return;
    
    // Add user message to UI
    const userMessage: Message = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const projectId = 'figma-make-ai-travel';
      const publicAnonKey = 'demo-key';
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f7922768/conversation/message`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            conversationId,
            message: text
          })
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Add assistant response
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response.message,
          timestamp: new Date().toISOString(),
          suggestions: data.response.suggestions,
          quick_replies: data.response.quick_replies
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setProgress(data.response.progress_percentage);
        setExtractedPreferences(data.response.updated_context.extracted_preferences);
        setCurrentStage(data.response.updated_context.current_stage);
        
        // Check if ready to generate itinerary
        if (data.response.action?.type === 'generate_itinerary') {
          handleGenerateItinerary();
        }
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleGenerateItinerary = async () => {
    if (!conversationId) return;
    
    try {
      const projectId = 'figma-make-ai-travel';
      const publicAnonKey = 'demo-key';
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f7922768/conversation/convert-to-trip`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ conversationId })
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to convert conversation');
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Perfect! Generating your itinerary...');
        onComplete(data.tripData);
      }
      
    } catch (error) {
      console.error('Error converting conversation:', error);
      toast.error('Failed to generate itinerary');
    }
  };

  const handleQuickReply = (reply: { text: string; value: string }) => {
    sendMessage(reply.value);
  };

  const getStageIcon = () => {
    switch (currentStage) {
      case 'destination_discovery':
        return <MapPin className="w-4 h-4" />;
      case 'date_selection':
        return <Calendar className="w-4 h-4" />;
      case 'budget_setting':
        return <IndianRupee className="w-4 h-4" />;
      case 'interest_gathering':
        return <Heart className="w-4 h-4" />;
      case 'itinerary_preview':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStageName = () => {
    const stageNames: Record<string, string> = {
      greeting: 'Getting Started',
      destination_discovery: 'Choosing Destination',
      date_selection: 'Selecting Dates',
      budget_setting: 'Setting Budget',
      interest_gathering: 'Exploring Interests',
      preference_refinement: 'Fine-tuning',
      itinerary_preview: 'Ready to Generate',
      completed: 'Completed'
    };
    
    return stageNames[currentStage] || 'Planning';
  };

  return (
    <Card className="h-[600px] flex flex-col bg-white shadow-xl border-2 border-purple-200">
      <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50 pb-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <span className="text-xl">AI Travel Assistant</span>
                <p className="text-sm font-normal text-gray-600">Chat to plan your trip</p>
              </div>
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                {getStageIcon()}
                {getStageName()}
              </Badge>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Trip Planning Progress</span>
              <span className="font-semibold text-purple-600">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Extracted Preferences Summary */}
          {Object.keys(extractedPreferences).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {extractedPreferences.destination && (
                <Badge variant="outline" className="gap-1">
                  <MapPin className="w-3 h-3" />
                  {extractedPreferences.destination}
                </Badge>
              )}
              {extractedPreferences.budget && (
                <Badge variant="outline" className="gap-1">
                  <IndianRupee className="w-3 h-3" />
                  ₹{extractedPreferences.budget.toLocaleString()}
                </Badge>
              )}
              {extractedPreferences.travelers && (
                <Badge variant="outline">
                  👥 {extractedPreferences.travelers} travelers
                </Badge>
              )}
              {extractedPreferences.interests && extractedPreferences.interests.length > 0 && (
                <Badge variant="outline">
                  ❤️ {extractedPreferences.interests.length} interests
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className="space-y-2">
                <div className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-purple-600" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                    <div 
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === 'user' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    
                    {/* Quick Replies */}
                    {message.quick_replies && message.quick_replies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.quick_replies.map((reply, idx) => (
                          <Button
                            key={idx}
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickReply(reply)}
                            className="text-sm h-auto py-1.5 px-3"
                            disabled={isLoading}
                          >
                            {reply.text}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Suggestions:
                        </p>
                        {message.suggestions.map((suggestion, idx) => (
                          <div 
                            key={idx}
                            onClick={() => sendMessage(suggestion)}
                            className="text-sm text-blue-600 cursor-pointer hover:underline"
                          >
                            • {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-purple-600" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                    <span className="text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type your message... (Press Enter to send)"
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={() => sendMessage()}
              disabled={isLoading || !inputValue.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            Powered by Vertex AI • Speak naturally, I understand context!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
