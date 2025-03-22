
import Papa from 'papaparse';
import { ClientRecord, SiteRecord } from '../types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import { ParsedImportData } from './types';

// Parse CSV file to data array
export const parseCSV = async (file: File): Promise<any[]> => {
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

// Convert CSV data to client format
export const convertCSVToClientFormat = (csvData: any[]): Partial<ClientRecord>[] => {
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

// Convert CSV data to site format
export const convertCSVToSiteFormat = (csvData: any[]): Partial<SiteRecord>[] => {
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

// Convert CSV data to contract format
export const convertCSVToContractFormat = (csvData: any[]): Partial<ContractHistoryEntry>[] => {
  return csvData.map(row => ({
    site_id: row.site_id || '',
    version_number: Number(row.version_number) || 0,
    notes: row.contract_notes || '',
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

// Parse unified import CSV data
export const parseUnifiedImport = async (
  csvData: any[], 
  options: { mode: 'full' | 'incremental' } = { mode: 'incremental' }
): Promise<ParsedImportData> => {
  const clients: any[] = [];
  const sites: any[] = [];
  const contracts: any[] = [];

  csvData.forEach(row => {
    if (!row.record_type) return;

    switch (row.record_type.toLowerCase()) {
      case 'client': {
        const client = {
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
          representative: row.representative || '',
          phone: row.site_phone || '',
          email: row.site_email || '',
          client_id: row.client_id || '',
          custom_id: row.custom_id || '',
          monthly_cost: row.monthly_cost ? parseFloat(row.monthly_cost) : undefined,
          monthly_revenue: row.monthly_revenue ? parseFloat(row.monthly_revenue) : undefined,
          id: row.id || undefined
        };
        
        if (site.name && site.address && site.client_id) {
          sites.push(site);
        }
        break;
      }
      
      case 'contract': {
        const contract = {
          site_id: row.site_id || '',
          notes: row.contract_notes || '',
          version_number: Number(row.version_number) || 0,
          contract_details: {
            startDate: row.start_date || '',
            endDate: row.end_date || '',
            contractNumber: row.contract_number || '',
            renewalTerms: row.renewal_terms || '',
            terminationPeriod: row.termination_period || '',
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

