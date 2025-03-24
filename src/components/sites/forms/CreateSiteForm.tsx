
import React from 'react';
import { useForm } from 'react-hook-form';
import { useSiteForm } from '@/hooks/useSiteForm';
import { getSiteFormSteps } from './siteFormConfig';
import { useSiteFormStepper } from '@/hooks/useSiteFormStepper';
import { SiteFormData, getInitialFormData } from './siteFormTypes';
import { ContactsStep } from './steps/ContactsStep';
import { CreateSiteFormContainer } from './create/CreateSiteFormContainer';
import { useCreateSiteFormSubmit } from './create/useCreateSiteFormSubmit';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FormStepGuidance } from './FormStepGuidance';

export function CreateSiteForm() {
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
  
  // Fix the type issue by creating a function with consistent parameter types
  const updateBillingLine = (id: string, field: string, value: any) => {
    if (formHandlers.updateBillingLine) {
      formHandlers.updateBillingLine(id, field, value);
    } else {
      console.log(`Updating billing line ${id} field ${field}:`, value);
    }
  };
  
  const removeBillingLine = (id: string) => {
    if (formHandlers.removeBillingLine) {
      formHandlers.removeBillingLine(id);
    } else {
      console.log(`Removing billing line ${id}`);
    }
  };
  
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
      step.id === 'contacts'
    );
    
    if (contactsStepIndex >= 0) {
      const originalStep = steps[contactsStepIndex];
      steps[contactsStepIndex] = {
        ...originalStep,
        component: (
          <ContactsStep
            formData={formHandlers.formData}
            errors={{}}
            handleContactChange={(index, field, value) => {
              const updatedContacts = [...formHandlers.formData.contacts];
              if (updatedContacts[index]) {
                updatedContacts[index] = {
                  ...updatedContacts[index],
                  [field]: value
                };
                
                // If setting as primary, update others
                if (field === 'is_primary' && value === true) {
                  updatedContacts.forEach((contact, i) => {
                    if (i !== index && contact.is_primary) {
                      updatedContacts[i] = {
                        ...contact,
                        is_primary: false
                      };
                    }
                  });
                }
                
                formHandlers.handleChange({ target: { name: 'contacts', value: updatedContacts } } as any);
              }
            }}
            addContact={() => {
              const newContact = {
                id: crypto.randomUUID(),
                name: '',
                role: 'operations',
                entity_type: 'site',
                is_primary: formHandlers.formData.contacts.length === 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              formHandlers.handleChange({ 
                target: { 
                  name: 'contacts', 
                  value: [...formHandlers.formData.contacts, newContact] 
                } 
              } as any);
            }}
            removeContact={(index) => {
              const updatedContacts = [...formHandlers.formData.contacts];
              updatedContacts.splice(index, 1);
              
              // If we removed the primary contact and there are still contacts,
              // make the first one primary
              if (formHandlers.formData.contacts[index]?.is_primary && updatedContacts.length > 0) {
                updatedContacts[0] = {
                  ...updatedContacts[0],
                  is_primary: true
                };
              }
              
              formHandlers.handleChange({ target: { name: 'contacts', value: updatedContacts } } as any);
            }}
            addExistingContact={formHandlers.addExistingContact}
            setAsPrimary={formHandlers.setAsPrimary}
          />
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
  
  // Use the form submission hook
  const { handleSubmit, isSubmitting } = useCreateSiteFormSubmit(formHandlers.formData);

  // Calculate completion percentage
  const completionPercentage = formHandlers.getCompletionPercentage ? 
    formHandlers.getCompletionPercentage() : 
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
        stepsConfig={customSteps}
      />
      
      <CreateSiteFormContainer
        form={formMethods}
        formData={formHandlers.formData}
        stepper={stepper}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
