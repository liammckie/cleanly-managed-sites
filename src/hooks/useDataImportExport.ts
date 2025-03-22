
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ClientRecord, SiteRecord } from '@/lib/types';
import { contractHistoryApi } from '@/lib/api/sites/contractHistoryApi';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';

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
  
  const handleImportClients = async (importedClients: ClientRecord[]) => {
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
  
  const handleImportSites = async (importedSites: SiteRecord[]) => {
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
  
  const handleImportContracts = async (importedContracts: ContractHistoryEntry[]) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to import contracts');
    }
    
    // First, verify that site_ids exist
    const siteIds = [...new Set(importedContracts.map(contract => contract.site_id))];
    const { data: existingSites } = await supabase
      .from('sites')
      .select('id')
      .in('id', siteIds);
    
    if (!existingSites || existingSites.length !== siteIds.length) {
      throw new Error('Some site IDs in the imported contracts do not exist');
    }
    
    // Prepare contracts for import
    const preparedContracts = importedContracts.map(contract => ({
      site_id: contract.site_id,
      contract_details: contract.contract_details,
      notes: contract.notes || 'Imported contract',
      created_by: user.id,
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

  return {
    contractHistory,
    isLoadingContracts,
    handleImportClients,
    handleImportSites,
    handleImportContracts
  };
}
