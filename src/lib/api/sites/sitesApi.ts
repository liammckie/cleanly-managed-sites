
import { sitesCore } from './sitesCore';
import { sitesCreate } from './sitesCreate';
import { sitesUpdate } from './sitesUpdate';
import { getSiteContacts } from './siteContactsApi';
import { toast } from 'sonner';

// Utility for standardized error handling
const withErrorHandling = async <T>(operation: () => Promise<T>, errorMessage: string): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    console.error(`${errorMessage}:`, error);
    toast.error(errorMessage);
    throw error;
  }
};

// Combine all site API modules into a single export with enhanced error handling
export const sitesApi = {
  // Core operations
  getSites: () => withErrorHandling(
    sitesCore.getSites, 
    'Error fetching sites'
  ),
  
  getSiteById: (id: string) => withErrorHandling(
    () => sitesCore.getSiteById(id), 
    `Error fetching site with ID ${id}`
  ),
  
  getSiteContacts: (siteId: string) => withErrorHandling(
    () => getSiteContacts(siteId), 
    `Error fetching contacts for site ${siteId}`
  ),
  
  deleteSite: (id: string) => withErrorHandling(
    () => sitesCore.deleteSite(id), 
    `Error deleting site with ID ${id}`
  ),
  
  // Create operations
  createSite: (siteData: any) => withErrorHandling(
    () => sitesCreate.createSite(siteData), 
    'Error creating site'
  ),
  
  // Update operations
  updateSite: (id: string, siteData: any) => withErrorHandling(
    () => sitesUpdate.updateSite(id, siteData), 
    `Error updating site with ID ${id}`
  )
};
