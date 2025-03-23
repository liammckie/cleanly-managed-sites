
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SiteFormData, getInitialFormData } from '@/components/sites/forms/siteFormTypes';
import { SiteStatus } from '@/components/sites/SiteCard';
import { useSiteFormValidation } from './useSiteFormValidation';
import { useSiteFormHandlers } from './useSiteFormHandlers';
import { useSiteFormSubcontractors } from './useSiteFormSubcontractors';
import { useSiteFormReplenishables } from './useSiteFormReplenishables';
import { useSiteFormBillingContacts } from './useSiteFormBillingContacts';
import { useSiteFormBillingLines } from './useSiteFormBillingLines';
import { useSiteFormContractTerms } from './useSiteFormContractTerms';
import { useSiteFormContacts } from './useSiteFormContacts';

export const useSiteForm = () => {
  // Initialize form data with default values
  const [formData, setFormData] = useState<SiteFormData>(getInitialFormData());
  
  // Initialize errors state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Initialize form with react-hook-form
  const form = useForm<SiteFormData>({
    defaultValues: formData
  });
  
  // Use the smaller focused hooks
  const validation = useSiteFormValidation();
  const formHandlers = useSiteFormHandlers(formData, setFormData, errors, setErrors);
  const subcontractorHandlers = useSiteFormSubcontractors(formData, setFormData, errors, setErrors);
  const replenishableHandlers = useSiteFormReplenishables(formData, setFormData);
  const billingContactHandlers = useSiteFormBillingContacts(formData, setFormData, errors, setErrors);
  const billingLineHandlers = useSiteFormBillingLines(formData.billingDetails?.billingLines || []);
  const contractTermHandlers = useSiteFormContractTerms(formData, setFormData, errors, setErrors);
  const contactHandlers = useSiteFormContacts();
  
  // Validate a specific step
  const validateStep = (stepIndex: number): boolean => {
    return validation.validateStep(formData, stepIndex, errors, setErrors);
  };
  
  // Update the contacts from the useSiteFormContacts hook
  const updateFormContacts = () => {
    setFormData(prev => ({
      ...prev,
      contacts: contactHandlers.contacts
    }));
  };
  
  // Add effect to sync contacts whenever they change
  if (contactHandlers.contacts !== formData.contacts) {
    updateFormContacts();
  }
  
  // Update billing lines in form data when they change
  const updateBillingLines = () => {
    setFormData(prev => ({
      ...prev,
      billingDetails: {
        ...prev.billingDetails!,
        billingLines: billingLineHandlers.billingLines
      }
    }));
  };
  
  // Sync billing lines when they change
  if (billingLineHandlers.billingLines !== formData.billingDetails?.billingLines) {
    updateBillingLines();
  }
  
  return {
    formData,
    setFormData,
    errors,
    setErrors,
    validateStep,
    form, // Return the form instance for FormProvider
    ...formHandlers,
    ...subcontractorHandlers,
    ...replenishableHandlers,
    ...billingContactHandlers,
    ...billingLineHandlers,
    ...contractTermHandlers,
    ...contactHandlers
  };
};
