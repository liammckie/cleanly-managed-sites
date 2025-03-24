
import { getEntityContacts, getContactById, getAllContacts } from './contactsRead';
import { addContact, updateContactRecord, removeContact, makePrimaryContact } from './contactsWrite';

// Export as contactsApi object for backward compatibility
export const contactsApi = {
  // Read operations
  getEntityContacts,
  getContactById,
  getAllContacts,
  
  // Write operations
  createContact: addContact,
  updateContact: updateContactRecord,
  deleteContact: removeContact,
  setPrimaryContact: makePrimaryContact
};

// Also export individual functions
export {
  getEntityContacts,
  getContactById,
  getAllContacts,
  addContact,
  updateContactRecord,
  removeContact,
  makePrimaryContact
};
