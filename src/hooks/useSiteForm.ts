import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { getInitialFormData } from '@/components/sites/forms/types/initialFormData';
import { v4 as uuidv4 } from 'uuid';
import { validateSiteForm } from '@/components/sites/forms/types/validationUtils';
import { BillingLine } from '@/components/sites/forms/types/billingTypes';
import { SiteStatus } from '@/types/common';

export const useSiteForm = (mode: 'create' | 'edit', initialData?: any) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SiteFormData>(() => {
    if (initialData) {
      const data = getInitialFormData();
      return {
        ...data,
        ...initialData,
        contractDetails: initialData.contractDetails || initialData.contract_details || data.contractDetails,
        billingDetails: {
          ...(data.billingDetails || {}),
          ...(initialData.billingDetails || {}),
          billingLines: initialData.billingDetails?.billingLines || []
        }
      };
    }
    return getInitialFormData();
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (initialData) {
      const baseData = getInitialFormData();
      const newData = {
        ...baseData,
        ...initialData,
        contractDetails: initialData.contractDetails || initialData.contract_details || baseData.contractDetails,
        billingDetails: {
          ...(baseData.billingDetails || {}),
          ...(initialData.billingDetails || {}),
          billingLines: initialData.billingDetails?.billingLines || []
        }
      };
      
      setFormData(newData);
    }
  }, [initialData]);
  
  const handleChange = (field: keyof SiteFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSelectChange = (field: keyof SiteFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData(prev => {
      const sectionData = prev[section as keyof SiteFormData] as Record<string, any> || {};
      
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: value
        }
      };
    });
  };
  
  const handleDoubleNestedChange = (section: string, subsection: string, field: string, value: any) => {
    setFormData(prev => {
      const sectionData = prev[section as keyof SiteFormData] as Record<string, any> || {};
      const subsectionData = sectionData[subsection] as Record<string, any> || {};
      
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [subsection]: {
            ...subsectionData,
            [field]: value
          }
        }
      };
    });
  };
  
  const addBillingLine = () => {
    const newBillingLine: BillingLine = {
      id: uuidv4(),
      description: '',
      amount: 0,
      isRecurring: true,
      onHold: false,
      frequency: 'monthly'
    };
    
    setFormData(prev => {
      const prevBillingDetails = prev.billingDetails || {};
      
      const prevBillingLines = prevBillingDetails.billingLines || [];
      
      return {
        ...prev,
        billingDetails: {
          ...prevBillingDetails,
          billingLines: [...prevBillingLines, newBillingLine]
        }
      };
    });
  };
  
  const updateBillingLine = (id: string, field: string, value: any) => {
    setFormData(prev => {
      const prevBillingDetails = prev.billingDetails || {};
      
      const prevBillingLines = prevBillingDetails.billingLines || [];
      
      return {
        ...prev,
        billingDetails: {
          ...prevBillingDetails,
          billingLines: prevBillingLines.map(line => 
            line.id === id ? { ...line, [field]: value } : line
          )
        }
      };
    });
  };
  
  const removeBillingLine = (id: string) => {
    setFormData(prev => {
      const prevBillingDetails = prev.billingDetails || {};
      
      const prevBillingLines = prevBillingDetails.billingLines || [];
      
      return {
        ...prev,
        billingDetails: {
          ...prevBillingDetails,
          billingLines: prevBillingLines.filter(line => line.id !== id)
        }
      };
    });
  };
  
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
