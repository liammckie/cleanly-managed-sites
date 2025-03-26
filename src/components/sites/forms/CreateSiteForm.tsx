import React from 'react';
import { useForm } from 'react-hook-form';
import { useSiteForm } from '@/hooks/useSiteForm';
import { getSiteFormSteps } from './siteFormConfig';
import { useSiteFormStepper } from '@/hooks/useSiteFormStepper';
import { SiteFormData } from './types/siteFormData';
import { SiteFormHandlers } from './types/siteFormHandlers';
import { CreateSiteFormContainer } from './create/CreateSiteFormContainer';
import { useCreateSiteFormSubmit } from './create/useCreateSiteFormSubmit';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FormStepGuidance } from './FormStepGuidance';

export function CreateSiteForm() {
  // Initialize form with react-hook-form
  const formMethods = useForm<SiteFormData>();
  
  // Use the custom hooks
  const siteForm = useSiteForm() as unknown as SiteFormHandlers;
  
  // Use the form submission hook
  const { handleSubmit, isSubmitting } = useCreateSiteFormSubmit(siteForm.formData);

  // Initialize the stepper with enhanced SiteFormHandlers type
  const steps = getSiteFormSteps(
    siteForm.formData,
    siteForm.handleChange || (() => {}),
    siteForm.handleNestedChange || (() => {}),
    (field, values) => console.log(`Array change for ${field}:`, values),
    (field, index, value) => console.log(`Array update for ${field} at index ${index}:`, value),
    siteForm.handleDoubleNestedChange || (() => {}),
    (field) => console.log(`Adding item to ${field}`),
    (field, index) => console.log(`Removing item from ${field} at index ${index}`),
    siteForm.addSubcontractor || (() => {}),
    siteForm.updateSubcontractor || (() => {}),
    siteForm.removeSubcontractor || (() => {}),
    siteForm.addReplenishable || (() => {}),
    siteForm.updateReplenishable || (() => {}),
    siteForm.removeReplenishable || (() => {}),
    siteForm.addBillingLine || (() => {}),
    siteForm.updateBillingLine || (() => {}),
    siteForm.removeBillingLine || (() => {}),
    siteForm.addContractTerm || (() => {}),
    siteForm.updateContractTerm || (() => {}),
    siteForm.removeContractTerm || (() => {}),
    siteForm.addAdditionalContract || (() => {}),
    siteForm.updateAdditionalContract || (() => {}),
    siteForm.removeAdditionalContract || (() => {}),
    (field, file) => console.log(`Uploading file for ${field}:`, file.name),
    (field, fileName) => console.log(`Removing file ${fileName} from ${field}`),
    siteForm.errors || {}
  );
  
  // Use stepper hook with validation
  const stepper = useSiteFormStepper({
    steps,
    validateStep: siteForm.validateStep || (() => true)
  });
  
  // Calculate completion percentage
  const completionPercentage = siteForm.getCompletionPercentage ? 
    siteForm.getCompletionPercentage() : 
    Math.round(((stepper.currentStep + 1) / stepper.totalSteps) * 100);

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-medium">Site Creation Progress</h3>
          <span className="text-sm text-muted-foreground">{completionPercentage}% Complete</span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </Card>
      
      <FormStepGuidance 
        currentStep={stepper.currentStep} 
        stepsConfig={steps}
      />
      
      <CreateSiteFormContainer
        form={formMethods}
        formData={siteForm.formData}
        stepper={stepper}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
