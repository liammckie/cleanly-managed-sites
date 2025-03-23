
import { useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { ContactRecord } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

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
  const { control, setValue, getValues } = useFormContext();
  
  // Use the useFieldArray hook to manage the contacts array in the form
  const {
    fields: contacts,
    append,
    remove,
    update
  } = useFieldArray({
    control,
    name: 'contacts',
  });
  
  // Simple function to add a new empty contact (required for siteFormConfig compatibility)
  const addContact = useCallback(() => {
    // Create a temporary ID for the new contact
    const tempId = uuidv4();
    
    // Add an empty contact to the form state
    append({
      id: tempId,
      name: '',
      role: '',
      entity_type: 'site',
      is_primary: false
    });
  }, [append]);
  
  // Add a contact with data
  const addContactWithData = useCallback((contact: SiteContactFormData) => {
    // Create a temporary ID for the new contact
    const tempId = uuidv4();
    
    // Add the contact to the form state
    append({
      ...contact,
      id: tempId,
      entity_type: 'site',
    });
    
    return tempId;
  }, [append]);
  
  // Update an existing contact in the form
  const updateContact = useCallback((index: number, data: Partial<SiteContactFormData>) => {
    const currentContact = getValues(`contacts.${index}`);
    
    update(index, {
      ...currentContact,
      ...data,
    });
  }, [getValues, update]);
  
  // Remove a contact from the form
  const removeContact = useCallback((index: number) => {
    remove(index);
  }, [remove]);
  
  // Set a contact as primary (and unset others)
  const setAsPrimary = useCallback((index: number) => {
    // First, unset all contacts as primary
    contacts.forEach((_, i) => {
      setValue(`contacts.${i}.is_primary`, false);
    });
    
    // Then set the selected contact as primary
    setValue(`contacts.${index}.is_primary`, true);
  }, [contacts, setValue]);
  
  // Handle contact change for compatibility with siteFormConfig
  const handleContactChange = useCallback((index: number, field: keyof ContactRecord, value: any) => {
    setValue(`contacts.${index}.${field}`, value);
  }, [setValue]);
  
  // Convert contacts to the format needed for the API
  const prepareContactsForSubmission = useCallback((siteId: string) => {
    return getValues('contacts').map((contact: any) => ({
      name: contact.name,
      role: contact.role,
      department: contact.department,
      email: contact.email,
      phone: contact.phone,
      is_primary: contact.is_primary,
      notes: contact.notes,
      entity_id: siteId,
      entity_type: 'site',
      // Convert any Symbol to string with String() if it exists
      ...(contact.id ? { id: String(contact.id) } : {}),
    }));
  }, [getValues]);
  
  return {
    contacts,
    addContact,
    addContactWithData,
    updateContact,
    removeContact,
    setAsPrimary,
    handleContactChange,
    prepareContactsForSubmission,
  };
};
