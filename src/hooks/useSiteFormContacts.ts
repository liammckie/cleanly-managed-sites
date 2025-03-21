
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';
import { ContactRecord } from '@/lib/types';

export const useSiteFormContacts = (
  formData: SiteFormData,
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>,
  errors: Record<string, string>,
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
) => {
  // Add a new contact
  const addContact = () => {
    const newContact: ContactRecord = {
      name: '',
      role: '',
      department: '',
      email: '',
      phone: '',
      is_primary: false,
      notes: '',
      entity_id: '',
      entity_type: 'site'
    };
    
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, newContact]
    }));
  };
  
  // Remove a contact
  const removeContact = (index: number) => {
    setFormData(prev => {
      const updatedContacts = [...prev.contacts];
      updatedContacts.splice(index, 1);
      
      return {
        ...prev,
        contacts: updatedContacts
      };
    });
    
    // Remove any errors related to this contact
    const updatedErrors = { ...errors };
    Object.keys(updatedErrors).forEach(key => {
      if (key.startsWith(`contacts[${index}]`)) {
        delete updatedErrors[key];
      }
    });
    setErrors(updatedErrors);
  };
  
  // Update contact field
  const handleContactChange = (index: number, field: keyof ContactRecord, value: any) => {
    setFormData(prev => {
      const updatedContacts = [...prev.contacts];
      
      updatedContacts[index] = {
        ...updatedContacts[index],
        [field]: value
      };
      
      // If this contact is marked as primary, ensure no other contacts are primary
      if (field === 'is_primary' && value === true) {
        updatedContacts.forEach((contact, i) => {
          if (i !== index) {
            contact.is_primary = false;
          }
        });
      }
      
      return {
        ...prev,
        contacts: updatedContacts
      };
    });
    
    // Clear error when field is filled
    const errorKey = `contacts[${index}].${field}`;
    if (errors[errorKey] && value && typeof value === 'string' && value.trim()) {
      const updatedErrors = { ...errors };
      delete updatedErrors[errorKey];
      setErrors(updatedErrors);
    }
  };
  
  return {
    addContact,
    removeContact,
    handleContactChange
  };
};
