
import React from 'react';
import { SiteFormStep } from '../SiteFormStep';
import { StepperState } from '@/hooks/useSiteFormStepper';

interface CreateSiteFormStepRendererProps {
  stepper: StepperState;
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
}

export function CreateSiteFormStepRenderer({ 
  stepper, 
  isSubmitting, 
  onSubmit 
}: CreateSiteFormStepRendererProps) {
  // Handle next button clicks
  const handleNext = async () => {
    if (stepper.isLastStep) {
      await onSubmit();
    } else {
      stepper.handleNext();
    }
  };

  return (
    <SiteFormStep
      title={stepper.steps[stepper.currentStep].title}
      description={stepper.steps[stepper.currentStep].description}
      onNext={handleNext}
      onBack={stepper.handleBack}
      isSubmitting={isSubmitting}
      isLastStep={stepper.isLastStep}
      isFirstStep={stepper.isFirstStep}
    >
      {stepper.steps[stepper.currentStep].component}
    </SiteFormStep>
  );
}
