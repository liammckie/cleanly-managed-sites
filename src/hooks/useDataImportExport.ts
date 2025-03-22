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
import { checkExistingItems, generateTestData } from '@/lib/exportImport';

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
      'site_id' in contract
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

const parseUnifiedImport = async (
  csvData: any[], 
  options: { mode: 'full' | 'incremental' } = { mode: 'incremental' }
): Promise<{ clients: any[], sites: any[], contracts: any[] }> => {
  const clients: any[] = [];
  const sites: any[] = [];
  const contracts: any[] = [];

  csvData.forEach(row => {
    if (!row.record_type) return;

    switch (row.record_type.toLowerCase()) {
      case 'client': {
        const client = {
          name: row.client_name || '',
          contact_name: row.client_contact_name || '',
          email: row.client_email || '',
          phone: row.client_phone || '',
          address: row.client_address || '',
          city: row.client_city || '',
          state: row.client_state || '',
          postcode: row.client_postcode || '',
          status: row.client_status || 'active',
          notes: row.client_notes || '',
          custom_id: row.custom_id || '',
          id: row.id || undefined
        };
        
        if (client.name && client.contact_name) {
          clients.push(client);
        }
        break;
      }
      
      case 'site': {
        const site = {
          name: row.site_name || '',
          address: row.site_address || '',
          city: row.site_city || '',
          state: row.site_state || '',
          postcode: row.site_postcode || '',
          status: row.site_status || 'active',
          representative: row.site_representative || '',
          phone: row.site_phone || '',
          email: row.site_email || '',
          client_id: row.site_client_id || '',
          custom_id: row.custom_id || '',
          monthly_cost: row.site_monthly_cost ? parseFloat(row.site_monthly_cost) : undefined,
          monthly_revenue: row.site_monthly_revenue ? parseFloat(row.site_monthly_revenue) : undefined,
          id: row.id || undefined
        };
        
        if (site.name && site.address && site.client_id) {
          sites.push(site);
        }
        break;
      }
      
      case 'contract': {
        const contract = {
          site_id: row.contract_site_id || '',
          notes: row.contract_notes || '',
          version_number: 0,
          contract_details: {
            startDate: row.contract_start_date || '',
            endDate: row.contract_end_date || '',
            contractNumber: row.contract_number || '',
            renewalTerms: row.contract_renewal_terms || '',
            terminationPeriod: row.contract_termination_period || '',
            terms: []
          },
          id: row.id || undefined
        };
        
        if (contract.site_id) {
          contracts.push(contract);
        }
        break;
      }
    }
  });

  return { clients, sites, contracts };
};

const handleUnifiedImport = async (file: File, options: { mode: 'full' | 'incremental' }): Promise<void> => {
  try {
    const csvData = await parseCSV(file);
    
    const { clients, sites, contracts } = await parseUnifiedImport(csvData, options);
    
    console.log(`Parsed unified import: ${clients.length} clients, ${sites.length} sites, ${contracts.length} contracts`);
    
    if (clients.length > 0) {
      await importClients(clients);
      toast.success(`${clients.length} clients imported successfully`);
    }
    
    if (sites.length > 0) {
      await importSites(sites);
      toast.success(`${sites.length} sites imported successfully`);
    }
    
    if (contracts.length > 0) {
      await importContracts(contracts);
      toast.success(`${contracts.length} contracts imported successfully`);
    }
    
  } catch (error) {
    console.error('Error during unified import:', error);
    throw error;
  }
};

const setupTestData = async (): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('You must be logged in to set up test data');
    }
    
    const testData = generateTestData();
    
    const { data: clients } = await supabase
      .from('clients')
      .insert(testData.clients.map(client => ({
        ...client,
        user_id: user.id
      })))
      .select();
    
    if (!clients || clients.length === 0) {
      throw new Error('Failed to create test clients');
    }
    
    const sitesWithClientIds = testData.sites.map((site, index) => ({
      ...site,
      client_id: clients[Math.min(index, clients.length - 1)].id,
      user_id: user.id
    }));
    
    const { data: sites } = await supabase
      .from('sites')
      .insert(sitesWithClientIds)
      .select();
    
    if (!sites || sites.length === 0) {
      throw new Error('Failed to create test sites');
    }
    
    const contractsWithSiteIds = testData.contracts.map((contract, index) => ({
      ...contract,
      site_id: sites[Math.min(index, sites.length - 1)].id,
      created_by: user.id
    }));
    
    for (const contract of contractsWithSiteIds) {
      await supabase
        .from('site_contract_history')
        .insert(contract);
      
      await supabase
        .from('sites')
        .update({ contract_details: contract.contract_details })
        .eq('id', contract.site_id);
    }
    
    toast.success('Test data set up successfully!');
  } catch (error: any) {
    console.error('Error setting up test data:', error);
    toast.error(`Failed to set up test data: ${error.message}`);
  }
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

  const handleCSVImport = async (file: File, type: 'clients' | 'sites' | 'contracts'): Promise<void> => {
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
    handleUnifiedImport,
    setupTestData,
    getClientCSVTemplate,
    getSiteCSVTemplate,
    getContractCSVTemplate
  };
}
