
import { SiteContact } from '../../types/contactTypes';

// This adapter helps to convert between different contact formats as needed
export function adaptContactForUI(contact: SiteContact): SiteContact {
  return {
    ...contact,
    // Make sure the property names match what the UI expects
    is_primary: contact.is_primary || false
  };
}

export function adaptContactsForAPI(contacts: SiteContact[]): SiteContact[] {
  return contacts.map(contact => ({
    ...contact,
    // Make sure the property names match what the API expects
    is_primary: contact.is_primary || false
  }));
}
