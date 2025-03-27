
import { useState, ReactNode } from 'react';
import { BasicInformationStep } from '@/components/sites/forms/steps/BasicInformationStep';
import { ContactsStep } from '@/components/sites/forms/steps/contacts';
import { ContractDetailsStep } from '@/components/sites/forms/steps/ContractDetailsStep';
import { BillingDetailsStep } from '@/components/sites/forms/steps/BillingDetailsStep';
import { SubcontractorsStep } from '@/components/sites/forms/steps/SubcontractorsStep';
import { JobSpecificationsStep } from '@/components/sites/forms/steps/JobSpecificationsStep';
import { ReplenishablesStep } from '@/components/sites/forms/steps/ReplenishablesStep';

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
  
  // Define steps with proper JSX components
  const steps: StepDefinition[] = [
    {
      title: 'Basic Information',
      description: 'Enter site basic details',
      component: <BasicInformationStep />
    },
    {
      title: 'Contact Information',
      description: 'Add site contacts',
      component: <ContactsStep />
    },
    {
      title: 'Contract Details',
      description: 'Define contract terms',
      component: <ContractDetailsStep />
    },
    {
      title: 'Billing Information',
      description: 'Setup billing details',
      component: <BillingDetailsStep />
    },
    {
      title: 'Subcontractors',
      description: 'Add subcontractors if needed',
      component: <SubcontractorsStep />
    },
    {
      title: 'Job Specifications',
      description: 'Define job requirements',
      component: <JobSpecificationsStep />
    },
    {
      title: 'Supplies & Replenishables',
      description: 'Add supply requirements',
      component: <ReplenishablesStep />
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
