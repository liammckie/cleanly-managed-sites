
import { sitesCore } from './sitesCore';
import { sitesCreate } from './sitesCreate';
import { sitesUpdate } from './sitesUpdate';
import { getSiteContacts } from './siteContactsApi';

// Combine all site API modules into a single export
export const sitesApi = {
  // Core operations
  getSites: sitesCore.getSites,
  getSiteById: sitesCore.getSiteById,
  getSiteContacts,
  deleteSite: sitesCore.deleteSite,
  
  // Create operations
  createSite: sitesCreate.createSite,
  
  // Update operations
  updateSite: sitesUpdate.updateSite
};
