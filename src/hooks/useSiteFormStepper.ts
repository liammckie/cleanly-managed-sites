import { useState } from 'react';
import { StepConfig } from '@/components/sites/forms/siteFormConfig';

type UseSiteFormStepperProps = {
  steps: StepConfig[];
  validateStep?: (stepIndex: number) => boolean;
};

export const useSiteFormStepper = ({ steps, validateStep }: UseSiteFormStepperProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const totalSteps = steps.length;

  // Calculate progress (0-100)
  const progress = totalSteps > 1 
    ? Math.round(((currentStep + 1) / totalSteps) * 100) 
    : 100;

  // Handle moving to the next step
  const handleNext = (onSubmit?: () => void) => {
    // If validation function is provided, validate the current step
    if (validateStep && !validateStep(currentStep)) {
      return;
    }

    if (isLastStep) {
      // If this is the last step and submit callback is provided, call it
      if (onSubmit) {
        onSubmit();
      }
      return;
    }

    // Otherwise, move to the next step
    setCurrentStep(prev => prev + 1);
  };

  // Handle moving to the previous step
  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return {
    currentStep,
    isFirstStep,
    isLastStep,
    totalSteps,
    progress,
    handleNext,
    handleBack,
    steps
  };
};
