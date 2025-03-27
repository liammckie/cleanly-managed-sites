
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { getInitialFormData } from '@/components/sites/forms/types/initialFormData';
import { v4 as uuidv4 } from 'uuid';
import { validateSiteForm } from '@/components/sites/forms/types/validationUtils';
import { SiteStatus } from '@/types/models';

export const useSiteForm = (mode: 'create' | 'edit', initialData?: any) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SiteFormData>(
    initialData ? { ...getInitialFormData(), ...initialData } : getInitialFormData()
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  // Form field handlers
  const handleChange = (field: keyof SiteFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSelectChange = (field: keyof SiteFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof SiteFormData],
        [field]: value
      }
    }));
  };
  
  const handleDoubleNestedChange = (section: string, subsection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof SiteFormData],
        [subsection]: {
          ...prev[section as keyof SiteFormData]?.[subsection],
          [field]: value
        }
      }
    }));
  };
  
  // Billing line handlers
  const addBillingLine = () => {
    const newBillingLine = {
      id: uuidv4(),
      description: '',
      amount: 0,
      isRecurring: true,
      onHold: false,
      frequency: 'monthly' as 'weekly' | 'monthly' | 'quarterly' | 'annually'
    };
    
    setFormData(prev => ({
      ...prev,
      billingDetails: {
        ...prev.billingDetails,
        billingLines: [...(prev.billingDetails?.billingLines || []), newBillingLine]
      }
    }));
  };
  
  const updateBillingLine = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      billingDetails: {
        ...prev.billingDetails,
        billingLines: (prev.billingDetails?.billingLines || []).map(line => 
          line.id === id ? { ...line, [field]: value } : line
        )
      }
    }));
  };
  
  const removeBillingLine = (id: string) => {
    setFormData(prev => ({
      ...prev,
      billingDetails: {
        ...prev.billingDetails,
        billingLines: (prev.billingDetails?.billingLines || []).filter(line => line.id !== id)
      }
    }));
  };
  
  // Contact handlers
  const addContact = (contact: any) => {
    const newContact = {
      ...contact,
      id: uuidv4()
    };
    
    setFormData(prev => ({
      ...prev,
      contacts: [...(prev.contacts || []), newContact]
    }));
  };
  
  const updateContact = (id: string, updatedContact: any) => {
    setFormData(prev => ({
      ...prev,
      contacts: (prev.contacts || []).map(contact => 
        contact.id === id ? { ...contact, ...updatedContact } : contact
      )
    }));
  };
  
  const removeContact = (id: string) => {
    setFormData(prev => ({
      ...prev,
      contacts: (prev.contacts || []).filter(contact => contact.id !== id)
    }));
  };
  
  // Subcontractor handlers
  const addSubcontractor = (subcontractor: any) => {
    const newSubcontractor = {
      ...subcontractor,
      id: uuidv4()
    };
    
    setFormData(prev => ({
      ...prev,
      subcontractors: [...(prev.subcontractors || []), newSubcontractor]
    }));
  };
  
  const updateSubcontractor = (id: string, updatedSubcontractor: any) => {
    setFormData(prev => ({
      ...prev,
      subcontractors: (prev.subcontractors || []).map(sub => 
        sub.id === id ? { ...sub, ...updatedSubcontractor } : sub
      )
    }));
  };
  
  const removeSubcontractor = (id: string) => {
    setFormData(prev => ({
      ...prev,
      subcontractors: (prev.subcontractors || []).filter(sub => sub.id !== id)
    }));
  };
  
  const handleSubmit = async () => {
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
      const errorMsg = error.message || 'An unknown error occurred';
      setErrors(prev => ({ ...prev, general: errorMsg }));
      toast.error(`Error: ${errorMsg}`);
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
