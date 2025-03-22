
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ClientRecord, SiteRecord } from '@/lib/types';
import { contractHistoryApi } from '@/lib/api/sites/contractHistoryApi';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';

// Separate data validation functions
const validateClientData = (importedClients: any[]): importedClients is ClientRecord[] => {
  return Array.isArray(importedClients) && 
    importedClients.every(client => 
      typeof client === 'object' && 
      client !== null &&
      'name' in client &&
      'contact_name' in client
    );
};

const validateSiteData = (importedSites: any[]): importedSites is SiteRecord[] => {
  return Array.isArray(importedSites) && 
    importedSites.every(site => 
      typeof site === 'object' && 
      site !== null &&
      'name' in site &&
      'address' in site
    );
};

const validateContractData = (importedContracts: any[]): importedContracts is ContractHistoryEntry[] => {
  return Array.isArray(importedContracts) && 
    importedContracts.every(contract => 
      typeof contract === 'object' && 
      contract !== null &&
      'site_id' in contract &&
      'contract_details' in contract
    );
};

// Extract client import logic
const importClients = async (importedClients: ClientRecord[]) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('You must be logged in to import clients');
  }
  
  // Prepare clients for import by adding user_id and removing id
  const preparedClients = importedClients.map(client => ({
    name: client.name,
    contact_name: client.contact_name,
    email: client.email,
    phone: client.phone,
    address: client.address,
    city: client.city,
    state: client.state,
    postcode: client.postcode,
    status: client.status,
    notes: client.notes,
    custom_id: client.custom_id,
    user_id: user.id
  }));
  
  // Insert clients
  const { error } = await supabase
    .from('clients')
    .insert(preparedClients);
  
  if (error) {
    console.error('Error importing clients:', error);
    throw new Error('Failed to import clients: ' + error.message);
  }
};

// Extract site import logic
const importSites = async (importedSites: SiteRecord[]) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('You must be logged in to import sites');
  }
  
  // Prepare sites for import by adding user_id and removing id
  const preparedSites = importedSites.map(site => ({
    name: site.name,
    address: site.address,
    city: site.city,
    state: site.state,
    postcode: site.postcode,
    status: site.status,
    representative: site.representative,
    phone: site.phone,
    email: site.email,
    client_id: site.client_id,
    monthly_cost: site.monthly_cost,
    monthly_revenue: site.monthly_revenue,
    custom_id: site.custom_id,
    security_details: site.security_details,
    job_specifications: site.job_specifications,
    periodicals: site.periodicals,
    replenishables: site.replenishables,
    contract_details: site.contract_details,
    billing_details: site.billing_details,
    has_subcontractors: site.subcontractors ? true : false,
    user_id: user.id
  }));
  
  // Insert sites
  const { error } = await supabase
    .from('sites')
    .insert(preparedSites);
  
  if (error) {
    console.error('Error importing sites:', error);
    throw new Error('Failed to import sites: ' + error.message);
  }
};

// Extract contract import logic
const importContracts = async (importedContracts: ContractHistoryEntry[]) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('You must be logged in to import contracts');
  }
  
  // Verify that site_ids exist
  const siteIds = [...new Set(importedContracts.map(contract => contract.site_id))];
  const { data: existingSites } = await supabase
    .from('sites')
    .select('id')
    .in('id', siteIds);
  
  if (!existingSites || existingSites.length !== siteIds.length) {
    throw new Error('Some site IDs in the imported contracts do not exist');
  }
  
  // Insert contracts and update site details
  await insertContractsAndUpdateSites(importedContracts, user.id, siteIds);
};

// Further break down the contract import process
const insertContractsAndUpdateSites = async (
  importedContracts: ContractHistoryEntry[], 
  userId: string,
  siteIds: string[]
) => {
  // Prepare contracts for import
  const preparedContracts = importedContracts.map(contract => ({
    site_id: contract.site_id,
    contract_details: contract.contract_details,
    notes: contract.notes || 'Imported contract',
    created_by: userId,
    // Add version_number field with a placeholder value of 0
    // The database trigger will override this with the correct value
    version_number: 0
  }));
  
  // Insert contracts
  for (const contract of preparedContracts) {
    const { error } = await supabase
      .from('site_contract_history')
      .insert(contract);
    
    if (error) {
      console.error('Error importing contract:', error);
      throw new Error('Failed to import contracts: ' + error.message);
    }
  }
  
  // Update the contract_details for each site
  await updateSiteContractDetails(importedContracts, siteIds);
};

// Extract site contract details update logic
const updateSiteContractDetails = async (
  importedContracts: ContractHistoryEntry[], 
  siteIds: string[]
) => {
  for (const siteId of siteIds) {
    // Get the most recent contract for this site
    const latestContract = importedContracts
      .filter(c => c.site_id === siteId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    
    if (latestContract) {
      const { error } = await supabase
        .from('sites')
        .update({ contract_details: latestContract.contract_details })
        .eq('id', siteId);
      
      if (error) {
        console.error('Error updating site contract details:', error);
        toast.error(`Failed to update contract details for site: ${error.message}`);
      }
    }
  }
};

// Main hook that composes all these functions
export function useDataImportExport() {
  // Fetch all contract history entries
  const { data: contractHistory, isLoading: isLoadingContracts } = useQuery({
    queryKey: ['all-contracts-history'],
    queryFn: async () => {
      // Get all sites first
      const { data: sites } = await supabase
        .from('sites')
        .select('id');
      
      if (!sites || sites.length === 0) return [];
      
      // Get contract history for all sites
      const contractHistoryPromises = sites.map(site => 
        contractHistoryApi.getContractHistory(site.id)
      );
      
      const contractResults = await Promise.all(contractHistoryPromises);
      return contractResults.flat();
    }
  });
  
  // Wrapper functions that validate data before importing
  const handleImportClients = async (data: any[]) => {
    if (!validateClientData(data)) {
      throw new Error('Invalid client data format');
    }
    await importClients(data);
  };
  
  const handleImportSites = async (data: any[]) => {
    if (!validateSiteData(data)) {
      throw new Error('Invalid site data format');
    }
    await importSites(data);
  };
  
  const handleImportContracts = async (data: any[]) => {
    if (!validateContractData(data)) {
      throw new Error('Invalid contract data format');
    }
    await importContracts(data);
  };

  return {
    contractHistory,
    isLoadingContracts,
    handleImportClients,
    handleImportSites,
    handleImportContracts
  };
}
