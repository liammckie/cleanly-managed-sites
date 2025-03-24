
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
import { useSiteFormAdditionalContracts } from './useSiteFormAdditionalContracts';
import { toast } from 'sonner';

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
  const additionalContractHandlers = useSiteFormAdditionalContracts(formData, setFormData);
  
  // Validate a specific step
  const validateStep = (stepIndex: number): boolean => {
    const isValid = validation.validateStep(formData, stepIndex, errors, setErrors);
    
    if (!isValid) {
      toast.error("Please fix the highlighted errors before proceeding");
    }
    
    return isValid;
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
  
  // Get form completion percentage
  const getCompletionPercentage = (): number => {
    let completedFields = 0;
    let totalRequiredFields = 0;
    
    // Basic info
    const basicFields = ['name', 'address', 'city', 'state', 'postcode', 'clientId'];
    basicFields.forEach(field => {
      totalRequiredFields++;
      if (formData[field as keyof SiteFormData]) completedFields++;
    });
    
    // Contacts
    totalRequiredFields++;
    if (formData.contacts && formData.contacts.length > 0) completedFields++;
    
    // Contract details
    const contractFields = ['contractDetails.startDate', 'contractDetails.endDate', 'contractDetails.contractNumber'];
    contractFields.forEach(field => {
      totalRequiredFields++;
      const [section, key] = field.split('.');
      if (formData[section as keyof SiteFormData]?.[key]) completedFields++;
    });
    
    // Billing details
    const billingFields = ['billingDetails.rate', 'billingDetails.billingFrequency'];
    billingFields.forEach(field => {
      totalRequiredFields++;
      const [section, key] = field.split('.');
      if (formData[section as keyof SiteFormData]?.[key]) completedFields++;
    });
    
    // Return percentage
    return Math.round((completedFields / totalRequiredFields) * 100);
  };
  
  return {
    formData,
    setFormData,
    errors,
    setErrors,
    validateStep,
    getCompletionPercentage,
    form, // Return the form instance for FormProvider
    ...formHandlers,
    ...subcontractorHandlers,
    ...replenishableHandlers,
    ...billingContactHandlers,
    ...billingLineHandlers,
    ...contractTermHandlers,
    ...contactHandlers,
    ...additionalContractHandlers
  };
};
