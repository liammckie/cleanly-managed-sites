
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BillingContact, BillingDetails } from '@/components/sites/forms/types/billingTypes';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData'; 
import { adaptBillingDetails } from '@/utils/typeAdapters';

export const useSiteFormBillingContacts = (
  formData: SiteFormData,
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>
) => {
  // Ensure we're working with a properly initialized form data object
  const billingDetails = adaptBillingDetails(formData.billingDetails || {});
  
  // Add a billing contact
  const addBillingContact = (contact: BillingContact) => {
    // Generate ID if not provided
    const newContact = {
      ...contact,
      id: contact.id || uuidv4()
    };
    
    // Update the form data with the new contact
    setFormData((prev) => {
      const prevBillingDetails = adaptBillingDetails(prev.billingDetails || {});
      const contacts = [...(prevBillingDetails.contacts || []), newContact];
      
      return {
        ...prev,
        billingDetails: {
          ...prevBillingDetails,
          contacts
        }
      };
    });
  };
  
  // Update a billing contact
  const updateBillingContact = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const prevBillingDetails = adaptBillingDetails(prev.billingDetails || {});
      const contacts = [...(prevBillingDetails.contacts || [])];
      
      if (contacts[index]) {
        contacts[index] = {
          ...contacts[index],
          [field]: value
        };
      }
      
      return {
        ...prev,
        billingDetails: {
          ...prevBillingDetails,
          contacts
        }
      };
    });
  };
  
  // Remove a billing contact
  const removeBillingContact = (index: number) => {
    setFormData((prev) => {
      const prevBillingDetails = adaptBillingDetails(prev.billingDetails || {});
      const contacts = [...(prevBillingDetails.contacts || [])];
      
      contacts.splice(index, 1);
      
      return {
        ...prev,
        billingDetails: {
          ...prevBillingDetails,
          contacts
        }
      };
    });
  };
  
  return {
    contacts: billingDetails.contacts || [],
    addBillingContact,
    updateBillingContact,
    removeBillingContact
  };
};
