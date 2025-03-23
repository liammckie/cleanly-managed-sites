
import { clientsApi } from './clientsApi';
import { sitesApi } from './sites';
import { workOrdersApi } from './workorders';
import { authApi } from './authApi';
import { businessDetailsApi, uploadBusinessLogo } from './businessDetails/businessDetailsApi';
import { contractorsApi } from './contractors';
import { contactsApi } from './contactsApi';

// Export all API functions from a single module
export {
  clientsApi,
  sitesApi,
  workOrdersApi,
  authApi,
  businessDetailsApi,
  uploadBusinessLogo,
  contractorsApi,
  contactsApi
};

// Re-export types from the API modules
export * from './types';
