
import { clientsApi } from './clientsApi';
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
  contactsApi  // Make sure contactsApi is exported here
};

// Re-export types from the API modules
export * from './types';
