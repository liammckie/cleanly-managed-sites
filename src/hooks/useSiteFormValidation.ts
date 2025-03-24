
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';

export const useSiteFormValidation = () => {
  // Validate a specific step
  const validateStep = (
    formData: SiteFormData, 
    stepIndex: number,
    errors: Record<string, string>,
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
  ): boolean => {
    // Clear previous errors
    const newErrors: Record<string, string> = {};
    
    // Step 0: Basic Information
    if (stepIndex === 0) {
      if (!formData.name) newErrors.name = 'Site name is required';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.postcode) newErrors.postcode = 'Postcode is required';
      if (!formData.clientId) newErrors.clientId = 'Client is required';
      
      // Note: Representative validation has been moved to step 2 as per requirements
    }
    
    // Step 1: Site Contacts (Moved from the old Step 4)
    else if (stepIndex === 1) {
      // Ensure at least one contact exists and has required fields
      if (!formData.contacts || formData.contacts.length === 0) {
        newErrors['contacts'] = 'At least one contact is required';
      } else {
        // Validate each contact
        formData.contacts.forEach((contact, index) => {
          if (!contact.name) {
            newErrors[`contacts[${index}].name`] = 'Contact name is required';
          }
          if (!contact.email) {
            newErrors[`contacts[${index}].email`] = 'Contact email is required';
          }
        });
      }
      
      // Validate representative
      if (!formData.representative) {
        newErrors.representative = 'Representative is required';
      }
    }
    
    // Step 2: Contract Details
    else if (stepIndex === 2) {
      const { contractDetails } = formData;
      if (contractDetails) {
        if (!contractDetails.startDate) newErrors['contractDetails.startDate'] = 'Start date is required';
        if (!contractDetails.contractType) newErrors['contractDetails.contractType'] = 'Contract type is required';
      }
    }
    
    // Step 3: Billing Details
    else if (stepIndex === 3) {
      const { billingDetails } = formData;
      if (billingDetails) {
        if (!billingDetails.billingFrequency) 
          newErrors['billingDetails.billingFrequency'] = 'Billing frequency is required';
      }
    }
    
    // Set any new errors
    setErrors(newErrors);
    console.log("Validation for step", stepIndex, "has errors:", Object.keys(newErrors).length > 0, newErrors);
    
    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };
  
  return {
    validateStep
  };
};
