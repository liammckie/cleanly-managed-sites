
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
      console.log("Current step:", stepper.currentStep);
      
      // Check if we need to validate the current step
      if (stepper.validateCurrentStep && !stepper.validateCurrentStep()) {
        console.log("Step validation failed");
        toast.error("Please complete all required fields before proceeding.");
        return;
      }
      
      if (stepper.isLastStep) {
        console.log("On last step, submitting form");
        await onSubmit();
      } else {
        console.log("Moving to next step");
        stepper.handleNext();
      }
    } catch (error) {
      console.error("Error handling next step:", error);
      toast.error("Failed to proceed to next step. Please check form inputs.");
    }
  };

  // Make sure we always render the SiteFormStep component with all required props
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
