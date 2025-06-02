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
    id: 'verify',
    title: 'Verify',
    description: 'Phone verification',
    icon: CheckCircle,
    completed: false,
    active: false
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
    id: 'complete',
    title: 'Complete',
    description: 'Ready to use',
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
      case 'verify':
        setLocation('/phone-verification');
        return null;
      case 'calls':
        setLocation('/call-config');
        return null;
      case 'complete':
        setLocation('/dashboard');
        return null;
      default:
        return <MainDashboard />;
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