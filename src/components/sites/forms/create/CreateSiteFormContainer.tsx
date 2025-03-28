
import React from 'react';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormProgressBar } from '../FormProgressBar';
import { SiteFormData } from '../siteFormTypes';
import { StepperState } from '@/hooks/useSiteFormStepper';
import { CreateSiteFormStepRenderer } from './CreateSiteFormStepRenderer';

interface CreateSiteFormContainerProps {
  form: any;
  formData: SiteFormData;
  stepper: StepperState;
  isSubmitting: boolean;
  handleSubmit: () => Promise<void>;
  children?: React.ReactNode;
}

export function CreateSiteFormContainer({
  form,
  formData,
  stepper,
  isSubmitting,
  handleSubmit,
  children
}: CreateSiteFormContainerProps) {
  console.log("Rendering form container, current step:", stepper.currentStep);
  
  return (
    <div>
      {children}
      
      <FormProgressBar 
        currentStep={stepper.currentStep}
        totalSteps={stepper.totalSteps}
        progress={stepper.progress}
      />
      
      <Card className="p-6 shadow-lg">
        <Form {...form}>
          <form onSubmit={(e) => {
            e.preventDefault();
            console.log("Form submitted, current step:", stepper.currentStep, "isLastStep:", stepper.isLastStep);
            
            // Check if we need to validate the current step
            if (stepper.validateCurrentStep && !stepper.validateCurrentStep()) {
              console.log("Step validation failed on submit");
              return;
            }
            
            if (stepper.isLastStep) {
              handleSubmit();
            } else {
              stepper.handleNext();
            }
          }}>
            <CreateSiteFormStepRenderer
              stepper={stepper}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          </form>
        </Form>
      </Card>
    </div>
  );
}
