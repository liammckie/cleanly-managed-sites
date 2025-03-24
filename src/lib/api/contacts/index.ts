
// Re-export all contact-related APIs from a single entry point
export * from './types';
export * from './contactsCore';
export * from './contactsRead';
export * from './contactsWrite';
export * from './contactsSearch';

// Export the combined contactsApi object for backward compatibility
import { getContacts, getContactById, getContactsByEntityId, getContactEntities } from './contactsRead';
import { createContact, updateContact, deleteContact, setPrimaryContact } from './contactsWrite';
import { searchEntities } from './contactsSearch';

export const contactsApi = {
  // Read operations
  getContacts,
  getContactById,
  getContactsByEntityId,
  getContactEntities,
  
  // Write operations
  createContact,
  updateContact,
  deleteContact,
  setPrimaryContact,
  
  // Search operations
  searchEntities
};
