import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import MainDashboard from './main-dashboard';
import CallActionCenter from './call-action-center';
import CallConfig from './call-config';
import GuidedFooter from '@/components/ui/guided-footer';
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Phone, 
  Settings, 
  BarChart3,
  CheckCircle 
} from "lucide-react";

const APP_STEPS = [
  {
    id: 'connect',
    title: 'Connect',
    description: 'Gmail setup',
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
    id: 'categorize',
    title: 'Categorize',
    description: 'Sort your emails',
    icon: Settings,
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
  const [currentStep, setCurrentStep] = useState('connect');
  const [steps, setSteps] = useState(APP_STEPS);
  const [, setLocation] = useLocation();
  const [hasProcessedEmails, setHasProcessedEmails] = useState(false);

  useEffect(() => {
    // Check if user already has processed emails
    fetch('/api/emails/processed')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.totalSenders > 0) {
          setHasProcessedEmails(true);
        }
      })
      .catch(() => {});
  }, []);

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

  const handleStepAction = (stepId: string) => {
    switch (stepId) {
      case 'connect':
        setLocation('/gmail-connect');
        break;
      case 'verify':
        setLocation('/phone-verify');
        break;
      case 'categorize':
        setLocation('/email-dashboard');
        break;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'connect':
        return (
          <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold mb-4">Welcome to PookAi</h2>
              <p className="text-muted-foreground mb-6">
                {hasProcessedEmails 
                  ? "Your emails are already processed! Choose how to proceed:"
                  : "Let's connect your Gmail account to start categorizing your emails"
                }
              </p>
              {hasProcessedEmails ? (
                <div className="space-y-3">
                  <Button onClick={() => setLocation('/email-dashboard')} size="lg" className="w-full">
                    Go to Email Dashboard
                  </Button>
                  <Button onClick={() => setLocation('/full-dashboard')} variant="outline" size="lg" className="w-full">
                    Advanced Dashboard
                  </Button>
                  <Button onClick={() => handleStepAction('connect')} variant="ghost" size="sm">
                    Setup from scratch
                  </Button>
                </div>
              ) : (
                <Button onClick={() => handleStepAction('connect')} size="lg">
                  Connect Gmail Account
                </Button>
              )}
            </div>
          </div>
        );
      case 'verify':
        return (
          <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold mb-4">Verify Your Phone</h2>
              <p className="text-muted-foreground mb-6">
                Add your phone number to receive voice call notifications
              </p>
              <Button onClick={() => handleStepAction('verify')} size="lg">
                Verify Phone Number
              </Button>
            </div>
          </div>
        );
      case 'categorize':
        return (
          <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold mb-4">Manage Your Emails</h2>
              <p className="text-muted-foreground mb-6">
                Review and manage your categorized email senders
              </p>
              <Button onClick={() => handleStepAction('categorize')} size="lg">
                View Email Dashboard
              </Button>
            </div>
          </div>
        );
      case 'complete':
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center p-8">
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-8 rounded-3xl shadow-2xl neo-pop-shadow mb-8">
                <CheckCircle className="w-20 h-20 text-white mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-white mb-4">PookAi is Ready!</h1>
                <p className="text-white/90 text-lg">
                  Your AI voice assistant is now configured and ready to manage your emails.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="text-center p-4 bg-card rounded-2xl neo-pop-card">
                  <Mail className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="font-medium">102 Senders</p>
                  <p className="text-xs text-muted-foreground">Categorized</p>
                </div>
                <div className="text-center p-4 bg-card rounded-2xl neo-pop-card">
                  <Phone className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium">Voice Ready</p>
                  <p className="text-xs text-muted-foreground">Phone Verified</p>
                </div>
                <div className="text-center p-4 bg-card rounded-2xl neo-pop-card">
                  <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="font-medium">AI Active</p>
                  <p className="text-xs text-muted-foreground">Monitoring</p>
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