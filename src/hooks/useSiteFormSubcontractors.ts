import { Dispatch, SetStateAction } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SiteFormData } from '@/components/sites/forms/types';
import { Subcontractor, serviceOptions } from '@/components/sites/forms/types/subcontractorTypes';

export const useSiteFormSubcontractors = (
  formData: SiteFormData,
  setFormData: Dispatch<SetStateAction<SiteFormData>>,
  errors: Record<string, string>,
  setErrors: Dispatch<SetStateAction<Record<string, string>>>
) => {
  // Add a new subcontractor
  const addSubcontractor = () => {
    const newSubcontractor: Subcontractor = {
      id: uuidv4(),
      business_name: '',
      contact_name: '',
      email: '',
      phone: '',
      services: []
    };
    
    setFormData(prev => ({
      ...prev,
      subcontractors: [...(prev.subcontractors || []), newSubcontractor],
      has_subcontractors: true
    }));
  };
  
  // Remove a subcontractor
  const removeSubcontractor = (index: number) => {
    setFormData(prev => {
      const updatedSubcontractors = [...(prev.subcontractors || [])];
      updatedSubcontractors.splice(index, 1);
      
      return {
        ...prev,
        subcontractors: updatedSubcontractors,
        has_subcontractors: updatedSubcontractors.length > 0
      };
    });
  };
  
  // Update a subcontractor field
  const updateSubcontractor = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const updatedSubcontractors = [...(prev.subcontractors || [])];
      updatedSubcontractors[index] = { 
        ...updatedSubcontractors[index], 
        [field]: value 
      };
      
      return {
        ...prev,
        subcontractors: updatedSubcontractors
      };
    });
    
    // Clear any validation errors for the updated field
    if (errors[`subcontractors[${index}].${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`subcontractors[${index}].${field}`];
        return newErrors;
      });
    }
  };
  
  // Validate subcontractors
  const validateSubcontractors = (): boolean => {
    let isValid = true;
    const newErrors: Record<string, string> = {};
    
    (formData.subcontractors || []).forEach((subcontractor, index) => {
      if (!subcontractor.business_name) {
        newErrors[`subcontractors[${index}].business_name`] = 'Business name is required';
        isValid = false;
      }
      
      if (!subcontractor.contact_name) {
        newErrors[`subcontractors[${index}].contact_name`] = 'Contact name is required';
        isValid = false;
      }
    });
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };
  
  return {
    addSubcontractor,
    removeSubcontractor,
    updateSubcontractor,
    validateSubcontractors,
    serviceOptions  // Re-export service options for component use
  };
};
