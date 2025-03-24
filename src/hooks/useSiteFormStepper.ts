
import { useState } from 'react';
import { StepConfig } from '@/components/sites/forms/siteFormConfig';

export interface StepperState {
  steps: StepConfig[];
  currentStep: number;
  totalSteps: number;
  progress: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  handleNext: (onSubmit?: () => Promise<void>) => void;
  handleBack: () => void;
}

interface UseSiteFormStepperProps {
  steps: StepConfig[];
  validateStep?: (stepIndex: number) => boolean;
}

export const useSiteFormStepper = ({
  steps,
  validateStep = () => true
}: UseSiteFormStepperProps): StepperState => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = steps.length;
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  
  const handleNext = async (onSubmit?: () => Promise<void>) => {
    // If validation function provided, check before proceeding
    if (!validateStep(currentStep)) {
      return;
    }
    
    if (isLastStep) {
      // If we're on the last step and have an onSubmit callback, use it
      if (onSubmit) {
        await onSubmit();
      }
      return;
    }
    
    // Move to the next step
    setCurrentStep(prev => prev + 1);
  };
  
  const handleBack = () => {
    if (isFirstStep) return;
    setCurrentStep(prev => prev - 1);
  };
  
  return {
    steps,
    currentStep,
    totalSteps,
    progress,
    isFirstStep,
    isLastStep,
    handleNext,
    handleBack
  };
};
