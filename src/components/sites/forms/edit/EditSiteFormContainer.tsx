
import React from 'react';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormProgressBar } from '../FormProgressBar';
import { SiteFormStep } from '../SiteFormStep';
import { SiteRecord } from '@/lib/types';
import { StepperState } from '@/hooks/useSiteFormStepper';

interface EditSiteFormContainerProps {
  site: SiteRecord;
  form: any;
  stepper: StepperState;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSaving: boolean;
  children?: React.ReactNode;
}

export function EditSiteFormContainer({ 
  site, 
  form, 
  stepper, 
  handleSubmit,
  isSaving,
  children 
}: EditSiteFormContainerProps) {
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
          <form onSubmit={handleSubmit}>
            <SiteFormStep
              title={stepper.steps[stepper.currentStep].title}
              description={stepper.steps[stepper.currentStep].description}
              onNext={() => stepper.handleNext()}
              onBack={stepper.handleBack}
              isSubmitting={isSaving}
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
