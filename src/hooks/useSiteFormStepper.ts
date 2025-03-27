
import { useState, ReactNode } from 'react';

export interface StepDefinition {
  title: string;
  description: string;
  component: ReactNode;
}

export interface StepperState {
  currentStep: number;
  steps: StepDefinition[];
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
  handleBack: () => void;
  handleNext: () => void;
  validateCurrentStep?: () => boolean;
}

export function useSiteFormStepper(): StepperState {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Define steps
  const steps: StepDefinition[] = [
    {
      title: 'Basic Information',
      description: 'Enter site basic details',
      component: <div>Basic Information Step</div>
    },
    {
      title: 'Contact Information',
      description: 'Add site contacts',
      component: <div>Contact Information Step</div>
    },
    {
      title: 'Contract Details',
      description: 'Define contract terms',
      component: <div>Contract Details Step</div>
    },
    {
      title: 'Billing Information',
      description: 'Setup billing details',
      component: <div>Billing Information Step</div>
    },
    {
      title: 'Additional Details',
      description: 'Add any additional information',
      component: <div>Additional Details Step</div>
    }
  ];
  
  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);
  
  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  return {
    currentStep,
    steps,
    totalSteps,
    isFirstStep,
    isLastStep,
    progress,
    handleBack,
    handleNext
  };
}
