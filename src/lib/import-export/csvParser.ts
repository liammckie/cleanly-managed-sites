
import Papa from 'papaparse';
import { ClientRecord, SiteRecord } from '../types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import { ContractorRecord, ParsedImportData } from './types';

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

// Convert CSV data to contractor format
export const convertCSVToContractorFormat = (csvData: any[]): Partial<ContractorRecord>[] => {
  return csvData.map(row => ({
    business_name: row.business_name || '',
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
    services: row.services ? (
      typeof row.services === 'string' 
        ? row.services.split(',').map((s: string) => s.trim())
        : row.services
    ) : undefined
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
  const contractors: any[] = [];
  
  console.log('Parsing unified import with', csvData.length, 'rows');

  csvData.forEach((row, index) => {
    if (!row.record_type) {
      console.warn(`Row ${index + 1} missing record_type, skipping`);
      return;
    }

    switch (row.record_type.toLowerCase()) {
      case 'client': {
        // For client records, map fields directly
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
          id: row.id || undefined,
          action: row.action || 'create'
        };
        
        if (client.name && client.contact_name) {
          clients.push(client);
          console.log(`Added client: ${client.name}`);
        } else {
          console.warn(`Row ${index + 1}: Client missing required fields (name, contact_name), skipping`);
        }
        break;
      }
      
      case 'site': {
        // For site records, map prefixed fields to the correct properties
        const site = {
          // If site_name exists, use it, otherwise fall back to name
          name: row.site_name || row.name || '',
          address: row.site_address || row.address || '',
          city: row.site_city || row.city || '',
          state: row.site_state || row.state || '',
          postcode: row.site_postcode || row.postcode || '',
          status: row.site_status || row.status || 'active',
          representative: row.representative || '',
          phone: row.site_phone || row.phone || '',
          email: row.site_email || row.email || '',
          client_id: row.client_id || '',
          custom_id: row.custom_id || '',
          monthly_cost: row.monthly_cost ? parseFloat(row.monthly_cost) : undefined,
          monthly_revenue: row.monthly_revenue ? parseFloat(row.monthly_revenue) : undefined,
          id: row.id || undefined,
          action: row.action || 'create'
        };
        
        if (site.name && site.address && site.client_id) {
          sites.push(site);
          console.log(`Added site: ${site.name}`);
        } else {
          console.warn(`Row ${index + 1}: Site missing required fields (name, address, client_id), skipping`);
        }
        break;
      }
      
      case 'contract': {
        // For contract records, extract contract-specific fields
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
          id: row.id || undefined,
          action: row.action || 'create'
        };
        
        if (contract.site_id) {
          contracts.push(contract);
          console.log(`Added contract for site: ${contract.site_id}`);
        } else {
          console.warn(`Row ${index + 1}: Contract missing required field (site_id), skipping`);
        }
        break;
      }
      
      case 'contractor': {
        // For contractor records, map fields directly
        const contractor = {
          business_name: row.business_name || '',
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
          services: row.services ? (
            typeof row.services === 'string' 
              ? row.services.split(',').map((s: string) => s.trim())
              : row.services
          ) : undefined,
          id: row.id || undefined,
          action: row.action || 'create'
        };
        
        if (contractor.business_name && contractor.contact_name) {
          contractors.push(contractor);
          console.log(`Added contractor: ${contractor.business_name}`);
        } else {
          console.warn(`Row ${index + 1}: Contractor missing required fields (business_name, contact_name), skipping`);
        }
        break;
      }
      
      default:
        console.warn(`Row ${index + 1}: Unknown record_type: ${row.record_type}, skipping`);
    }
  });

  console.log(`Parsed: ${clients.length} clients, ${sites.length} sites, ${contracts.length} contracts, ${contractors.length} contractors`);
  return { clients, sites, contracts, contractors };
};
