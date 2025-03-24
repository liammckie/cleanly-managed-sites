
import React from 'react';
import { useSiteForm } from '@/hooks/useSiteForm';
import { getSiteFormSteps } from './siteFormConfig';
import { useSiteFormStepper } from '@/hooks/useSiteFormStepper';
import { SiteRecord } from '@/lib/types';
import { ErrorBoundary } from '@/components/ui/error-boundary/ErrorBoundary';

// Import the new components
import { EditSiteFormHeader } from './edit/EditSiteFormHeader';
import { EditSiteFormContainer } from './edit/EditSiteFormContainer';
import { useSiteFormData } from './edit/useSiteFormData';
import { useEditSiteActions } from './edit/useEditSiteActions';

// Define fallback functions for missing handlers
const noop = () => {};
const noopWithParams = (...args: any[]) => {};

interface EditSiteFormProps {
  site: SiteRecord;
}

export function EditSiteForm({ site }: EditSiteFormProps) {
  // Get form state and handlers from the useSiteForm hook
  const siteForm = useSiteForm();
  const { formData, setFormData, validateStep, form } = siteForm;
  
  // Use our custom hooks to organize logic
  const { handleSubmit, isSaving } = useEditSiteActions(site, formData);
  useSiteFormData(site, formData, setFormData, form);
  
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
  const updateSubcontractor = siteForm.updateSubcontractor || ((index: number, field: string, value: any) => {
    console.log(`Updating subcontractor ${index} field ${field}:`, value);
  });
  
  const addSubcontractor = siteForm.addSubcontractor || noop;
  const removeSubcontractor = siteForm.removeSubcontractor || noopWithParams;
  
  const addReplenishable = siteForm.addReplenishable || noop;
  const updateReplenishable = siteForm.updateReplenishable || noopWithParams;
  const removeReplenishable = siteForm.removeReplenishable || noopWithParams;
  
  const addBillingLine = siteForm.addBillingLine || noop;
  const updateBillingLine = siteForm.updateBillingLine || noopWithParams;
  const removeBillingLine = siteForm.removeBillingLine || noopWithParams;
  
  const addContractTerm = siteForm.addContractTerm || noop;
  const updateContractTerm = siteForm.updateContractTerm || noopWithParams;
  const removeContractTerm = siteForm.removeContractTerm || noopWithParams;
  
  const addAdditionalContract = siteForm.addAdditionalContract || noop;
  const updateAdditionalContract = siteForm.updateAdditionalContract || noopWithParams;
  const removeAdditionalContract = siteForm.removeAdditionalContract || noopWithParams;
  
  // Initialize the stepper
  const steps = getSiteFormSteps(
    formData,
    (field: string, value: any) => siteForm.handleChange({ target: { name: field, value } } as any),
    siteForm.handleNestedChange,
    handleArrayChange,
    handleArrayUpdate,
    siteForm.handleDoubleNestedChange,
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
  
  // Use stepper hook with validation
  const stepper = useSiteFormStepper({
    steps,
    validateStep
  });
  
  return (
    <ErrorBoundary>
      <div className="max-w-4xl mx-auto">
        <EditSiteFormHeader 
          site={site} 
          isSaving={isSaving} 
          onSave={handleSubmit} 
        />
        
        <EditSiteFormContainer
          site={site}
          form={form}
          stepper={stepper}
          handleSubmit={handleSubmit}
          isSaving={isSaving}
        />
      </div>
    </ErrorBoundary>
  );
}
