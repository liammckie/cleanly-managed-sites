
import React from 'react';
import { FormProgressBar } from '../FormProgressBar';
import { StepperState } from '@/hooks/useSiteFormStepper';

interface CreateSiteFormHeaderProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
}

export function CreateSiteFormHeader({ 
  currentStep, 
  totalSteps, 
  progress 
}: CreateSiteFormHeaderProps) {
  return (
    <FormProgressBar 
      currentStep={currentStep}
      totalSteps={totalSteps}
      progress={progress}
    />
  );
}
