import { Check } from "lucide-react";

interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
}

export function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
  return (
    <div className="w-full py-4 mb-6">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index < currentStep 
                  ? "bg-primary text-white" 
                  : index === currentStep 
                    ? "bg-primary/20 text-primary border-2 border-primary" 
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            <span className={`text-xs mt-1 text-center ${index === currentStep ? "font-medium" : "text-muted-foreground"}`}>
              {step}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-2">
        <div className="absolute top-0 h-1 bg-muted w-full rounded"></div>
        <div 
          className="absolute top-0 h-1 bg-primary transition-all rounded" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}