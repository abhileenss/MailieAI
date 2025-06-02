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
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-12 mb-6">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div
                key={step.id}
                className={`flex flex-col items-center cursor-pointer transition-colors ${
                  step.active ? 'text-orange-400' : step.completed ? 'text-green-500' : 'text-gray-500'
                }`}
                onClick={() => onStepClick(step.id)}
              >
                <div className={`relative mb-3 ${step.active ? 'scale-110' : ''} transition-transform`}>
                  {step.completed ? (
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                      step.active 
                        ? 'border-orange-400 bg-orange-400 text-black' 
                        : 'border-zinc-600 bg-zinc-800 text-gray-400'
                    }`}>
                      <StepIcon className="w-5 h-5" />
                    </div>
                  )}
                  
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className={`absolute top-6 left-12 w-20 h-0.5 ${
                      steps[index + 1].completed || steps[index + 1].active 
                        ? 'bg-orange-400' 
                        : 'bg-zinc-700'
                    }`} />
                  )}
                </div>
                
                <div className="text-center">
                  <p className={`text-sm font-medium ${step.active ? 'text-white' : 'text-gray-400'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 hidden sm:block">
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
            className="flex items-center space-x-2 bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{previousLabel}</span>
          </Button>

          <div className="text-center">
            <p className="text-white font-medium text-lg">
              {steps[currentStepIndex]?.title}
            </p>
            <p className="text-gray-400 text-sm">
              Step {currentStepIndex + 1} of {steps.length}
            </p>
          </div>

          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="flex items-center space-x-2 bg-orange-400 hover:bg-orange-500 text-black font-semibold"
          >
            <span>{isLastStep ? 'Complete' : nextLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-zinc-800">
          <div className="text-center">
            <p className="text-white font-semibold">102 senders processed</p>
          </div>
          <div className="text-center">
            <p className="text-white font-semibold">1 urgent call ready</p>
          </div>
          <div className="text-center">
            <p className="text-white font-semibold">Voice setup required</p>
          </div>
        </div>
      </div>
    </div>
  );
}