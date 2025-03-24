
import React from 'react';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormProgressBar } from '../FormProgressBar';
import { SiteFormStep } from '../SiteFormStep';
import { SiteFormData } from '../siteFormTypes';
import { StepperState } from '@/hooks/useSiteFormStepper';

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
  return (
    <div>
      {children}
      
      <FormProgressBar 
        currentStep={stepper.currentStep}
        totalSteps={stepper.totalSteps}
        progress={stepper.progress}
      />
      
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}>
            <SiteFormStep
              title={stepper.steps[stepper.currentStep].title}
              description={stepper.steps[stepper.currentStep].description}
              onNext={() => stepper.handleNext()}
              onBack={stepper.handleBack}
              isSubmitting={isSubmitting}
              isLastStep={stepper.isLastStep}
              isFirstStep={stepper.isFirstStep}
            >
              {stepper.steps[stepper.currentStep].component}
            </SiteFormStep>
          </form>
        </Form>
      </Card>
    </div>
  );
}
