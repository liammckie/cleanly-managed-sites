
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BillingContact } from '@/components/sites/forms/types/billingTypes';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData'; 
import { getDefaultBillingDetails, ensureBillingDetails } from '@/components/sites/forms/steps/DefaultBillingDetails';

export const useSiteFormBillingContacts = (
  formData: SiteFormData,
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>
) => {
  // Ensure we're working with a properly initialized form data object
  const safeFormData = ensureBillingDetails(formData);
  
  // Add a billing contact
  const addBillingContact = (contact: BillingContact) => {
    // Generate ID if not provided
    const newContact = {
      ...contact,
      id: contact.id || uuidv4()
    };
    
    // Update the form data with the new contact
    setFormData((prev) => {
      const updatedFormData = ensureBillingDetails(prev);
      
      return {
        ...updatedFormData,
        billingDetails: {
          ...updatedFormData.billingDetails,
          contacts: [...(updatedFormData.billingDetails.contacts || []), newContact]
        }
      };
    });
  };
  
  // Update a billing contact
  const updateBillingContact = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const updatedFormData = ensureBillingDetails(prev);
      const contacts = [...(updatedFormData.billingDetails.contacts || [])];
      
      if (contacts[index]) {
        contacts[index] = {
          ...contacts[index],
          [field]: value
        };
      }
      
      return {
        ...updatedFormData,
        billingDetails: {
          ...updatedFormData.billingDetails,
          contacts
        }
      };
    });
  };
  
  // Remove a billing contact
  const removeBillingContact = (index: number) => {
    setFormData((prev) => {
      const updatedFormData = ensureBillingDetails(prev);
      const contacts = [...(updatedFormData.billingDetails.contacts || [])];
      
      contacts.splice(index, 1);
      
      return {
        ...updatedFormData,
        billingDetails: {
          ...updatedFormData.billingDetails,
          contacts
        }
      };
    });
  };
  
  // Set a contact as primary
  const setPrimaryBillingContact = (index: number) => {
    setFormData((prev) => {
      const updatedFormData = ensureBillingDetails(prev);
      const contacts = [...(updatedFormData.billingDetails.contacts || [])].map((contact, i) => ({
        ...contact,
        isPrimary: i === index
      }));
      
      return {
        ...updatedFormData,
        billingDetails: {
          ...updatedFormData.billingDetails,
          contacts
        }
      };
    });
  };
  
  return {
    contacts: safeFormData.billingDetails?.contacts || [],
    addBillingContact,
    updateBillingContact,
    removeBillingContact,
    setPrimaryBillingContact
  };
};
