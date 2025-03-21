
import { useState } from 'react';
import { StepConfigItem } from '@/components/sites/forms/siteFormConfig';

export function useSiteFormStepper(steps: StepConfigItem[]) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleNext = (onSubmit?: () => void) => {
    if (currentStep === steps.length - 1) {
      onSubmit?.();
      return;
    }
    
    setCurrentStep(prevStep => prevStep + 1);
    window.scrollTo(0, 0);
  };
  
  const handleBack = () => {
    setCurrentStep(prevStep => prevStep - 1);
    window.scrollTo(0, 0);
  };

  return {
    currentStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    totalSteps: steps.length,
    progress: Math.round(((currentStep + 1) / steps.length) * 100),
    handleNext,
    handleBack
  };
}
