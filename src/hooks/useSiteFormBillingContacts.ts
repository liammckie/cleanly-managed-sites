
import { useState } from 'react';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { BillingContact } from '@/components/sites/forms/types/billingTypes';
import { v4 as uuidv4 } from 'uuid';

export function useSiteFormBillingContacts(
  formData: SiteFormData,
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>
) {
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);

  const handleAddContact = (contact: BillingContact) => {
    const newContact = {
      ...contact,
      id: uuidv4()
    };
    
    // Safely update billingDetails.contacts
    setFormData((prev) => {
      const prevBillingDetails = prev.billingDetails || {};
      const prevContacts = prevBillingDetails.contacts || [];
      
      return {
        ...prev,
        billingDetails: {
          ...prevBillingDetails,
          contacts: [...prevContacts, newContact]
        }
      };
    });
    
    setIsAddingContact(false);
  };

  const handleUpdateContact = (contactId: string, updatedContact: BillingContact) => {
    setFormData((prev) => {
      const prevBillingDetails = prev.billingDetails || {};
      const prevContacts = prevBillingDetails.contacts || [];
      
      return {
        ...prev,
        billingDetails: {
          ...prevBillingDetails,
          contacts: prevContacts.map(contact => 
            contact.id === contactId ? { ...contact, ...updatedContact } : contact
          )
        }
      };
    });
    
    setEditingContactId(null);
  };

  const handleDeleteContact = (contactId: string) => {
    setFormData((prev) => {
      const prevBillingDetails = prev.billingDetails || {};
      const prevContacts = prevBillingDetails.contacts || [];
      
      return {
        ...prev,
        billingDetails: {
          ...prevBillingDetails,
          contacts: prevContacts.filter(contact => contact.id !== contactId)
        }
      };
    });
  };

  return {
    contacts: formData.billingDetails?.contacts || [],
    isAddingContact,
    editingContactId,
    setIsAddingContact,
    setEditingContactId,
    handleAddContact,
    handleUpdateContact,
    handleDeleteContact
  };
}
