
import React, { useState, useCallback } from 'react';
import { validateBasicInfo } from '@/components/sites/forms/types/validationUtils';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';

// Define the step type
export type FormStep = 'basicInfo' | 'contacts' | 'billingDetails' | 'contractDetails' | 'subcontractors' | 'jobDetails' | 'replenishables' | 'review';

// Define the step configuration
interface StepConfig {
  id: FormStep;
  label: string;
  description: string;
  validateFn?: (formData: SiteFormData) => Record<string, string>;
}

export const useSiteFormStepper = (initialFormData: SiteFormData) => {
  const [currentStep, setCurrentStep] = useState<FormStep>('basicInfo');
  const [completedSteps, setCompletedSteps] = useState<Set<FormStep>>(new Set());
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Define step validation functions
  const validateBasic = (formData: SiteFormData) => {
    return validateBasicInfo(formData);
  };

  // Define all steps with their validation functions
  const steps: StepConfig[] = [
    {
      id: 'basicInfo',
      label: 'Basic Information',
      description: 'Enter basic site details',
      validateFn: validateBasic
    },
    {
      id: 'contacts',
      label: 'Contacts',
      description: 'Add site contacts',
      validateFn: () => ({}) // No validation for contacts
    },
    {
      id: 'billingDetails',
      label: 'Billing Details',
      description: 'Configure billing settings',
      validateFn: () => ({}) // No validation for billing
    },
    {
      id: 'contractDetails',
      label: 'Contract Details',
      description: 'Contract information',
      validateFn: () => ({}) // No validation for contracts
    },
    {
      id: 'subcontractors',
      label: 'Subcontractors',
      description: 'Add third-party service providers',
      validateFn: () => ({}) // No validation for subcontractors
    },
    {
      id: 'jobDetails',
      label: 'Job Details',
      description: 'Specify job requirements',
      validateFn: () => ({}) // No validation for job details
    },
    {
      id: 'replenishables',
      label: 'Replenishables',
      description: 'Track items that need restocking',
      validateFn: () => ({}) // No validation for replenishables
    },
    {
      id: 'review',
      label: 'Review & Submit',
      description: 'Review all information',
      validateFn: () => ({}) // No validation for review
    }
  ];

  const getStepIndex = (step: FormStep) => {
    return steps.findIndex(s => s.id === step);
  };

  const goToStep = useCallback((step: FormStep) => {
    setCurrentStep(step);
  }, []);

  const goToNextStep = useCallback((formData: SiteFormData) => {
    const currentIndex = getStepIndex(currentStep);
    const currentStepConfig = steps[currentIndex];
    
    // Validate the current step if a validation function exists
    if (currentStepConfig.validateFn) {
      const errors = currentStepConfig.validateFn(formData);
      setValidationErrors(errors);
      
      // If there are errors, don't proceed
      if (Object.keys(errors).length > 0) {
        return false;
      }
    }
    
    // Mark current step as completed
    const newCompletedSteps = new Set(completedSteps);
    newCompletedSteps.add(currentStep);
    setCompletedSteps(newCompletedSteps);
    
    // Go to next step if it exists
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
      return true;
    }
    
    return false;
  }, [currentStep, completedSteps, steps]);

  const goToPreviousStep = useCallback(() => {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
      return true;
    }
    return false;
  }, [currentStep, steps]);

  return {
    currentStep,
    completedSteps,
    validationErrors,
    steps,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    setValidationErrors
  };
};

export default useSiteFormStepper;
