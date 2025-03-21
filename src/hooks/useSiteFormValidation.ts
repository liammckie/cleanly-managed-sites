
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';

export const useSiteFormValidation = () => {
  // Validate a specific step
  const validateStep = (formData: SiteFormData, stepIndex: number, errors: Record<string, string>, setErrors: (errors: Record<string, string>) => void): boolean => {
    // Each step has its own validation logic
    switch (stepIndex) {
      case 0: // Basic information
        return validateBasicInfo(formData, errors, setErrors);
      case 3: // Subcontractor details
        return validateSubcontractors(formData, errors, setErrors);
      default:
        return true;
    }
  };
  
  // Validate basic site information
  const validateBasicInfo = (formData: SiteFormData, errors: Record<string, string>, setErrors: (errors: Record<string, string>) => void): boolean => {
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
  const validateSubcontractors = (formData: SiteFormData, errors: Record<string, string>, setErrors: (errors: Record<string, string>) => void): boolean => {
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
    validateStep,
    validateBasicInfo,
    validateSubcontractors
  };
};
