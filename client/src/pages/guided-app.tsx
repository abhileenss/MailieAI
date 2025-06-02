import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import EmailCategorizationSimple from './email-categorization-simple';
import PhoneSetup from './phone-setup';
import GuidedFooter from '@/components/ui/guided-footer';
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
                <p className="text-black/90 text-lg">
                  Your AI voice assistant is now configured and ready to manage your emails.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="text-center p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
                  <Mail className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="font-medium text-white">Categorized</p>
                  <p className="text-xs text-gray-400">102 Senders</p>
                </div>
                <div className="text-center p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
                  <Phone className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="font-medium text-white">Phone Verified</p>
                  <p className="text-xs text-gray-400">Voice Ready</p>
                </div>
                <div className="text-center p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
                  <Sparkles className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <p className="font-medium text-white">Monitoring</p>
                  <p className="text-xs text-gray-400">AI Active</p>
                </div>
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