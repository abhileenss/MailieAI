import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import MainDashboard from './main-dashboard';
import CallActionCenter from './call-action-center';
import CallConfig from './call-config';
import GuidedFooter from '@/components/ui/guided-footer';
import { 
  Mail, 
  Phone, 
  Settings, 
  BarChart3,
  CheckCircle 
} from "lucide-react";

const APP_STEPS = [
  {
    id: 'categorize',
    title: 'Categorize',
    description: 'Sort your emails',
    icon: Mail,
    completed: false,
    active: true
  },
  {
    id: 'calls',
    title: 'Calls',
    description: 'Review urgent items',
    icon: Phone,
    completed: false,
    active: false
  },
  {
    id: 'setup',
    title: 'Setup',
    description: 'Configure voice',
    icon: Settings,
    completed: false,
    active: false
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Monitor activity',
    icon: BarChart3,
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
        return true; // User can always proceed from categorization
      case 'calls':
        return true;
      case 'setup':
        return true;
      case 'dashboard':
        return true;
      default:
        return false;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'categorize':
        return <MainDashboard />;
      case 'calls':
        return <CallActionCenter />;
      case 'setup':
        return <CallConfig />;
      case 'dashboard':
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Setup Complete!</h1>
              <p className="text-muted-foreground">
                Your PookAi voice assistant is now ready to manage your emails.
              </p>
            </div>
          </div>
        );
      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Main Content Area */}
      <div className="min-h-[calc(100vh-128px)]">
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