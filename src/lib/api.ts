
// This file is now just re-exporting everything from the API modules
// to maintain backward compatibility
export * from './api/clients';  // Updated to use the new modular clients API
export * from './api/sites';
export * from './api/subcontractorsApi';
export * from './api/authApi';
export * from './api/workorders';
export * from './api/contractors';
export * from './api/contactsApi';

// Also directly export the contactsApi object for backward compatibility
import { contactsApi } from './api/contactsApi';
export { contactsApi };

// Export types but avoid duplication by using the types from api/types
export * from './api/types';
