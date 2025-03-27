
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SiteFormStepperProps {
  step: number;
  setStep: (step: number) => void;
  validateStep?: (step: number) => boolean;
  completionPercentage: number;
}

export function SiteFormStepper({ 
  step, 
  setStep, 
  validateStep,
  completionPercentage
}: SiteFormStepperProps) {
  const steps = [
    'Basic Info',
    'Contacts',
    'Contract',
    'Billing',
    'Subcontractors',
    'Specifications',
    'Additional'
  ];

  const handleStepClick = (newStep: number) => {
    // Don't allow skipping ahead if validation is required
    if (newStep > step && validateStep) {
      const isValid = validateStep(step);
      if (!isValid) return;
    }
    setStep(newStep);
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold">
          Step {step + 1}: {steps[step]}
        </h2>
        <span className="text-sm text-muted-foreground">
          {completionPercentage}% Complete
        </span>
      </div>
      
      <Progress value={completionPercentage} className="h-2" />
      
      <div className="flex flex-wrap gap-2">
        {steps.map((stepName, index) => (
          <Button
            key={index}
            variant={index === step ? "default" : "outline"}
            size="sm"
            onClick={() => handleStepClick(index)}
            className="rounded-full"
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </div>
  );
}
