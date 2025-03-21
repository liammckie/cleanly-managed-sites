
import { useState } from 'react';
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';
import { SiteStatus } from '@/components/sites/SiteCard';

export const useSiteFormHandlers = (
  formData: SiteFormData,
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>,
  errors: Record<string, string>,
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
) => {
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
  
  // Handle nested object changes with type safety
  const handleNestedChange = (section: keyof SiteFormData, field: string, value: any) => {
    setFormData(prev => {
      // Ensure we have an object to spread
      const sectionData = prev[section] as Record<string, any> || {};
      
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: value
        }
      };
    });
  };
  
  // Handle doubly nested object changes with type safety
  const handleDoubleNestedChange = (section: keyof SiteFormData, subsection: string, field: string, value: any) => {
    setFormData(prev => {
      // Ensure we have objects to spread at both levels
      const sectionData = prev[section] as Record<string, any> || {};
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
  
  return {
    handleChange,
    handleStatusChange,
    handleClientChange,
    handleNestedChange,
    handleDoubleNestedChange
  };
};
