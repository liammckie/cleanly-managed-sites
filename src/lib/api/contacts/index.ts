
import { getEntityContacts, getContactById, getAllContacts, getContacts, getContactEntities, getContactsByEntityId, searchEntities } from './contactsRead';
import { addContact, updateContactRecord, removeContact, makePrimaryContact, createContact, updateContact, deleteContact, setPrimaryContact } from './contactsWrite';

// Export as contactsApi object for backward compatibility
export const contactsApi = {
  // Read operations
  getEntityContacts,
  getContactById,
  getAllContacts,
  getContacts,
  getContactEntities,
  getContactsByEntityId,
  searchEntities,
  
  // Write operations
  createContact,
  updateContact,
  deleteContact,
  setPrimaryContact,
  addContact,
  updateContactRecord,
  removeContact,
  makePrimaryContact
};

// Also export individual functions
export {
  getEntityContacts,
  getContactById,
  getAllContacts,
  getContacts,
  getContactEntities,
  getContactsByEntityId,
  searchEntities,
  addContact,
  updateContactRecord,
  removeContact,
  makePrimaryContact,
  createContact,
  updateContact,
  deleteContact,
  setPrimaryContact
};
