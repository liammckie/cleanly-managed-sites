
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { getInitialFormData } from '@/components/sites/forms/types/initialFormData';
import { v4 as uuidv4 } from 'uuid';
import { validateSiteForm } from '@/components/sites/forms/types/validationUtils';
import { useSiteFormHandlers } from './useSiteFormHandlers';

export const useSiteForm = (mode: 'create' | 'edit', initialData?: any) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SiteFormData>(
    initialData ? { ...getInitialFormData(), ...initialData } : getInitialFormData()
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    handleChange,
    handleSelectChange,
    handleNestedChange,
    handleDoubleNestedChange,
    addBillingLine,
    updateBillingLine,
    removeBillingLine,
    addContact,
    removeContact,
    updateContact,
    addSubcontractor,
    updateSubcontractor,
    removeSubcontractor
  } = useSiteFormHandlers(formData, setFormData);
  
  useEffect(() => {
    if (initialData) {
      const processedInitialData = { ...getInitialFormData(), ...initialData };
      
      // If contract_details is available but contractDetails is not, map it
      if (initialData.contract_details && !initialData.contractDetails) {
        processedInitialData.contractDetails = initialData.contract_details;
      }
      
      setFormData(processedInitialData);
    }
  }, [initialData]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateSiteForm(formData);
    
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix the form errors before submitting.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Actual submission logic would be here
      // This is a placeholder
      toast.success(mode === 'create' ? 'Site created successfully!' : 'Site updated successfully!');
      navigate('/sites');
    } catch (error: any) {
      toast.error(`Error: ${error.message || 'An unknown error occurred'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };
  
  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(0, prevStep - 1));
  };
  
  return {
    formData,
    setFormData,
    errors,
    currentStep,
    isSubmitting,
    handleChange,
    handleSelectChange,
    handleNestedChange,
    handleDoubleNestedChange,
    addBillingLine,
    updateBillingLine,
    removeBillingLine,
    addContact,
    removeContact,
    updateContact,
    addSubcontractor,
    updateSubcontractor,
    removeSubcontractor,
    handleSubmit,
    nextStep,
    prevStep
  };
};
