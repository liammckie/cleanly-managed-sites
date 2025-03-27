
import { useState } from 'react';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { v4 as uuidv4 } from 'uuid';

export function useSiteFormBillingContacts(
  formData: SiteFormData,
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>
) {
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
  const [isEditContactDialogOpen, setIsEditContactDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<any>(null);

  const addBillingContact = (contact: any) => {
    const newContact = {
      ...contact,
      id: uuidv4()
    };

    setFormData(prev => {
      // Get the current billing details or create a new object
      const currentBillingDetails = prev.billingDetails || {};
      // Get the current contacts array or create a new array
      const currentContacts = currentBillingDetails.contacts || [];
      // Ensure billingLines exists
      const billingLines = currentBillingDetails.billingLines || [];

      return {
        ...prev,
        billingDetails: {
          ...currentBillingDetails,
          contacts: [...currentContacts, newContact],
          billingLines
        }
      };
    });
  };

  const updateBillingContact = (id: string, updatedContact: any) => {
    setFormData(prev => {
      // Get the current billing details or create a new object
      const currentBillingDetails = prev.billingDetails || {};
      // Get the current contacts array or create a new array
      const currentContacts = currentBillingDetails.contacts || [];
      // Ensure billingLines exists
      const billingLines = currentBillingDetails.billingLines || [];

      return {
        ...prev,
        billingDetails: {
          ...currentBillingDetails,
          contacts: currentContacts.map(contact => 
            contact.id === id ? { ...contact, ...updatedContact } : contact
          ),
          billingLines
        }
      };
    });
  };

  const removeBillingContact = (id: string) => {
    setFormData(prev => {
      // Get the current billing details or create a new object
      const currentBillingDetails = prev.billingDetails || {};
      // Get the current contacts array or create a new array
      const currentContacts = currentBillingDetails.contacts || [];
      // Ensure billingLines exists
      const billingLines = currentBillingDetails.billingLines || [];

      return {
        ...prev,
        billingDetails: {
          ...currentBillingDetails,
          contacts: currentContacts.filter(contact => contact.id !== id),
          billingLines
        }
      };
    });
  };

  const openAddContactDialog = () => {
    setCurrentContact(null);
    setIsAddContactDialogOpen(true);
  };

  const openEditContactDialog = (contact: any) => {
    setCurrentContact(contact);
    setIsEditContactDialogOpen(true);
  };

  return {
    billingContacts: formData.billingDetails?.contacts || [],
    addBillingContact,
    updateBillingContact,
    removeBillingContact,
    openAddContactDialog,
    closeAddContactDialog: () => setIsAddContactDialogOpen(false),
    openEditContactDialog,
    closeEditContactDialog: () => setIsEditContactDialogOpen(false),
    isAddContactDialogOpen,
    isEditContactDialogOpen,
    currentContact
  };
}
