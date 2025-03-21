
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SiteStatus } from '@/components/sites/SiteCard';
import { SiteFormData, getInitialFormData } from '@/components/sites/forms/siteFormTypes';
import { toast } from 'sonner';

export function useSiteForm() {
  // Form state
  const [formData, setFormData] = useState<SiteFormData>(getInitialFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Initialize react-hook-form
  const form = useForm<SiteFormData>({
    defaultValues: formData
  });
  
  // Handle basic field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle status change specifically for the Select component
  const handleStatusChange = (value: SiteStatus) => {
    handleChange({ target: { name: 'status', value } } as any);
  };
  
  // Handle client change
  const handleClientChange = (clientId: string) => {
    // Clear error when client is selected
    if (errors['clientId']) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors['clientId'];
        return newErrors;
      });
    }
    
    setFormData({
      ...formData,
      clientId
    });
  };
  
  // Handle nested field changes
  const handleNestedChange = (section: keyof SiteFormData, field: string, value: any) => {
    // Clear error when field is edited
    const errorKey = `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
    
    setFormData({
      ...formData,
      [section]: {
        ...(formData[section] as object),
        [field]: value
      }
    });
  };
  
  // Handle nested within nested field changes
  const handleDoubleNestedChange = (section: keyof SiteFormData, subsection: string, field: string, value: any) => {
    // Clear error when field is edited
    const errorKey = `${section}.${subsection}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
    
    setFormData({
      ...formData,
      [section]: {
        ...(formData[section] as object),
        [subsection]: {
          ...((formData[section] as any)[subsection] as object),
          [field]: value
        }
      }
    });
  };
  
  // Handle array of objects field changes
  const handleSubcontractorChange = (index: number, field: string, value: string) => {
    // Clear error when field is edited
    const errorKey = `subcontractors[${index}].${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
    
    const newSubcontractors = [...formData.subcontractors];
    newSubcontractors[index] = {
      ...newSubcontractors[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      subcontractors: newSubcontractors
    });
  };
  
  // Handle array field changes
  const handleStockChange = (index: number, value: string) => {
    const newStock = [...formData.replenishables.stock];
    newStock[index] = value;
    
    setFormData({
      ...formData,
      replenishables: {
        ...formData.replenishables,
        stock: newStock
      }
    });
  };
  
  // Add another subcontractor
  const addSubcontractor = () => {
    setFormData({
      ...formData,
      subcontractors: [
        ...formData.subcontractors,
        {
          businessName: '',
          contactName: '',
          email: '',
          phone: ''
        }
      ]
    });
  };
  
  // Remove a subcontractor
  const removeSubcontractor = (index: number) => {
    const newSubcontractors = [...formData.subcontractors];
    newSubcontractors.splice(index, 1);
    
    setFormData({
      ...formData,
      subcontractors: newSubcontractors
    });
  };

  // Validate the current step's fields
  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    // Validation rules for each step
    switch (stepIndex) {
      case 0: // Basic Information
        if (!formData.clientId) {
          newErrors['clientId'] = 'Client is required';
          isValid = false;
        }
        
        if (!formData.name.trim()) {
          newErrors['name'] = 'Site name is required';
          isValid = false;
        }
        
        if (!formData.address.trim()) {
          newErrors['address'] = 'Address is required';
          isValid = false;
        }
        
        if (!formData.city.trim()) {
          newErrors['city'] = 'City is required';
          isValid = false;
        }
        
        if (!formData.state.trim()) {
          newErrors['state'] = 'State is required';
          isValid = false;
        }
        
        if (!formData.postcode.trim()) {
          newErrors['postcode'] = 'Postcode is required';
          isValid = false;
        }
        
        if (!formData.representative.trim()) {
          newErrors['representative'] = 'Representative name is required';
          isValid = false;
        }
        break;
        
      case 1: // Contract Details
        if (!formData.contractDetails.startDate) {
          newErrors['contractDetails.startDate'] = 'Start date is required';
          isValid = false;
        }
        
        if (!formData.contractDetails.contractNumber) {
          newErrors['contractDetails.contractNumber'] = 'Contract number is required';
          isValid = false;
        }
        break;
        
      case 2: // Billing Details
        if (!formData.billingDetails.rate) {
          newErrors['billingDetails.rate'] = 'Rate is required';
          isValid = false;
        }
        
        if (!formData.billingDetails.billingFrequency) {
          newErrors['billingDetails.billingFrequency'] = 'Billing frequency is required';
          isValid = false;
        }
        
        if (!formData.billingDetails.paymentTerms) {
          newErrors['billingDetails.paymentTerms'] = 'Payment terms are required';
          isValid = false;
        }
        break;
        
      case 3: // Subcontractors
        // Only validate if there are any subcontractors
        if (formData.subcontractors.length > 0) {
          formData.subcontractors.forEach((sub, index) => {
            if (sub.businessName || sub.contactName || sub.email || sub.phone) {
              if (!sub.businessName.trim()) {
                newErrors[`subcontractors[${index}].businessName`] = 'Business name is required';
                isValid = false;
              }
              
              if (!sub.contactName.trim()) {
                newErrors[`subcontractors[${index}].contactName`] = 'Contact name is required';
                isValid = false;
              }
              
              if (sub.email && !/^\S+@\S+\.\S+$/.test(sub.email)) {
                newErrors[`subcontractors[${index}].email`] = 'Valid email is required';
                isValid = false;
              }
            }
          });
        }
        break;
    }
    
    setErrors(newErrors);
    
    if (!isValid) {
      toast.error("Please fill in all required fields");
    }
    
    return isValid;
  };

  return {
    formData,
    setFormData,
    errors,
    form,
    handleChange,
    handleStatusChange,
    handleClientChange,
    handleNestedChange,
    handleDoubleNestedChange,
    handleSubcontractorChange,
    handleStockChange,
    addSubcontractor,
    removeSubcontractor,
    validateStep
  };
}
