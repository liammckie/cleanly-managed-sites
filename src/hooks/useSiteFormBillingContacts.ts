
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BillingContact } from '@/components/sites/forms/types/billingTypes';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';

export function useSiteFormBillingContacts(
  formData: SiteFormData,
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>
) {
  // Initialize billing contacts from formData or with an empty array
  const [billingContacts, setBillingContacts] = useState<BillingContact[]>(() => {
    // Ensure billingDetails exists and initialize if needed
    const billingDetails = formData.billingDetails || { billingLines: [], contacts: [] };
    
    // Ensure contacts exists and initialize if needed
    return billingDetails.contacts || [];
  });

  // Update form data whenever billing contacts change
  useEffect(() => {
    setFormData(prev => {
      // Ensure billingDetails exists
      const billingDetails = prev.billingDetails || { billingLines: [], contacts: [] };
      
      return {
        ...prev,
        billingDetails: {
          ...billingDetails,
          contacts: billingContacts
        }
      };
    });
  }, [billingContacts, setFormData]);

  // Function to add a new billing contact
  const addBillingContact = () => {
    const newContact: BillingContact = {
      id: uuidv4(),
      name: '',
      email: '',
      phone: '',
      role: ''
    };

    setBillingContacts(prev => [...prev, newContact]);
  };

  // Function to update a billing contact
  const updateBillingContact = (id: string, field: keyof BillingContact, value: any) => {
    setBillingContacts(prev => 
      prev.map(contact => 
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    );
  };

  // Function to remove a billing contact
  const removeBillingContact = (id: string) => {
    setBillingContacts(prev => prev.filter(contact => contact.id !== id));
  };

  // Function to set a contact as primary
  const setPrimaryBillingContact = (id: string) => {
    setBillingContacts(prev => 
      prev.map(contact => ({
        ...contact,
        isPrimary: contact.id === id
      }))
    );
  };

  return {
    billingContacts,
    addBillingContact,
    updateBillingContact,
    removeBillingContact,
    setPrimaryBillingContact
  };
}
