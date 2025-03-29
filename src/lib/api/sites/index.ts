
import { sitesCore } from './sitesCore';
import { sitesCreate as sitesCreateAPI } from './sitesCreate';
import { sitesUpdate } from './sitesUpdate';
import { getSiteContacts } from './siteContactsApi';
import { 
  fetchAdditionalContracts, 
  createAdditionalContract, 
  updateAdditionalContract, 
  deleteAdditionalContract 
} from './additionalContractsApi';
import { handleApiError, withErrorHandling } from '@/lib/utils/errorHandling';

// Re-export additional contracts functionality
export const additionalContractsApi = {
  fetchAdditionalContracts,
  createAdditionalContract,
  updateAdditionalContract,
  deleteAdditionalContract
};

// Helper function to handle site additional contracts
export const handleSiteAdditionalContracts = async (siteId: string, contracts: any[]) => {
  try {
    // Implementation would go here if needed
    console.log('Handling additional contracts for site:', siteId, contracts);
    return true;
  } catch (error) {
    handleApiError(error, 'Error handling additional contracts');
    return false;
  }
};

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
    (siteData: any) => sitesCreateAPI.createSite(siteData), 
    'Error creating site'
  ),
  
  // Update operations
  updateSite: withErrorHandling(
    (id: string, siteData: any) => sitesUpdate.updateSite(id, siteData), 
    'Error updating site'
  )
};
