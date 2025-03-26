
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { BillingContact } from '@/components/sites/forms/types/billingTypes';

export const useSiteFormBillingContacts = (
  formData: SiteFormData,
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>,
  errors: Record<string, string>,
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
) => {
  // Add a new billing contact
  const addBillingContact = () => {
    // Create a new contact with default values
    const newContact: BillingContact = {
      id: crypto.randomUUID(),
      name: '',
      email: '',
      phone: '',
      role: '' 
    };
    
    setFormData(prev => {
      const updatedContacts = [...(prev.billingDetails.contacts || []), newContact];
      return {
        ...prev,
        billingDetails: {
          ...prev.billingDetails,
          contacts: updatedContacts
        }
      };
    });
  };
  
  // Remove a billing contact
  const removeBillingContact = (index: number) => {
    const updatedContacts = [...(formData.billingDetails.contacts || [])];
    updatedContacts.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      billingDetails: {
        ...prev.billingDetails,
        contacts: updatedContacts
      }
    }));
    
    // Remove any errors related to this contact
    const updatedErrors = { ...errors };
    Object.keys(updatedErrors).forEach(key => {
      if (key.startsWith(`billingDetails.contacts[${index}]`)) {
        delete updatedErrors[key];
      }
    });
    setErrors(updatedErrors);
  };
  
  // Update billing contact field
  const updateBillingContact = (index: number, field: keyof BillingContact, value: string) => {
    const updatedContacts = [...(formData.billingDetails.contacts || [])];
    
    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      billingDetails: {
        ...prev.billingDetails,
        contacts: updatedContacts
      }
    }));
    
    // Clear error when field is filled
    const errorKey = `billingDetails.contacts[${index}].${String(field)}`;
    if (errors[errorKey] && value.trim()) {
      const updatedErrors = { ...errors };
      delete updatedErrors[errorKey];
      setErrors(updatedErrors);
    }
  };
  
  return {
    addBillingContact,
    removeBillingContact,
    updateBillingContact
  };
};
