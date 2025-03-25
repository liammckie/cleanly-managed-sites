
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface SiteContact {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department?: string;
  notes?: string;
  isPrimary?: boolean;
}

export const useSiteFormContacts = () => {
  const [contacts, setContacts] = useState<SiteContact[]>([]);

  const addContact = (contact: SiteContact) => {
    // Generate an ID if one doesn't exist
    const newContact = {
      ...contact,
      id: contact.id || uuidv4(),
    };
    
    setContacts(prevContacts => [...prevContacts, newContact]);
  };

  const updateContact = (updatedContact: SiteContact) => {
    setContacts(prevContacts => 
      prevContacts.map(contact => 
        contact.id === updatedContact.id ? updatedContact : contact
      )
    );
  };

  const removeContact = (contactId: string) => {
    setContacts(prevContacts => 
      prevContacts.filter(contact => contact.id !== contactId)
    );
  };

  const setPrimaryContact = (contactId: string) => {
    setContacts(prevContacts => 
      prevContacts.map(contact => ({
        ...contact,
        isPrimary: contact.id === contactId
      }))
    );
  };

  return {
    contacts,
    setContacts,
    addContact,
    updateContact,
    removeContact,
    setPrimaryContact
  };
};
