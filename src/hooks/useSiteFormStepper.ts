
import { useState } from 'react';
import { toast } from 'sonner';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';

export type FormStep = 
  | 'basic-info'
  | 'contacts'
  | 'contract-details'
  | 'security-details'
  | 'billing-details'
  | 'subcontractors'
  | 'periodicals'
  | 'replenishables'
  | 'review';

export interface UseSiteFormStepperProps {
  initialStep?: FormStep;
  initialFormData: SiteFormData; // Required prop for validation
  onValidateStep?: (step: FormStep, formData: SiteFormData) => boolean;
}

export function useSiteFormStepper({
  initialStep = 'basic-info',
  initialFormData,
  onValidateStep
}: UseSiteFormStepperProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<FormStep>>(new Set());
  
  const steps: FormStep[] = [
    'basic-info',
    'contacts',
    'contract-details',
    'security-details',
    'billing-details',
    'subcontractors',
    'periodicals',
    'replenishables',
    'review'
  ];
  
  const validateCurrentStep = (formData: SiteFormData) => {
    if (onValidateStep) {
      return onValidateStep(currentStep, formData);
    }
    return true;
  };
  
  const goToNextStep = (formData: SiteFormData) => {
    const isValid = validateCurrentStep(formData);
    
    if (!isValid) {
      toast.error('Please complete all required fields before continuing.');
      return false;
    }
    
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setCurrentStep(nextStep);
      setCompletedSteps(prev => {
        const updated = new Set(prev);
        updated.add(currentStep);
        return updated;
      });
      return true;
    }
    
    return false;
  };
  
  const goToPreviousStep = (formData: SiteFormData) => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
      return true;
    }
    return false;
  };
  
  const goToStep = (step: FormStep, formData: SiteFormData) => {
    const isValid = validateCurrentStep(formData);
    
    if (!isValid && steps.indexOf(step) > steps.indexOf(currentStep)) {
      toast.error('Please complete all required fields before skipping ahead.');
      return false;
    }
    
    setCurrentStep(step);
    return true;
  };
  
  const isStepCompleted = (step: FormStep) => {
    return completedSteps.has(step);
  };
  
  const markStepComplete = (step: FormStep) => {
    setCompletedSteps(prev => {
      const updated = new Set(prev);
      updated.add(step);
      return updated;
    });
  };
  
  const isFirstStep = currentStep === steps[0];
  const isLastStep = currentStep === steps[steps.length - 1];
  
  return {
    currentStep,
    steps,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    isStepCompleted,
    markStepComplete
  };
}
