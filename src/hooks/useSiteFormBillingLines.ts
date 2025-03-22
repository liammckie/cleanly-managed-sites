
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';
import { BillingLine, BillingFrequency } from '@/components/sites/forms/types/billingTypes';

export const useSiteFormBillingLines = (
  formData: SiteFormData,
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>,
  errors: Record<string, string>,
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
) => {
  // Add new billing line
  const addBillingLine = () => {
    const newBillingLine: BillingLine = {
      description: '',
      amount: 0,
      frequency: 'monthly',
      isRecurring: true
    };
    
    const updatedBillingLines = [...(formData.billingDetails.billingLines || []), newBillingLine];
    
    setFormData(prev => ({
      ...prev,
      billingDetails: {
        ...prev.billingDetails,
        billingLines: updatedBillingLines
      }
    }));
  };
  
  // Remove a billing line
  const removeBillingLine = (index: number) => {
    const updatedBillingLines = [...(formData.billingDetails.billingLines || [])];
    updatedBillingLines.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      billingDetails: {
        ...prev.billingDetails,
        billingLines: updatedBillingLines
      }
    }));
    
    // Remove any errors related to this billing line
    const updatedErrors = { ...errors };
    Object.keys(updatedErrors).forEach(key => {
      if (key.startsWith(`billingDetails.billingLines[${index}]`)) {
        delete updatedErrors[key];
      }
    });
    setErrors(updatedErrors);
  };
  
  // Update billing line field
  const updateBillingLine = (index: number, field: keyof BillingLine, value: any) => {
    const updatedBillingLines = [...(formData.billingDetails.billingLines || [])];
    
    updatedBillingLines[index] = {
      ...updatedBillingLines[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      billingDetails: {
        ...prev.billingDetails,
        billingLines: updatedBillingLines
      }
    }));
    
    // Clear error when field is filled
    const errorKey = `billingDetails.billingLines[${index}].${field}`;
    if (errors[errorKey] && (typeof value === 'string' ? value.trim() : value)) {
      const updatedErrors = { ...errors };
      delete updatedErrors[errorKey];
      setErrors(updatedErrors);
    }
  };
  
  return {
    addBillingLine,
    removeBillingLine,
    updateBillingLine
  };
};
