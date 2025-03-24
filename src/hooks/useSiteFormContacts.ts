
import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ContactRecord } from '@/lib/types';
import { SiteContact, convertContactRecordToSiteContact } from '@/components/sites/forms/types/contactTypes';
import { useContacts } from './useContacts';
import { toast } from 'sonner';

// Type for the site contact form data
export type SiteContactFormData = {
  name: string;
  role: string;
  department?: string;
  email?: string;
  phone?: string;
  is_primary?: boolean;
  notes?: string;
};

// Create a hook for handling contacts in the site form
export const useSiteFormContacts = () => {
  const [contacts, setContacts] = useState<SiteContact[]>([]);
  const { contacts: existingContacts, isLoading } = useContacts();
  
  // Simple function to add a new empty contact
  const addContact = useCallback(() => {
    const newContact: SiteContact = {
      id: uuidv4(),
      name: '',
      role: 'operations', // Default role
      entity_type: 'site',
      entity_id: '', // Will be set when saving
      is_primary: contacts.length === 0, // First contact is primary by default
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setContacts(prev => [...prev, newContact]);
    console.log('Added new contact', newContact);
  }, [contacts]);
  
  // Add a contact with data
  const addContactWithData = useCallback((contact: SiteContactFormData) => {
    const newId = uuidv4();
    const newContact: SiteContact = {
      ...contact,
      id: newId,
      entity_type: 'site',
      entity_id: '', // Will be set when saving
      is_primary: contact.is_primary || contacts.length === 0, // First contact is primary by default
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setContacts(prev => [...prev, newContact]);
    console.log('Added contact with data', newContact);
    return newId;
  }, [contacts]);
  
  // Add an existing contact
  const addExistingContact = useCallback((contactId: string) => {
    console.log('Looking for contact with ID:', contactId, 'in', existingContacts);
    
    if (isLoading) {
      toast.error("Still loading contacts. Please try again in a moment.");
      return;
    }
    
    const contactToAdd = existingContacts.find(c => c.id === contactId);
    
    if (contactToAdd) {
      console.log('Found contact to add:', contactToAdd);
      const newContact: SiteContact = convertContactRecordToSiteContact(contactToAdd);
      // Ensure the contact is marked as a site contact regardless of its original entity_type
      newContact.entity_type = 'site';
      // Make it primary if it's the first contact
      if (contacts.length === 0) {
        newContact.is_primary = true;
      }
      
      setContacts(prev => [...prev, newContact]);
      toast.success(`Added ${contactToAdd.name} as a contact`);
    } else {
      console.error('Could not find contact with ID:', contactId);
      toast.error("Could not find the selected contact");
    }
  }, [existingContacts, contacts, isLoading]);
  
  // Update an existing contact in the form
  const updateContact = useCallback((index: number, data: Partial<SiteContactFormData>) => {
    setContacts(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], ...data };
      }
      return updated;
    });
  }, []);
  
  // Remove a contact from the form
  const removeContact = useCallback((index: number) => {
    setContacts(prev => {
      const updated = prev.filter((_, i) => i !== index);
      
      // If we removed the primary contact and there are still contacts,
      // make the first one primary
      if (prev[index]?.is_primary && updated.length > 0) {
        updated[0] = { ...updated[0], is_primary: true };
      }
      
      return updated;
    });
  }, []);
  
  // Set a contact as primary (and unset others)
  const setAsPrimary = useCallback((index: number) => {
    setContacts(prev => {
      return prev.map((contact, i) => ({
        ...contact,
        is_primary: i === index
      }));
    });
  }, []);
  
  // Handle contact change for compatibility with siteFormConfig
  const handleContactChange = useCallback((index: number, field: keyof ContactRecord, value: any) => {
    setContacts(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { 
          ...updated[index], 
          [field]: value,
          // If setting a contact as primary, unset others
          ...(field === 'is_primary' && value === true 
            ? { is_primary: true } 
            : {})
        };
        
        // If setting primary, unset others
        if (field === 'is_primary' && value === true) {
          updated.forEach((c, i) => {
            if (i !== index) {
              c.is_primary = false;
            }
          });
        }
      }
      return updated;
    });
  }, []);
  
  // Convert contacts to the format needed for the API
  const prepareContactsForSubmission = useCallback((siteId: string) => {
    return contacts.map(contact => ({
      ...contact,
      entity_id: siteId,
      entity_type: 'site'
    }));
  }, [contacts]);
  
  return {
    contacts,
    setContacts,
    addContact,
    addContactWithData,
    addExistingContact,
    updateContact,
    removeContact,
    setAsPrimary,
    handleContactChange,
    prepareContactsForSubmission,
  };
};
