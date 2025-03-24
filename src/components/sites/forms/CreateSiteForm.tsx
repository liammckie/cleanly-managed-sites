
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
import { handleSiteContacts } from '@/lib/api/sites/siteContactsApi';
import { ContactRecord } from '@/lib/types';

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
  
  // Define fallback functions for all potentially missing handlers
  const updateSubcontractor = formHandlers.updateSubcontractor || ((index: number, field: string, value: any) => {
    console.log(`Updating subcontractor ${index} field ${field}:`, value);
  });
  
  const addSubcontractor = formHandlers.addSubcontractor || (() => {});
  const removeSubcontractor = formHandlers.removeSubcontractor || ((index: number) => {});
  
  const addReplenishable = formHandlers.addReplenishable || (() => {});
  const updateReplenishable = formHandlers.updateReplenishable || ((index: number, field: string, value: any) => {});
  const removeReplenishable = formHandlers.removeReplenishable || ((index: number) => {});
  
  const addBillingLine = formHandlers.addBillingLine || (() => {});
  const updateBillingLine = formHandlers.updateBillingLine || ((index: number, field: string, value: any) => {});
  const removeBillingLine = formHandlers.removeBillingLine || ((index: number) => {});
  
  const addContractTerm = formHandlers.addContractTerm || (() => {});
  const updateContractTerm = formHandlers.updateContractTerm || ((index: number, field: string, value: any) => {});
  const removeContractTerm = formHandlers.removeContractTerm || ((index: number) => {});
  
  const addAdditionalContract = formHandlers.addAdditionalContract || (() => {});
  const updateAdditionalContract = formHandlers.updateAdditionalContract || ((index: number, field: string, value: any) => {});
  const removeAdditionalContract = formHandlers.removeAdditionalContract || ((index: number) => {});
  
  // Create a custom version of getSiteFormSteps that includes the contact handlers
  const getCustomSiteFormSteps = () => {
    const steps = getSiteFormSteps(
      formHandlers.formData,
      (field: string, value: any) => formHandlers.handleChange({ target: { name: field, value } } as any),
      formHandlers.handleNestedChange,
      handleArrayChange,
      handleArrayUpdate,
      formHandlers.handleDoubleNestedChange,
      addArrayItem,
      removeArrayItem,
      addSubcontractor,
      updateSubcontractor,
      removeSubcontractor,
      addReplenishable,
      updateReplenishable,
      removeReplenishable,
      addBillingLine,
      updateBillingLine,
      removeBillingLine,
      addContractTerm,
      updateContractTerm,
      removeContractTerm,
      addAdditionalContract,
      updateAdditionalContract,
      removeAdditionalContract,
      handleFileUpload,
      handleFileRemove
    );
    
    // Find the contacts step and modify it to pass the addExistingContact prop
    const contactsStepIndex = steps.findIndex(step => 
      step.component && React.isValidElement(step.component) && 
      step.component.type === require('./steps/ContactsStep').ContactsStep
    );
    
    if (contactsStepIndex >= 0) {
      const originalStep = steps[contactsStepIndex];
      steps[contactsStepIndex] = {
        ...originalStep,
        component: React.cloneElement(
          originalStep.component as React.ReactElement,
          { 
            addExistingContact: formHandlers.addExistingContact,
            setAsPrimary: formHandlers.setAsPrimary 
          }
        )
      };
    }
    
    return steps;
  };
  
  // Use the custom steps
  const customSteps = getCustomSiteFormSteps();
  
  // Use stepper hook with validation
  const stepper = useSiteFormStepper({
    steps: customSteps,
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
      
      // Handle contacts if they exist
      if (formHandlers.formData.contacts && 
          formHandlers.formData.contacts.length > 0) {
        try {
          await handleSiteContacts(
            createdSite.id,
            formHandlers.formData.contacts as ContactRecord[],
            createdSite.user_id
          );
        } catch (error) {
          console.error('Error handling site contacts:', error);
          // Continue with other operations
        }
      }
      
      // Handle additional contracts if they exist
      if (formHandlers.formData.additionalContracts && 
          formHandlers.formData.additionalContracts.length > 0) {
        try {
          await handleSiteAdditionalContracts(
            createdSite.id, 
            formHandlers.formData.additionalContracts,
            createdSite.user_id
          );
        } catch (error) {
          console.error('Error handling additional contracts:', error);
          // Continue with other operations
        }
      }
      
      // Handle billing lines if they exist
      if (formHandlers.formData.billingDetails && 
          formHandlers.formData.billingDetails.billingLines && 
          formHandlers.formData.billingDetails.billingLines.length > 0) {
        try {
          await handleSiteBillingLines(
            createdSite.id, 
            formHandlers.formData.billingDetails.billingLines
          );
        } catch (error) {
          console.error('Error handling billing lines:', error);
          // Continue with other operations
        }
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
