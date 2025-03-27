
import { useState } from 'react';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { BillingContact } from '@/components/sites/forms/types/billingTypes';
import { v4 as uuidv4 } from 'uuid';
import { adaptBillingDetails } from '@/utils/typeAdapters';

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
    
    // Use adaptBillingDetails to ensure proper type compatibility
    const updatedBillingDetails = adaptBillingDetails({
      ...formData.billingDetails,
      contacts: [...(formData.billingDetails?.contacts || []), newContact]
    });
    
    setFormData((prev) => ({
      ...prev,
      billingDetails: updatedBillingDetails
    }));
    
    setIsAddingContact(false);
  };

  const handleUpdateContact = (contactId: string, updatedContact: BillingContact) => {
    // Use adaptBillingDetails to ensure proper type compatibility
    const updatedBillingDetails = adaptBillingDetails({
      ...formData.billingDetails,
      contacts: (formData.billingDetails?.contacts || []).map(contact => 
        contact.id === contactId ? { ...contact, ...updatedContact } : contact
      )
    });
    
    setFormData((prev) => ({
      ...prev,
      billingDetails: updatedBillingDetails
    }));
    
    setEditingContactId(null);
  };

  const handleDeleteContact = (contactId: string) => {
    // Use adaptBillingDetails to ensure proper type compatibility
    const updatedBillingDetails = adaptBillingDetails({
      ...formData.billingDetails,
      contacts: (formData.billingDetails?.contacts || []).filter(contact => contact.id !== contactId)
    });
    
    setFormData((prev) => ({
      ...prev,
      billingDetails: updatedBillingDetails
    }));
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
