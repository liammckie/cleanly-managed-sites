
// Create an index file for the sites API to ensure proper imports

import { sitesCore } from './sitesCore';
import { sitesCreate } from './sitesCreate';
import { sitesUpdate } from './sitesUpdate';
import { getSiteContacts } from './siteContactsApi';
import { handleSiteAdditionalContracts, additionalContractsApi } from './additionalContractsApi';

// Re-export for compatibility
export { handleSiteAdditionalContracts, additionalContractsApi };

// Combine all site API modules into a single export
export const sitesApi = {
  // Core operations
  getSites: sitesCore.getSites,
  getSiteById: sitesCore.getSiteById,
  getSite: sitesCore.getSiteById, // Alias for backward compatibility
  deleteSite: sitesCore.deleteSite,
  
  // Create operations
  createSite: sitesCreate.createSite,
  
  // Update operations
  updateSite: sitesUpdate.updateSite,
  
  // Contacts operations
  getSiteContacts
};
