
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';

export const useSiteFormSubcontractors = (
  formData: SiteFormData,
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>,
  errors: Record<string, string>,
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
) => {
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
  
  return {
    handleSubcontractorChange,
    addSubcontractor,
    removeSubcontractor
  };
};
