
import { supabase } from '../supabase';
import { ClientRecord, SiteRecord } from '../types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import { toast } from 'sonner';

// Parse imported JSON file
export const parseImportedFile = async (file: File): Promise<any> => {
  try {
    const fileContent = await file.text();
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error parsing imported file:', error);
    throw new Error('Invalid file format. Please upload a valid JSON file.');
  }
};

// Client import function
export const importClients = async (importedClients: Partial<ClientRecord>[]): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('You must be logged in to import clients');
  }
  
  const preparedClients = importedClients.map(client => ({
    name: client.name || '',
    contact_name: client.contact_name || '',
    email: client.email,
    phone: client.phone,
    address: client.address,
    city: client.city,
    state: client.state,
    postcode: client.postcode,
    status: client.status || 'active',
    notes: client.notes,
    custom_id: client.custom_id,
    user_id: user.id
  }));
  
  const { error } = await supabase
    .from('clients')
    .insert(preparedClients);
  
  if (error) {
    console.error('Error importing clients:', error);
    throw new Error('Failed to import clients: ' + error.message);
  }
};

// Site import function
export const importSites = async (importedSites: Partial<SiteRecord>[]): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('You must be logged in to import sites');
  }
  
  const preparedSites = importedSites.map(site => ({
    name: site.name || '',
    address: site.address || '',
    city: site.city || '',
    state: site.state || '',
    postcode: site.postcode || '',
    status: site.status || 'active',
    representative: site.representative || '',
    phone: site.phone,
    email: site.email,
    client_id: site.client_id || '',
    monthly_cost: site.monthly_cost,
    monthly_revenue: site.monthly_revenue,
    custom_id: site.custom_id,
    security_details: site.security_details || {},
    job_specifications: site.job_specifications || {},
    periodicals: site.periodicals || {},
    replenishables: site.replenishables || {},
    contract_details: site.contract_details || {},
    billing_details: site.billing_details || {},
    has_subcontractors: site.subcontractors ? true : false,
    user_id: user.id
  }));
  
  const { error } = await supabase
    .from('sites')
    .insert(preparedSites);
  
  if (error) {
    console.error('Error importing sites:', error);
    throw new Error('Failed to import sites: ' + error.message);
  }
};

// Contract import function
export const importContracts = async (importedContracts: Partial<ContractHistoryEntry>[]): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('You must be logged in to import contracts');
  }
  
  const siteIds = [...new Set(importedContracts.map(contract => contract.site_id))].filter(id => id) as string[];
  
  if (siteIds.length === 0) {
    throw new Error('No valid site IDs found in the contracts');
  }
  
  const { data: existingSites } = await supabase
    .from('sites')
    .select('id')
    .in('id', siteIds);
  
  if (!existingSites || existingSites.length !== siteIds.length) {
    throw new Error('Some site IDs in the imported contracts do not exist');
  }
  
  await insertContractsAndUpdateSites(importedContracts, user.id, siteIds);
};

const insertContractsAndUpdateSites = async (
  importedContracts: Partial<ContractHistoryEntry>[], 
  userId: string,
  siteIds: string[]
): Promise<void> => {
  const preparedContracts = importedContracts.map(contract => ({
    site_id: contract.site_id as string,
    contract_details: contract.contract_details || {},
    notes: contract.notes || 'Imported contract',
    created_by: userId,
    version_number: 0
  }));
  
  for (const contract of preparedContracts) {
    const { error } = await supabase
      .from('site_contract_history')
      .insert(contract);
    
    if (error) {
      console.error('Error importing contract:', error);
      throw new Error('Failed to import contracts: ' + error.message);
    }
  }
  
  await updateSiteContractDetails(importedContracts, siteIds);
};

const updateSiteContractDetails = async (
  importedContracts: Partial<ContractHistoryEntry>[], 
  siteIds: string[]
): Promise<void> => {
  for (const siteId of siteIds) {
    const siteContracts = importedContracts.filter(c => c.site_id === siteId);
    
    if (siteContracts.length > 0) {
      const latestContract = siteContracts
        .filter(c => c.created_at)
        .sort((a, b) => {
          if (!a.created_at || !b.created_at) return 0;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        })[0] || siteContracts[0];
      
      if (latestContract && latestContract.contract_details) {
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
  }
};
