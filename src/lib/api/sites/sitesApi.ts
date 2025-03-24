
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
    
    // Create a more informative error message
    const detailedMessage = error.message || 'Unknown error occurred';
    const enhancedError = new Error(`${errorMessage}: ${detailedMessage}`);
    
    // Instead of using Error.cause (ES2022 feature), 
    // we'll add the status as a custom property using type assertion
    if (error.status) (enhancedError as any).status = error.status;
    if (error.code) (enhancedError as any).code = error.code;
    
    throw enhancedError;
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
