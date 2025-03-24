
import React from 'react';
import { Form } from "@/components/ui/form";
import { FormProvider } from "react-hook-form";
import { SiteFormData } from '../siteFormTypes';
import { StepperState } from '@/hooks/useSiteFormStepper';
import { CreateSiteFormHeader } from './CreateSiteFormHeader';
import { CreateSiteFormStepRenderer } from './CreateSiteFormStepRenderer';

interface CreateSiteFormContainerProps {
  form: any;
  formData: SiteFormData;
  stepper: StepperState;
  isSubmitting: boolean;
  handleSubmit: () => Promise<void>;
}

export function CreateSiteFormContainer({
  form,
  formData,
  stepper,
  isSubmitting,
  handleSubmit
}: CreateSiteFormContainerProps) {
  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form>
          <div className="max-w-4xl mx-auto">
            <CreateSiteFormHeader
              currentStep={stepper.currentStep}
              totalSteps={stepper.totalSteps}
              progress={stepper.progress}
            />
            
            <CreateSiteFormStepRenderer
              stepper={stepper}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
