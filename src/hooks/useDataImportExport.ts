
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ClientRecord, SiteRecord } from '@/lib/types';
import { contractHistoryApi } from '@/lib/api/sites/contractHistoryApi';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import Papa from 'papaparse';
import {
  getClientCSVTemplate,
  getSiteCSVTemplate,
  getContractCSVTemplate
} from '@/lib/importValidation';

// Type guards for validation
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

const importClients = async (importedClients: Partial<ClientRecord>[]) => {
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

const importSites = async (importedSites: Partial<SiteRecord>[]) => {
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

const importContracts = async (importedContracts: Partial<ContractHistoryEntry>[]) => {
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
) => {
  const preparedContracts = importedContracts.map(contract => ({
    site_id: contract.site_id as string,
    contract_details: contract.contract_details,
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
) => {
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

const parseCSV = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

const convertCSVToClientFormat = (csvData: any[]): Partial<ClientRecord>[] => {
  return csvData.map(row => ({
    name: row.name || '',
    contact_name: row.contact_name || '',
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || '',
    status: row.status || 'active',
    notes: row.notes || '',
    custom_id: row.custom_id || ''
  }));
};

const convertCSVToSiteFormat = (csvData: any[]): Partial<SiteRecord>[] => {
  return csvData.map(row => ({
    name: row.name || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || '',
    status: row.status || 'active',
    representative: row.representative || '',
    phone: row.phone || '',
    email: row.email || '',
    client_id: row.client_id || '',
    custom_id: row.custom_id || '',
    monthly_cost: row.monthly_cost ? parseFloat(row.monthly_cost) : undefined,
    monthly_revenue: row.monthly_revenue ? parseFloat(row.monthly_revenue) : undefined,
    security_details: {},
    job_specifications: {},
    periodicals: {},
    replenishables: {},
    contract_details: {},
    billing_details: {},
    subcontractors: []
  }));
};

const convertCSVToContractFormat = (csvData: any[]): Partial<ContractHistoryEntry>[] => {
  return csvData.map(row => ({
    site_id: row.site_id || '',
    version_number: 0,
    notes: row.notes || '',
    contract_details: {
      startDate: row.start_date || '',
      endDate: row.end_date || '',
      contractNumber: row.contract_number || '',
      renewalTerms: row.renewal_terms || '',
      terminationPeriod: row.termination_period || '',
      terms: []
    }
  }));
};

export function useDataImportExport() {
  const { data: contractHistory, isLoading: isLoadingContracts } = useQuery({
    queryKey: ['all-contracts-history'],
    queryFn: async () => {
      const { data: sites } = await supabase
        .from('sites')
        .select('id');
      
      if (!sites || sites.length === 0) return [];
      
      const contractHistoryPromises = sites.map(site => 
        contractHistoryApi.getContractHistory(site.id)
      );
      
      const contractResults = await Promise.all(contractHistoryPromises);
      return contractResults.flat();
    }
  });

  const handleImportClients = async (data: any[], fileType: 'json' | 'csv' = 'json') => {
    if (fileType === 'csv') {
      data = convertCSVToClientFormat(data);
    }
    
    const clientData = data as Partial<ClientRecord>[];
    await importClients(clientData);
  };

  const handleImportSites = async (data: any[], fileType: 'json' | 'csv' = 'json') => {
    if (fileType === 'csv') {
      data = convertCSVToSiteFormat(data);
    }
    
    const siteData = data as Partial<SiteRecord>[];
    await importSites(siteData);
  };

  const handleImportContracts = async (data: any[], fileType: 'json' | 'csv' = 'json') => {
    if (fileType === 'csv') {
      data = convertCSVToContractFormat(data);
    }
    
    const contractData = data as Partial<ContractHistoryEntry>[];
    await importContracts(contractData);
  };

  const handleCSVImport = async (file: File, type: 'clients' | 'sites' | 'contracts') => {
    try {
      const parsedData = await parseCSV(file);
      
      switch (type) {
        case 'clients':
          await handleImportClients(parsedData, 'csv');
          break;
        case 'sites':
          await handleImportSites(parsedData, 'csv');
          break;
        case 'contracts':
          await handleImportContracts(parsedData, 'csv');
          break;
      }
      
      return true;
    } catch (error) {
      console.error(`Error importing ${type} from CSV:`, error);
      throw error;
    }
  };

  return {
    contractHistory,
    isLoadingContracts,
    handleImportClients,
    handleImportSites,
    handleImportContracts,
    handleCSVImport,
    getClientCSVTemplate,
    getSiteCSVTemplate,
    getContractCSVTemplate
  };
}
