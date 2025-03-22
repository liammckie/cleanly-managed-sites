
import React from 'react';
import { useClients } from '@/hooks/useClients';
import { useSites } from '@/hooks/useSites';
import { ImportExportCard } from './ImportExportCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useQuery } from '@tanstack/react-query';
import { contractHistoryApi } from '@/lib/api/sites/contractHistoryApi';
import { ClientRecord, SiteRecord } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import { toast } from 'sonner';

export const ImportExportPage: React.FC = () => {
  const { clients, isLoading: isLoadingClients } = useClients();
  const { sites, isLoading: isLoadingSites } = useSites();
  
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
      // Fixed: Changed from has_subcontractors to check if subcontractors array exists
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
  
  if (isLoadingClients || isLoadingSites || isLoadingContracts) {
    return (
      <div className="flex justify-center items-center h-60">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Data Import & Export</h2>
        <p className="text-muted-foreground mb-6">
          Export your data for backup or import data from another system.
          Use the cards below to manage your data.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ImportExportCard
          type="clients"
          data={clients}
          onImport={handleImportClients}
          title="Clients"
          description="Export or import client records"
        />
        
        <ImportExportCard
          type="sites"
          data={sites}
          onImport={handleImportSites}
          title="Sites"
          description="Export or import site records"
        />
        
        <ImportExportCard
          type="contracts"
          data={contractHistory || []}
          onImport={handleImportContracts}
          title="Contracts"
          description="Export or import contract history"
        />
      </div>
    </div>
  );
};
