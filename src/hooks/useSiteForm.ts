import { useState } from 'react';
import { SiteStatus } from '@/components/sites/SiteCard';
import { SiteFormData, getInitialFormData } from '@/components/sites/forms/siteFormTypes';
import { toast } from 'sonner';

export function useSiteForm() {
  // Form state
  const [formData, setFormData] = useState<SiteFormData>(getInitialFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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
        
      case 1: // Subcontractors
        formData.subcontractors.forEach((sub, index) => {
          if (!sub.businessName.trim()) {
            newErrors[`subcontractors[${index}].businessName`] = 'Business name is required';
            isValid = false;
          }
          
          if (!sub.contactName.trim()) {
            newErrors[`subcontractors[${index}].contactName`] = 'Contact name is required';
            isValid = false;
          }
          
          if (!sub.email.trim()) {
            newErrors[`subcontractors[${index}].email`] = 'Email is required';
            isValid = false;
          } else if (!/^\S+@\S+\.\S+$/.test(sub.email)) {
            newErrors[`subcontractors[${index}].email`] = 'Valid email is required';
            isValid = false;
          }
          
          if (!sub.phone.trim()) {
            newErrors[`subcontractors[${index}].phone`] = 'Phone is required';
            isValid = false;
          }
        });
        break;
        
      // Other steps can have validations added as needed
      // For simplicity, we'll assume other steps don't have required fields
    }
    
    setErrors(newErrors);
    
    if (!isValid) {
      toast.error("Please fill in all required fields");
    }
    
    return isValid;
  };

  return {
    formData,
    errors,
    handleChange,
    handleStatusChange,
    handleNestedChange,
    handleDoubleNestedChange,
    handleSubcontractorChange,
    handleStockChange,
    addSubcontractor,
    removeSubcontractor,
    validateStep
  };
}
