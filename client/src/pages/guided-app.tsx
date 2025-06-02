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
          <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center p-8">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 rounded-3xl shadow-2xl mb-8">
                <Sparkles className="w-20 h-20 text-black mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-black mb-4">PookAi is Ready!</h1>
                <p className="text-black/90 text-lg mb-6">
                  Your AI voice assistant is now configured and ready to manage your emails.
                </p>
                <Button
                  onClick={() => setLocation('/main-dashboard')}
                  className="bg-black text-orange-400 hover:bg-zinc-800 font-semibold px-8 py-3"
                >
                  Go to Dashboard
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