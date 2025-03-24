
// This file is now just re-exporting everything from the API modules
// to maintain backward compatibility
export * from './clients';  
export * from './sites';    
export * from './subcontractorsApi';  
export * from './authApi';  
export * from './workorders';  
export * from './contractors';  
export * from './contacts'; 

// Also directly export the contactsApi object for backward compatibility
import { contactsApi } from './contacts';  
export { contactsApi };

// Export types but avoid duplication by using the types from api/types
export * from './types';  
