
import { sitesCore } from './sitesCore';
import { sitesCreate } from './sitesCreate';
import { sitesUpdate } from './sitesUpdate';
import { getSiteContacts } from './siteContactsApi';
import { toast } from 'sonner';
import { handleApiError, withErrorHandling } from '@/lib/utils/errorHandling';

// Combine all site API modules into a single export with enhanced error handling
export const sitesApi = {
  // Core operations
  getSites: withErrorHandling(
    sitesCore.getSites, 
    'Error fetching sites'
  ),
  
  getSiteById: withErrorHandling(
    (id: string) => sitesCore.getSiteById(id), 
    'Error fetching site details'
  ),
  
  getSiteContacts: withErrorHandling(
    (siteId: string) => getSiteContacts(siteId), 
    'Error fetching site contacts'
  ),
  
  deleteSite: withErrorHandling(
    (id: string) => sitesCore.deleteSite(id), 
    'Error deleting site'
  ),
  
  // Create operations
  createSite: withErrorHandling(
    (siteData: any) => sitesCreate.createSite(siteData), 
    'Error creating site'
  ),
  
  // Update operations
  updateSite: withErrorHandling(
    (id: string, siteData: any) => sitesUpdate.updateSite(id, siteData), 
    'Error updating site'
  )
};
