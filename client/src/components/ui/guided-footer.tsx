import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Circle,
  Phone,
  Settings,
  BarChart3
} from "lucide-react";

interface Step {
  id: string;
  title: string;
  description: string;
  icon: any;
  completed: boolean;
  active: boolean;
}

interface GuidedFooterProps {
  currentStep: string;
  steps: Step[];
  onNext: () => void;
  onPrevious: () => void;
  onStepClick: (stepId: string) => void;
  canProceed: boolean;
  nextLabel?: string;
  previousLabel?: string;
}

export default function GuidedFooter({
  currentStep,
  steps,
  onNext,
  onPrevious,
  onStepClick,
  canProceed,
  nextLabel = "Continue",
  previousLabel = "Back"
}: GuidedFooterProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
      <div className="container mx-auto px-6 py-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-8 mb-4">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div
                key={step.id}
                className={`flex flex-col items-center cursor-pointer transition-colors ${
                  step.active ? 'text-primary' : step.completed ? 'text-green-500' : 'text-muted-foreground'
                }`}
                onClick={() => onStepClick(step.id)}
              >
                <div className={`relative mb-2 ${step.active ? 'scale-110' : ''} transition-transform`}>
                  {step.completed ? (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  ) : (
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      step.active 
                        ? 'border-primary bg-primary text-white' 
                        : 'border-muted-foreground'
                    }`}>
                      <StepIcon className="w-4 h-4" />
                    </div>
                  )}
                  
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className={`absolute top-4 left-8 w-16 h-0.5 ${
                      steps[index + 1].completed || steps[index + 1].active 
                        ? 'bg-primary' 
                        : 'bg-muted-foreground/30'
                    }`} />
                  )}
                </div>
                
                <div className="text-center">
                  <p className="text-xs font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isFirstStep}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{previousLabel}</span>
          </Button>

          <div className="flex items-center space-x-4">
            {/* Current Step Info */}
            <div className="text-center">
              <p className="text-sm font-medium">
                {steps[currentStepIndex]?.title}
              </p>
              <p className="text-xs text-muted-foreground">
                Step {currentStepIndex + 1} of {steps.length}
              </p>
            </div>
          </div>

          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="flex items-center space-x-2"
          >
            <span>{isLastStep ? 'Complete' : nextLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-center space-x-4 mt-3 pt-3 border-t border-border">
          <Badge variant="outline" className="text-xs">
            102 senders processed
          </Badge>
          <Badge variant="outline" className="text-xs">
            1 urgent call ready
          </Badge>
          <Badge variant="outline" className="text-xs">
            Voice setup required
          </Badge>
        </div>
      </div>
    </div>
  );
}