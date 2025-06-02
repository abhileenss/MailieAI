import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import EmailCategorizationSimple from './email-categorization-simple';
import PhoneSetup from './phone-setup';
import GuidedFooter from '@/components/ui/guided-footer';
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Phone, 
  CheckCircle,
  Sparkles
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
    id: 'setup',
    title: 'Setup',
    description: 'Voice & phone settings',
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

export default function GuidedApp() {
  const [currentStep, setCurrentStep] = useState('categorize');
  const [steps, setSteps] = useState(APP_STEPS);
  const [, setLocation] = useLocation();

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
      case 'setup':
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
      case 'setup':
        return <PhoneSetup />;
      case 'complete':
        return (
          <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="max-w-2xl w-full text-center">
              <div className="bg-zinc-900 border border-zinc-800 p-12 rounded-2xl shadow-xl">
                <Sparkles className="w-16 h-16 text-orange-400 mx-auto mb-6" />
                <h1 className="text-4xl font-bold text-white mb-6">Setup Complete!</h1>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Your PookAi voice assistant is now configured and ready to manage your emails intelligently.
                </p>
                
                {/* Configuration Summary */}
                <div className="bg-zinc-800 rounded-xl p-6 mb-8 text-left">
                  <h3 className="text-white font-semibold mb-4 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Configuration Summary
                  </h3>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span>Email Processing:</span>
                      <span className="text-green-400">✓ Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AI Categorization:</span>
                      <span className="text-green-400">✓ Configured</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phone Verification:</span>
                      <span className="text-green-400">✓ Verified</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Voice Calls:</span>
                      <span className="text-green-400">✓ Ready</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => setLocation('/main-dashboard')}
                  className="bg-orange-400 hover:bg-orange-500 text-black font-semibold px-8 py-3 text-lg"
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
      <div className="min-h-screen pb-40">
        {renderCurrentStep()}
      </div>

      {/* Guided Footer */}
      <GuidedFooter
        currentStep={currentStep}
        steps={steps}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onStepClick={handleStepClick}
        canProceed={canProceed()}
        nextLabel={currentStep === 'dashboard' ? 'Start Using PookAi' : 'Continue'}
      />
    </div>
  );
}