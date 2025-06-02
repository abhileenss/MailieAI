import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import EmailCategorizationSimple from './email-categorization-simple';
import SetupPreferences from './setup-preferences';
import PhoneSetup from './phone-setup';
import GuidedFooter from '@/components/ui/guided-footer';
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Phone, 
  CheckCircle,
  Sparkles,
  Settings
} from "lucide-react";

const APP_STEPS = [
  {
    id: 'categorize',
    title: 'Categorize',
    description: 'Sort your email senders',
    icon: Mail,
    completed: false,
    active: true
  },
  {
    id: 'preferences',
    title: 'Setup',
    description: 'Configure preferences',
    icon: Settings,
    completed: false,
    active: false
  },
  {
    id: 'phone',
    title: 'Verify',
    description: 'Phone verification',
    icon: Phone,
    completed: false,
    active: false
  },
  {
    id: 'complete',
    title: 'Complete',
    description: 'Ready to use',
    icon: Sparkles,
    completed: false,
    active: false
  }
];

interface UserPreferences {
  newsletters: { action: 'call' | 'digest' | 'ignore'; callTiming?: number };
  promotional: { action: 'call' | 'digest' | 'ignore'; callTiming?: number };
  events: { action: 'call' | 'digest' | 'ignore'; callTiming?: number };
  tools: { action: 'call' | 'digest' | 'ignore'; callTiming?: number };
  morningCall: { enabled: boolean; time: string; timezone: string };
  eventReminders: { enabled: boolean; defaultTiming: number; workshopTiming: number; meetingTiming: number };
  voiceId: string;
  callSpeed: number;
}

export default function GuidedApp() {
  const [currentStep, setCurrentStep] = useState('categorize');
  const [steps, setSteps] = useState(APP_STEPS);
  const [, setLocation] = useLocation();
  const [preferences, setPreferences] = useState<UserPreferences>({
    newsletters: { action: 'digest' },
    promotional: { action: 'ignore' },
    events: { action: 'call', callTiming: 15 },
    tools: { action: 'digest' },
    morningCall: { enabled: true, time: '08:00', timezone: 'America/Los_Angeles' },
    eventReminders: { enabled: true, defaultTiming: 15, workshopTiming: 30, meetingTiming: 10 },
    voiceId: 'rachel',
    callSpeed: 1.0
  });

  // Update step completion status
  useEffect(() => {
    setSteps(prevSteps => 
      prevSteps.map(step => ({
        ...step,
        active: step.id === currentStep,
        completed: step.id === 'categorize' && currentStep !== 'categorize'
      }))
    );
  }, [currentStep]);

  const handleNext = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const handleStepClick = (stepId: string) => {
    setCurrentStep(stepId);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'categorize':
        return true;
      case 'preferences':
        return true;
      case 'phone':
        return true;
      case 'complete':
        return true;
      default:
        return false;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'categorize':
        return <EmailCategorizationSimple />;
      case 'preferences':
        return <SetupPreferences />;
      case 'phone':
        return <PhoneSetup />;
      case 'complete':
        return (
          <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-red-600 flex items-center justify-center p-6 relative">
            {/* Subtle overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            
            <div className="max-w-2xl w-full text-center relative z-10">
              <div className="bg-black/90 backdrop-blur-sm border border-white/10 p-12 rounded-3xl shadow-2xl">
                <Sparkles className="w-20 h-20 text-orange-300 mx-auto mb-6" />
                <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">Setup Complete!</h1>
                <p className="text-white/80 text-xl mb-10 leading-relaxed font-light">
                  Your mailieAI voice assistant is now configured and ready to manage your emails intelligently.
                </p>
                
                {/* Configuration Summary */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-10 text-left">
                  <h3 className="text-white font-semibold text-lg mb-6 flex items-center">
                    <span className="w-3 h-3 bg-orange-400 rounded-full mr-3 shadow-lg shadow-orange-400/50"></span>
                    Configuration Summary
                  </h3>
                  <div className="space-y-4 text-base">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-white/70">Email Processing:</span>
                      <span className="text-orange-300 font-medium">✓ Active</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-white/70">AI Categorization:</span>
                      <span className="text-orange-300 font-medium">✓ Configured</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-white/70">Phone Verification:</span>
                      <span className="text-orange-300 font-medium">✓ Verified</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-white/70">Voice Calls:</span>
                      <span className="text-orange-300 font-medium">✓ Ready</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => setLocation('/main-dashboard')}
                  className="bg-white text-black hover:bg-orange-50 font-semibold px-10 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Launch Dashboard
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return <EmailCategorizationSimple />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content Area with proper padding for footer */}
      <div className={`min-h-screen ${currentStep !== 'complete' ? 'pb-40' : ''}`}>
        {renderCurrentStep()}
      </div>

      {/* Guided Footer - Hide on complete step */}
      {currentStep !== 'complete' && (
        <GuidedFooter
          currentStep={currentStep}
          steps={steps}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onStepClick={handleStepClick}
          canProceed={canProceed()}
          nextLabel={currentStep === 'dashboard' ? 'Start Using PookAi' : 'Continue'}
        />
      )}
    </div>
  );
}