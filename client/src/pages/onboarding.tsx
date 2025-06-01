import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, Phone, Mic, Mail, Settings, ArrowRight, ArrowLeft } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface OnboardingProps {
  onComplete: () => void;
}

interface VoiceOption {
  id: string;
  name: string;
  accent: string;
  gender: string;
  description: string;
  preview?: string;
}

const voiceOptions: VoiceOption[] = [
  {
    id: 'morgan-freeman',
    name: 'Morgan Freeman',
    accent: 'American',
    gender: 'Male',
    description: 'Deep, authoritative voice perfect for important updates'
  },
  {
    id: 'naval-ravikant',
    name: 'Naval Ravikant',
    accent: 'American',
    gender: 'Male', 
    description: 'Calm, philosophical tone ideal for thoughtful summaries'
  },
  {
    id: 'joe-rogan',
    name: 'Joe Rogan',
    accent: 'American',
    gender: 'Male',
    description: 'Conversational and engaging for casual updates'
  },
  {
    id: 'andrew-schulz',
    name: 'Andrew Schulz',
    accent: 'American',
    gender: 'Male',
    description: 'Energetic and witty for entertaining email summaries'
  },
  {
    id: 'amitabh-bachchan',
    name: 'Amitabh Bachchan',
    accent: 'Indian',
    gender: 'Male',
    description: 'Distinguished and respected voice for professional updates'
  },
  {
    id: 'priyanka-chopra',
    name: 'Priyanka Chopra',
    accent: 'Indian',
    gender: 'Female',
    description: 'Clear and sophisticated for elegant communication'
  }
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    preferredVoice: '',
    callTiming: '',
    emailCategories: {
      'call-me': false,
      'remind-me': false,
      'newsletter': false
    },
    notificationPreferences: {
      dailyDigest: true,
      urgentAlerts: true,
      weeklyReports: true
    }
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const savePreferencesMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/preferences', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      onComplete();
    }
  });

  const scanEmailsMutation = useMutation({
    mutationFn: () => apiRequest('/api/emails/scan', { method: 'POST' }),
  });

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      
      // Trigger email scan on step 3
      if (currentStep === 2) {
        scanEmailsMutation.mutate();
      }
    } else {
      // Save all preferences and complete onboarding
      savePreferencesMutation.mutate(formData);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedFormData = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Phone className="w-16 h-16 mx-auto text-blue-500" />
              <h2 className="text-2xl font-bold text-white">Set Up Your Phone</h2>
              <p className="text-gray-400">Enter your phone number to receive voice summaries</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phoneNumber}
                  onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <p className="text-sm text-gray-500 mt-1">
                  We'll call this number with your personalized email summaries
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Mic className="w-16 h-16 mx-auto text-purple-500" />
              <h2 className="text-2xl font-bold text-white">Choose Your Voice</h2>
              <p className="text-gray-400">Select a celebrity voice for your email summaries</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {voiceOptions.map((voice) => (
                <Card 
                  key={voice.id}
                  className={`cursor-pointer transition-all bg-gray-800 border-gray-700 hover:border-purple-500 ${
                    formData.preferredVoice === voice.id ? 'border-purple-500 bg-purple-900/20' : ''
                  }`}
                  onClick={() => updateFormData('preferredVoice', voice.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-purple-600 text-white">
                          {voice.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{voice.name}</h3>
                        <p className="text-sm text-gray-400">{voice.description}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{voice.accent}</Badge>
                          <Badge variant="outline" className="text-xs">{voice.gender}</Badge>
                        </div>
                      </div>
                      {formData.preferredVoice === voice.id && (
                        <CheckCircle className="w-5 h-5 text-purple-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Mail className="w-16 h-16 mx-auto text-green-500" />
              <h2 className="text-2xl font-bold text-white">Scanning Your Emails</h2>
              <p className="text-gray-400">We're analyzing your Gmail to categorize senders</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white">Email Analysis Progress</span>
                  <span className="text-green-400">
                    {scanEmailsMutation.isSuccess ? 'Complete' : 
                     scanEmailsMutation.isPending ? 'Processing...' : 'Starting...'}
                  </span>
                </div>
                
                {scanEmailsMutation.isPending && (
                  <div className="space-y-2">
                    <div className="animate-pulse flex space-x-4">
                      <div className="rounded-full bg-gray-700 h-3 w-3"></div>
                      <div className="flex-1 py-1">
                        <div className="h-2 bg-gray-700 rounded w-3/4"></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Analyzing email patterns and senders...</p>
                  </div>
                )}
                
                {scanEmailsMutation.isSuccess && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>Found {scanEmailsMutation.data?.sendersFound || 0} unique senders</span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>Processed {scanEmailsMutation.data?.emailsProcessed || 0} emails</span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>AI categorization complete</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Settings className="w-16 h-16 mx-auto text-orange-500" />
              <h2 className="text-2xl font-bold text-white">Call Preferences</h2>
              <p className="text-gray-400">Choose when and how you want to receive calls</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-white">Preferred Call Time</Label>
                <Select 
                  value={formData.callTiming} 
                  onValueChange={(value) => updateFormData('callTiming', value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select your preferred time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (8AM - 10AM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12PM - 2PM)</SelectItem>
                    <SelectItem value="evening">Evening (6PM - 8PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label className="text-white">Which email categories should trigger calls?</Label>
                
                {[
                  { key: 'call-me', label: 'Call Me (Important/Urgent)', description: 'High-priority emails that need immediate attention' },
                  { key: 'remind-me', label: 'Remind Me (Action Required)', description: 'Emails requiring follow-up or response' },
                  { key: 'newsletter', label: 'Newsletter Updates', description: 'Summarized newsletter content' }
                ].map((category) => (
                  <div key={category.key} className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg">
                    <Checkbox
                      checked={formData.emailCategories[category.key]}
                      onCheckedChange={(checked) => 
                        updateNestedFormData('emailCategories', category.key, checked)
                      }
                      className="mt-1"
                    />
                    <div>
                      <div className="text-white font-medium">{category.label}</div>
                      <div className="text-sm text-gray-400">{category.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
              <h2 className="text-2xl font-bold text-white">Setup Complete!</h2>
              <p className="text-gray-400">Your AI email concierge is ready to work</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold text-white">Your Configuration:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Phone:</span>
                  <span className="text-white ml-2">{formData.phoneNumber}</span>
                </div>
                <div>
                  <span className="text-gray-400">Voice:</span>
                  <span className="text-white ml-2">
                    {voiceOptions.find(v => v.id === formData.preferredVoice)?.name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Call Time:</span>
                  <span className="text-white ml-2">{formData.callTiming}</span>
                </div>
                <div>
                  <span className="text-gray-400">Email Senders:</span>
                  <span className="text-white ml-2">{scanEmailsMutation.data?.sendersFound || 0} found</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  PookAi will now monitor your emails and call you with AI-suggested categorizations. 
                  You'll always have final approval on how emails are organized.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-white">Welcome to PookAi</CardTitle>
            <Badge variant="outline" className="text-xs">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStep()}
          
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <Button
              onClick={nextStep}
              disabled={
                (currentStep === 1 && !formData.phoneNumber) ||
                (currentStep === 2 && !formData.preferredVoice) ||
                (currentStep === 3 && scanEmailsMutation.isPending) ||
                (currentStep === 4 && !formData.callTiming) ||
                savePreferencesMutation.isPending
              }
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {currentStep === totalSteps ? 'Complete Setup' : 'Continue'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}