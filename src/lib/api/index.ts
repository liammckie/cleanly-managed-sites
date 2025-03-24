
import { clientsApi } from './clients';  // Updated import path
import { sitesApi } from './sites';
import { workOrdersApi } from './workorders';
import { authApi } from './authApi';
import { 
  getBusinessDetails, 
  updateBusinessDetails, 
  uploadBusinessLogo 
} from './businessDetails/businessDetailsApi';
import { contractorsApi } from './contractors';
import { contactsApi } from './contactsApi';

// Export all API functions from a single module
export {
  clientsApi,
  sitesApi,
  workOrdersApi,
  authApi,
  getBusinessDetails,
  updateBusinessDetails,
  uploadBusinessLogo,
  contractorsApi,
  contactsApi
};

// Re-export types from the API modules
export * from './types';
