
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { FormProvider, useForm } from "react-hook-form";
import { SiteFormStep } from './SiteFormStep';
import { useSiteForm } from '@/hooks/useSiteForm';
import { useSiteFormStepper } from '@/hooks/useSiteFormStepper';
import { getSiteFormSteps } from './siteFormConfig';
import { FormProgressBar } from './FormProgressBar';
import { sitesApi } from '@/lib/api';
import { SiteFormData, getInitialFormData } from './siteFormTypes';
import { handleSiteAdditionalContracts } from '@/lib/api/sites/additionalContractsApi';
import { handleSiteBillingLines } from '@/lib/api/sites/billingLinesApi';

export function CreateSiteForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with react-hook-form
  const formMethods = useForm<SiteFormData>({
    defaultValues: getInitialFormData()
  });
  
  // Use the custom hooks
  const formHandlers = useSiteForm();
  
  // Get steps configuration
  const steps = getSiteFormSteps(
    formHandlers.formData,
    formHandlers.handleChange,
    formHandlers.handleNestedChange,
    formHandlers.handleArrayChange || (() => {}),
    formHandlers.handleArrayUpdate || (() => {}),
    formHandlers.handleDoubleNestedChange,
    formHandlers.addArrayItem || (() => {}),
    formHandlers.removeArrayItem || (() => {}),
    formHandlers.addSubcontractor,
    formHandlers.updateSubcontractor,
    formHandlers.removeSubcontractor,
    formHandlers.addReplenishable,
    formHandlers.updateReplenishable,
    formHandlers.removeReplenishable,
    formHandlers.addBillingLine,
    formHandlers.updateBillingLine,
    formHandlers.removeBillingLine,
    formHandlers.addContractTerm,
    formHandlers.updateContractTerm,
    formHandlers.removeContractTerm,
    formHandlers.addAdditionalContract,
    formHandlers.updateAdditionalContract,
    formHandlers.removeAdditionalContract,
    formHandlers.handleFileUpload,
    formHandlers.handleFileRemove
  );
  
  // Use stepper hook with validation
  const stepper = useSiteFormStepper({
    steps,
    validateStep: formHandlers.validateStep
  });
  
  // Handle submit
  const handleSubmit = async () => {
    // Final validation before submitting
    if (!formHandlers.validateStep(stepper.currentStep)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use the actual API to create the site
      const createdSite = await sitesApi.createSite(formHandlers.formData);
      
      // Handle additional contracts if they exist
      if (formHandlers.formData.additionalContracts && 
          formHandlers.formData.additionalContracts.length > 0) {
        await handleSiteAdditionalContracts(
          createdSite.id, 
          formHandlers.formData.additionalContracts,
          createdSite.user_id
        );
      }
      
      // Handle billing lines if they exist
      if (formHandlers.formData.billingDetails && 
          formHandlers.formData.billingDetails.billingLines && 
          formHandlers.formData.billingDetails.billingLines.length > 0) {
        await handleSiteBillingLines(
          createdSite.id, 
          formHandlers.formData.billingDetails.billingLines
        );
      }
      
      toast.success("Site has been created successfully!");
      navigate('/sites');
    } catch (error) {
      console.error('Error creating site:', error);
      toast.error("Failed to create site. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <Form {...formHandlers.form}>
        <form>
          <div className="max-w-4xl mx-auto">
            <FormProgressBar 
              currentStep={stepper.currentStep}
              totalSteps={stepper.totalSteps}
              progress={stepper.progress}
            />
            
            <SiteFormStep
              title={steps[stepper.currentStep].title}
              description={steps[stepper.currentStep].description}
              onNext={() => stepper.handleNext(handleSubmit)}
              onBack={stepper.handleBack}
              isSubmitting={isSubmitting}
              isLastStep={stepper.isLastStep}
              isFirstStep={stepper.isFirstStep}
            >
              {steps[stepper.currentStep].component}
            </SiteFormStep>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
