
import { useState } from 'react';
import { validateBasicInfo } from '@/components/sites/forms/types/validationUtils';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';

export interface StepperState {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  completedSteps: number[];
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;
  setCompletedStep: (step: number) => void;
  completionPercentage: number;
}

// Validation functions for each step
const stepValidations = {
  0: (formData: SiteFormData) => validateBasicInfo(formData),
  1: (formData: SiteFormData) => true, // Contacts
  2: (formData: SiteFormData) => true, // Contract
  3: (formData: SiteFormData) => true, // Billing
  4: (formData: SiteFormData) => true, // Additional
  5: (formData: SiteFormData) => true, // Review
};

export const useSiteFormStepper = (initialStep = 0, totalSteps = 6, formData: SiteFormData) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const validateStep = (step: number) => {
    if (step in stepValidations) {
      return stepValidations[step as keyof typeof stepValidations](formData);
    }
    return true;
  };
  
  const goToNextStep = () => {
    if (currentStep < totalSteps - 1) {
      if (validateStep(currentStep)) {
        setCompletedSteps(prev => {
          if (!prev.includes(currentStep)) {
            return [...prev, currentStep];
          }
          return prev;
        });
        setCurrentStep(prev => prev + 1);
      }
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  };
  
  const setCompletedStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCompletedSteps(prev => {
        if (!prev.includes(step)) {
          return [...prev, step];
        }
        return prev;
      });
    }
  };
  
  const getCompletionPercentage = () => {
    return (completedSteps.length / totalSteps) * 100;
  };
  
  return {
    currentStep,
    totalSteps,
    canGoNext: currentStep < totalSteps - 1,
    canGoPrevious: currentStep > 0,
    completedSteps,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    setCompletedStep,
    completionPercentage: getCompletionPercentage(),
    validateStep,
  };
};
