import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import MainDashboard from './main-dashboard';
import CallActionCenter from './call-action-center';
import CallConfig from './call-config';
import NotificationPreferences from './notification-preferences';
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
    id: 'preferences',
    title: 'Calls',
    description: 'Review urgent items',
    icon: Phone,
    completed: false,
    active: false
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
    } else if (currentStep === 'complete') {
      // Navigate to main dashboard when flow is complete
      setLocation('/dashboard');
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
      case 'preferences':
        return <NotificationPreferences />;
      case 'verify':
        return <CallConfig />;
      case 'complete':
        return (
          <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center p-8">
              <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-8 rounded-xl shadow-2xl mb-8">
                <CheckCircle className="w-20 h-20 text-black mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-black mb-4">PookAi is Ready!</h1>
                <p className="text-black/90 text-lg">
                  Your AI voice assistant is now configured and ready to manage your emails.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="text-center p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                  <Mail className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <p className="font-medium text-white">102 Senders</p>
                  <p className="text-xs text-gray-400">Categorized</p>
                </div>
                <div className="text-center p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                  <Phone className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <p className="font-medium text-white">Voice Ready</p>
                  <p className="text-xs text-gray-400">Phone Verified</p>
                </div>
                <div className="text-center p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                  <BarChart3 className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <p className="font-medium text-white">AI Active</p>
                  <p className="text-xs text-gray-400">Monitoring</p>
                </div>
              </div>
            </div>
          </div>
        );
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