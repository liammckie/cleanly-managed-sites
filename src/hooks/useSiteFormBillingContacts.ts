
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BillingContact } from '@/components/sites/forms/types/billingTypes';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';

export const useSiteFormBillingContacts = (
  formData: SiteFormData,
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>
) => {
  // Generate a new empty billing contact
  const createEmptyContact = (): BillingContact => ({
    id: uuidv4(),
    name: '',
    email: '',
    phone: '',
    role: '',
    position: '',
    isPrimary: false
  });

  // Add a new billing contact
  const addBillingContact = () => {
    setFormData(prev => {
      // Ensure billing details exists
      const billingDetails = prev.billingDetails || {};
      // Ensure contacts array exists
      const contacts = billingDetails.contacts || [];
      
      return {
        ...prev,
        billingDetails: {
          ...billingDetails,
          contacts: [...contacts, createEmptyContact()]
        }
      };
    });
  };

  // Update a billing contact
  const updateBillingContact = (id: string, field: keyof BillingContact, value: any) => {
    setFormData(prev => {
      const billingDetails = prev.billingDetails || {};
      const contacts = billingDetails.contacts || [];
      
      const updatedContacts = contacts.map(contact =>
        contact.id === id ? { ...contact, [field]: value } : contact
      );
      
      return {
        ...prev,
        billingDetails: {
          ...billingDetails,
          contacts: updatedContacts
        }
      };
    });
  };

  // Remove a billing contact
  const removeBillingContact = (id: string) => {
    setFormData(prev => {
      const billingDetails = prev.billingDetails || {};
      const contacts = billingDetails.contacts || [];
      
      return {
        ...prev,
        billingDetails: {
          ...billingDetails,
          contacts: contacts.filter(contact => contact.id !== id)
        }
      };
    });
  };

  // Set a contact as primary
  const setPrimaryContact = (id: string) => {
    setFormData(prev => {
      const billingDetails = prev.billingDetails || {};
      const contacts = billingDetails.contacts || [];
      
      const updatedContacts = contacts.map(contact => ({
        ...contact,
        isPrimary: contact.id === id
      }));
      
      return {
        ...prev,
        billingDetails: {
          ...billingDetails,
          contacts: updatedContacts
        }
      };
    });
  };

  return {
    addBillingContact,
    updateBillingContact,
    removeBillingContact,
    setPrimaryContact,
    createEmptyContact
  };
};
