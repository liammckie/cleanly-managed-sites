
// This file is now just re-exporting everything from the API modules
// to maintain backward compatibility
export * from './clients';  // Updated path
export * from './sites';    // Updated path
export * from './subcontractorsApi';  // Updated path
export * from './authApi';  // Updated path
export * from './workorders';  // Updated path
export * from './contractors';  // Updated path
export * from './contacts'; // Updated path

// Also directly export the contactsApi object for backward compatibility
import { contactsApi } from './contacts';  // Updated path
export { contactsApi };

// Export types but avoid duplication by using the types from api/types
export * from './types';  // Updated path
