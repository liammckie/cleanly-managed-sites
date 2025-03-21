
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SiteFormData, getInitialFormData } from '@/components/sites/forms/siteFormTypes';
import { SiteStatus } from '@/components/sites/SiteCard';
import { useSiteFormValidation } from './useSiteFormValidation';
import { useSiteFormHandlers } from './useSiteFormHandlers';
import { useSiteFormSubcontractors } from './useSiteFormSubcontractors';
import { useSiteFormReplenishables } from './useSiteFormReplenishables';
import { useSiteFormBillingContacts } from './useSiteFormBillingContacts';
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
  const contactHandlers = useSiteFormContacts(formData, setFormData, errors, setErrors);
  
  // Validate a specific step
  const validateStep = (stepIndex: number): boolean => {
    return validation.validateStep(formData, stepIndex, errors, setErrors);
  };
  
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
    ...contactHandlers
  };
};
