
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
  
  // Define dummy handlers for missing functionality
  const handleArrayChange = (field: string, values: any[]) => {
    console.log(`Array change for ${field}:`, values);
  };
  
  const handleArrayUpdate = (field: string, index: number, value: any) => {
    console.log(`Array update for ${field} at index ${index}:`, value);
  };
  
  const addArrayItem = (field: string) => {
    console.log(`Adding item to ${field}`);
  };
  
  const removeArrayItem = (field: string, index: number) => {
    console.log(`Removing item from ${field} at index ${index}`);
  };
  
  const handleFileUpload = (field: string, file: File) => {
    console.log(`Uploading file for ${field}:`, file.name);
  };
  
  const handleFileRemove = (field: string, fileName: string) => {
    console.log(`Removing file ${fileName} from ${field}`);
  };
  
  // Get steps configuration
  const steps = getSiteFormSteps(
    formHandlers.formData,
    (field: string, value: any) => formHandlers.handleChange({ target: { name: field, value } } as any),
    formHandlers.handleNestedChange,
    handleArrayChange,
    handleArrayUpdate,
    formHandlers.handleDoubleNestedChange,
    addArrayItem,
    removeArrayItem,
    formHandlers.addSubcontractor || (() => {}),
    formHandlers.updateSubcontractor || ((index: number, field: string, value: any) => {}),
    formHandlers.removeSubcontractor || ((index: number) => {}),
    formHandlers.addReplenishable || (() => {}),
    formHandlers.updateReplenishable || ((index: number, field: string, value: any) => {}),
    formHandlers.removeReplenishable || ((index: number) => {}),
    formHandlers.addBillingLine || (() => {}),
    formHandlers.updateBillingLine || ((id: string, field: string, value: any) => {}),
    formHandlers.removeBillingLine || ((id: string) => {}),
    formHandlers.addContractTerm || (() => {}),
    formHandlers.updateContractTerm || ((index: number, field: string, value: any) => {}),
    formHandlers.removeContractTerm || ((index: number) => {}),
    formHandlers.addAdditionalContract || (() => {}),
    formHandlers.updateAdditionalContract || ((index: number, field: string, value: any) => {}),
    formHandlers.removeAdditionalContract || ((index: number) => {}),
    handleFileUpload,
    handleFileRemove
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
              title={stepper.steps[stepper.currentStep].title}
              description={stepper.steps[stepper.currentStep].description}
              onNext={() => stepper.handleNext(handleSubmit)}
              onBack={stepper.handleBack}
              isSubmitting={isSubmitting}
              isLastStep={stepper.isLastStep}
              isFirstStep={stepper.isFirstStep}
            >
              {stepper.steps[stepper.currentStep].component}
            </SiteFormStep>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
