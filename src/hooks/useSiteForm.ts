
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SiteFormData, getInitialFormData } from '@/components/sites/forms/siteFormTypes';
import { SiteStatus } from '@/components/sites/SiteCard';

export const useSiteForm = () => {
  // Initialize form data with default values
  const [formData, setFormData] = useState<SiteFormData>(getInitialFormData());
  
  // Initialize errors state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Initialize form with react-hook-form
  const form = useForm<SiteFormData>({
    defaultValues: formData
  });
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is filled
    if (errors[name] && value.trim()) {
      const updatedErrors = { ...errors };
      delete updatedErrors[name];
      setErrors(updatedErrors);
    }
  };
  
  // Handle status change
  const handleStatusChange = (value: SiteStatus) => {
    setFormData(prev => ({ ...prev, status: value }));
  };
  
  // Handle client change
  const handleClientChange = (clientId: string) => {
    setFormData(prev => ({ ...prev, clientId }));
    
    // Clear error when client is selected
    if (errors['clientId']) {
      const updatedErrors = { ...errors };
      delete updatedErrors['clientId'];
      setErrors(updatedErrors);
    }
  };
  
  // Handle nested object changes
  const handleNestedChange = (section: keyof SiteFormData, field: string, value: any) => {
    setFormData(prev => {
      const sectionData = prev[section] || {};
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: value
        }
      };
    });
  };
  
  // Handle doubly nested object changes
  const handleDoubleNestedChange = (section: keyof SiteFormData, subsection: string, field: string, value: any) => {
    setFormData(prev => {
      const sectionData = prev[section] || {};
      const subsectionData = (sectionData as any)[subsection] || {};
      
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
  
  // Handle subcontractor changes
  const handleSubcontractorChange = (index: number, field: string, value: string) => {
    const updatedSubcontractors = [...formData.subcontractors];
    updatedSubcontractors[index] = {
      ...updatedSubcontractors[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      subcontractors: updatedSubcontractors
    }));
    
    // Clear errors for the field
    const errorKey = `subcontractors[${index}].${field}`;
    if (errors[errorKey] && value.trim()) {
      const updatedErrors = { ...errors };
      delete updatedErrors[errorKey];
      setErrors(updatedErrors);
    }
  };
  
  // Handle stock item changes
  const handleStockChange = (index: number, value: string) => {
    const updatedStock = [...formData.replenishables.stock];
    updatedStock[index] = value;
    
    setFormData(prev => ({
      ...prev,
      replenishables: {
        ...prev.replenishables,
        stock: updatedStock
      }
    }));
  };
  
  // Add new subcontractor
  const addSubcontractor = () => {
    setFormData(prev => ({
      ...prev,
      subcontractors: [
        ...prev.subcontractors,
        { businessName: '', contactName: '', email: '', phone: '' }
      ]
    }));
  };
  
  // Remove a subcontractor
  const removeSubcontractor = (index: number) => {
    const updatedSubcontractors = formData.subcontractors.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      subcontractors: updatedSubcontractors
    }));
    
    // Remove any errors related to the removed subcontractor
    const updatedErrors = { ...errors };
    Object.keys(updatedErrors).forEach(key => {
      if (key.startsWith(`subcontractors[${index}]`)) {
        delete updatedErrors[key];
      }
    });
    setErrors(updatedErrors);
  };
  
  // Validate a specific step
  const validateStep = (stepIndex: number): boolean => {
    // Each step has its own validation logic
    switch (stepIndex) {
      case 0: // Basic information
        return validateBasicInfo();
      case 3: // Subcontractor details
        return validateSubcontractors();
      default:
        return true;
    }
  };
  
  // Validate basic site information
  const validateBasicInfo = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.clientId) newErrors['clientId'] = 'Client is required';
    if (!formData.name?.trim()) newErrors['name'] = 'Site name is required';
    if (!formData.address?.trim()) newErrors['address'] = 'Address is required';
    if (!formData.city?.trim()) newErrors['city'] = 'City is required';
    if (!formData.state?.trim()) newErrors['state'] = 'State is required';
    if (!formData.postcode?.trim()) newErrors['postcode'] = 'Postcode is required';
    if (!formData.representative?.trim()) newErrors['representative'] = 'Representative name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate subcontractors
  const validateSubcontractors = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    formData.subcontractors.forEach((subcontractor, index) => {
      if (!subcontractor.businessName?.trim()) {
        newErrors[`subcontractors[${index}].businessName`] = 'Business name is required';
      }
      if (!subcontractor.contactName?.trim()) {
        newErrors[`subcontractors[${index}].contactName`] = 'Contact name is required';
      }
      if (!subcontractor.email?.trim()) {
        newErrors[`subcontractors[${index}].email`] = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(subcontractor.email)) {
        newErrors[`subcontractors[${index}].email`] = 'Valid email is required';
      }
      if (!subcontractor.phone?.trim()) {
        newErrors[`subcontractors[${index}].phone`] = 'Phone is required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  return {
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    handleStatusChange,
    handleClientChange,
    handleNestedChange,
    handleDoubleNestedChange,
    handleSubcontractorChange,
    handleStockChange,
    addSubcontractor,
    removeSubcontractor,
    validateStep,
    form // Return the form instance for FormProvider
  };
};
