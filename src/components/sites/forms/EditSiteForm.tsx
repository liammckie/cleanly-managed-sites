import React from 'react';
import { useSiteForm } from '@/hooks/useSiteForm';
import { getSiteFormSteps } from './siteFormConfig';
import { useSiteFormStepper } from '@/hooks/useSiteFormStepper';
import { SiteRecord } from '@/lib/types';
import { ErrorBoundary } from '@/components/ui/error-boundary/ErrorBoundary';
import { SiteFormHandlers } from './types/siteFormHandlers';

// Import the new components
import { EditSiteFormHeader } from './edit/EditSiteFormHeader';
import { EditSiteFormContainer } from './edit/EditSiteFormContainer';
import { useSiteFormData } from './edit/useSiteFormData';
import { useEditSiteActions } from './edit/useEditSiteActions';

interface EditSiteFormProps {
  site: SiteRecord;
}

export function EditSiteForm({ site }: EditSiteFormProps) {
  // Get form state and handlers from the useSiteForm hook
  const siteForm = useSiteForm() as unknown as SiteFormHandlers;
  
  // Use our custom hooks to organize logic
  const { handleSubmit, isSaving } = useEditSiteActions(site, siteForm.formData);
  useSiteFormData(site, siteForm.formData, siteForm.setFormData, siteForm.form);
  
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
          form={siteForm.form}
          stepper={stepper}
          handleSubmit={handleSubmit}
          isSaving={isSaving}
        />
      </div>
    </ErrorBoundary>
  );
}
