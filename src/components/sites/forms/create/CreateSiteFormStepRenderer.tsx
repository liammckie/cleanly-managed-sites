
import React from 'react';
import { SiteFormStep } from '../SiteFormStep';
import { StepperState } from '@/hooks/useSiteFormStepper';
import { toast } from 'sonner';

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
    try {
      console.log("Attempting to move to next step...");
      if (stepper.isLastStep) {
        await onSubmit();
      } else {
        stepper.handleNext();
      }
    } catch (error) {
      console.error("Error handling next step:", error);
      toast.error("Failed to proceed to next step. Please check form inputs.");
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
