import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Mic, MicOff, Volume2, Loader2, Check, AlertCircle, Languages } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceInputWidgetProps {
  onTranscript: (transcript: string, intent?: any) => void;
  onVoiceCommand?: (command: any) => void;
  language?: string;
  disabled?: boolean;
}

export function VoiceInputWidget({ 
  onTranscript, 
  onVoiceCommand,
  language = 'en-IN',
  disabled = false 
}: VoiceInputWidgetProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const durationIntervalRef = useRef<number | null>(null);

  const supportedLanguages = [
    { code: 'en-IN', name: 'English', flag: '🇮🇳' },
    { code: 'hi-IN', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'bn-IN', name: 'বাংলা', flag: '🇮🇳' },
    { code: 'te-IN', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr-IN', name: 'मराठी', flag: '🇮🇳' },
    { code: 'ta-IN', name: 'தமிழ்', flag: '🇮🇳' }
  ];

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start duration counter
      durationIntervalRef.current = window.setInterval(() => {
        setRecordingDuration(prev => prev + 0.1);
      }, 100);
      
      // Simulate audio level visualization
      const visualizeAudio = () => {
        const level = Math.random() * 100;
        setAudioLevel(level);
        if (isRecording) {
          animationFrameRef.current = requestAnimationFrame(visualizeAudio);
        }
      };
      visualizeAudio();
      
      toast.success('Recording started - speak clearly!', {
        icon: '🎤'
      });
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (durationIntervalRef.current != null) {
        clearInterval(durationIntervalRef.current);
      }
      if (animationFrameRef.current != null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setAudioLevel(0);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', selectedLanguage);
      
      const projectId = 'figma-make-ai-travel';
      const publicAnonKey = 'demo-key';
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f7922768/voice-command`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: formData
        }
      );
      
      if (!response.ok) {
        throw new Error('Voice processing failed');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setTranscript(data.transcription.transcript);
        setConfidence(data.transcription.confidence * 100);
        
        onTranscript(data.transcription.transcript, data.transcription.detected_intent);
        
        if (data.action && onVoiceCommand) {
          onVoiceCommand(data.action);
        }
        
        toast.success('Voice command processed!', {
          description: data.transcription.transcript.substring(0, 50) + '...'
        });
      } else {
        toast.error('Could not understand audio');
      }
      
    } catch (error) {
      console.error('Audio processing error:', error);
      toast.error('Failed to process voice input');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Mic className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Voice Planning</h3>
              <p className="text-sm text-gray-600">Speak to plan your trip</p>
            </div>
          </div>
          
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-gray-400" />
            <select
              value={selectedLanguage}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedLanguage(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
              disabled={isRecording || isProcessing}
            >
              {supportedLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recording Controls */}
        <div className="flex flex-col items-center gap-4">
          {/* Main Record Button */}
          <Button
            size="lg"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={disabled || isProcessing}
            className={`w-24 h-24 rounded-full transition-all duration-300 ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200 animate-pulse' 
                : 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-10 h-10 animate-spin text-white" />
            ) : isRecording ? (
              <MicOff className="w-10 h-10 text-white" />
            ) : (
              <Mic className="w-10 h-10 text-white" />
            )}
          </Button>

          {/* Status Text */}
          <div className="text-center">
            {isRecording && (
              <div className="space-y-2">
                <Badge variant="destructive" className="animate-pulse">
                  ⏺ Recording... {recordingDuration.toFixed(1)}s
                </Badge>
                <p className="text-sm text-gray-600">Tap to stop</p>
              </div>
            )}
            {isProcessing && (
              <div className="space-y-2">
                <Badge variant="secondary">
                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                  Processing...
                </Badge>
                <p className="text-sm text-gray-600">Analyzing your voice</p>
              </div>
            )}
            {!isRecording && !isProcessing && (
              <div className="space-y-2">
                <Badge variant="secondary">
                  <Mic className="w-3 h-3 mr-1" />
                  Ready to listen
                </Badge>
                <p className="text-sm text-gray-600">Tap to start recording</p>
              </div>
            )}
          </div>

          {/* Audio Level Visualization */}
          {isRecording && (
            <div className="w-full max-w-xs">
              <Progress value={audioLevel} className="h-2" />
              <p className="text-xs text-gray-500 text-center mt-1">Audio level</p>
            </div>
          )}
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-purple-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Transcript</span>
                  <Badge variant="secondary" className="text-xs">
                    {confidence.toFixed(0)}% confidence
                  </Badge>
                </div>
                <p className="text-gray-900">{transcript}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Tips */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-xs text-blue-800">
              <p className="font-medium mb-1">Voice tips:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Speak clearly and at a moderate pace</li>
                <li>Mention destination, dates, and budget</li>
                <li>Example: "5 day Jaipur trip for 2 people, budget 25000"</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
