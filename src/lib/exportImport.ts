
import { saveAs } from 'file-saver';
import { ClientRecord, SiteRecord } from './types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import { fileToBase64 } from './fileUtils';
import Papa from 'papaparse';
import { supabase } from './supabase';

// Function to export data to JSON file
export const exportToJson = (data: any, fileName: string): void => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  saveAs(blob, fileName);
};

// Export to CSV file
export const exportToCSV = (data: any[], fileName: string): void => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${fileName}-${new Date().toISOString().slice(0, 10)}.csv`);
};

// Export clients to JSON file
export const exportClients = (clients: ClientRecord[]): void => {
  exportToJson(clients, `clients-export-${new Date().toISOString().slice(0, 10)}.json`);
};

// Export sites to JSON file
export const exportSites = (sites: SiteRecord[]): void => {
  exportToJson(sites, `sites-export-${new Date().toISOString().slice(0, 10)}.json`);
};

// Export contracts to JSON file
export const exportContracts = (contracts: ContractHistoryEntry[]): void => {
  exportToJson(contracts, `contracts-export-${new Date().toISOString().slice(0, 10)}.json`);
};

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

// Generate unique identifier for imported data
export const generateImportId = (item: any, type: 'clients' | 'sites' | 'contracts'): string => {
  switch (type) {
    case 'clients':
      // Try to identify client by custom_id first, then by name + contact
      return item.custom_id || `${item.name}-${item.contact_name}`;
    case 'sites':
      // Try to identify site by custom_id first, then by name + client_id
      return item.custom_id || `${item.name}-${item.client_id}`;
    case 'contracts':
      // Identify contract by site_id + contract number or start date
      return `${item.site_id}-${item.contract_details?.contractNumber || item.contract_details?.startDate}`;
    default:
      return '';
  }
};

// Check if an item already exists in the database based on identifying fields
export const checkExistingItems = async (
  items: any[], 
  type: 'clients' | 'sites' | 'contracts'
): Promise<{ existing: any[], new: any[] }> => {
  const result = { existing: [], new: [] };
  
  if (items.length === 0) return result;
  
  switch (type) {
    case 'clients': {
      // Get all custom_ids first
      const customIds = items
        .filter(item => item.custom_id)
        .map(item => item.custom_id);
      
      // Query clients with matching custom_ids
      if (customIds.length > 0) {
        const { data: existingByCustomId } = await supabase
          .from('clients')
          .select('id, custom_id, name, contact_name')
          .in('custom_id', customIds);
        
        if (existingByCustomId && existingByCustomId.length > 0) {
          const existingCustomIds = existingByCustomId.map(item => item.custom_id);
          
          // Add existing clients to the result
          existingByCustomId.forEach(existing => {
            const matchingItem = items.find(item => item.custom_id === existing.custom_id);
            if (matchingItem) {
              result.existing.push({
                ...matchingItem,
                id: existing.id,
                _isExisting: true
              });
            }
          });
          
          // Add remaining items that don't have a matching custom_id
          items
            .filter(item => !existingCustomIds.includes(item.custom_id))
            .forEach(item => result.new.push(item));
        } else {
          // If no matching custom_ids, all items are new
          items.forEach(item => result.new.push(item));
        }
      } else {
        // If no custom_ids, all items are new
        items.forEach(item => result.new.push(item));
      }
      break;
    }
    
    case 'sites': {
      // Similar logic for sites
      const customIds = items
        .filter(item => item.custom_id)
        .map(item => item.custom_id);
      
      if (customIds.length > 0) {
        const { data: existingByCustomId } = await supabase
          .from('sites')
          .select('id, custom_id, name, client_id')
          .in('custom_id', customIds);
        
        if (existingByCustomId && existingByCustomId.length > 0) {
          const existingCustomIds = existingByCustomId.map(item => item.custom_id);
          
          // Add existing sites to the result
          existingByCustomId.forEach(existing => {
            const matchingItem = items.find(item => item.custom_id === existing.custom_id);
            if (matchingItem) {
              result.existing.push({
                ...matchingItem,
                id: existing.id,
                _isExisting: true
              });
            }
          });
          
          // Add remaining items that don't have a matching custom_id
          items
            .filter(item => !existingCustomIds.includes(item.custom_id))
            .forEach(item => result.new.push(item));
        } else {
          // If no matching custom_ids, all items are new
          items.forEach(item => result.new.push(item));
        }
      } else {
        // If no custom_ids, all items are new
        items.forEach(item => result.new.push(item));
      }
      break;
    }
    
    case 'contracts': {
      // For contracts, we need to check site_id and contract details
      const siteIds = [...new Set(items.map(item => item.site_id))];
      
      if (siteIds.length > 0) {
        const { data: existingContracts } = await supabase
          .from('site_contract_history')
          .select('id, site_id, contract_details')
          .in('site_id', siteIds);
        
        if (existingContracts && existingContracts.length > 0) {
          // Check for matching contracts by site_id and contract number
          items.forEach(item => {
            const matchingContract = existingContracts.find(existing => 
              existing.site_id === item.site_id && 
              existing.contract_details.contractNumber === item.contract_details?.contractNumber
            );
            
            if (matchingContract) {
              result.existing.push({
                ...item,
                id: matchingContract.id,
                _isExisting: true
              });
            } else {
              result.new.push(item);
            }
          });
        } else {
          // If no matching contracts, all items are new
          items.forEach(item => result.new.push(item));
        }
      } else {
        // If no site_ids, all items are new
        items.forEach(item => result.new.push(item));
      }
      break;
    }
    
    default:
      items.forEach(item => result.new.push(item));
  }
  
  return result;
};

// Merge imported data with existing data
export const mergeImportData = (
  importedData: any[], 
  existingItems: any[]
): any[] => {
  // Create a map of existing items by ID for quick lookup
  const existingMap = new Map(existingItems.map(item => [item.id, item]));
  
  // Process imported data to update existing items or add new ones
  return importedData.map(importedItem => {
    // If the imported item has an ID and it exists in our map
    if (importedItem.id && existingMap.has(importedItem.id)) {
      const existingItem = existingMap.get(importedItem.id);
      // Merge the imported item with the existing one
      return {
        ...existingItem,
        ...importedItem,
        _isExisting: true // Flag to indicate this is an update, not an insert
      };
    }
    // Return the imported item as is (for new items)
    return importedItem;
  });
};

// Function to generate test data for validation purposes
export const generateTestData = () => {
  // Sample client data
  const testClients = [
    {
      name: "ACME Corporation",
      contact_name: "John Doe",
      email: "john@acme.com",
      phone: "123-456-7890",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      postcode: "10001",
      status: "active",
      notes: "Test client for import validation",
      custom_id: "TEST-CL001"
    },
    {
      name: "XYZ Enterprises",
      contact_name: "Jane Smith",
      email: "jane@xyz.com",
      phone: "987-654-3210",
      address: "456 Business Ave",
      city: "Chicago",
      state: "IL",
      postcode: "60601",
      status: "pending",
      notes: "Test client with pending status",
      custom_id: "TEST-CL002"
    }
  ];
  
  // Sample site data (requires valid client_id)
  const testSites = [
    {
      name: "ACME Headquarters",
      address: "123 Main St, Suite 100",
      city: "New York",
      state: "NY",
      postcode: "10001",
      status: "active",
      representative: "John Doe",
      phone: "123-456-7890",
      email: "site@acme.com",
      client_id: "[CLIENT_ID_1]", // To be replaced with actual client ID
      custom_id: "TEST-ST001",
      monthly_cost: 1000,
      monthly_revenue: 1500
    },
    {
      name: "XYZ Office",
      address: "456 Business Ave, Floor 2",
      city: "Chicago",
      state: "IL",
      postcode: "60601",
      status: "active",
      representative: "Jane Smith",
      phone: "987-654-3210",
      email: "site@xyz.com",
      client_id: "[CLIENT_ID_2]", // To be replaced with actual client ID
      custom_id: "TEST-ST002",
      monthly_cost: 800,
      monthly_revenue: 1200
    }
  ];
  
  // Sample contract data (requires valid site_id)
  const testContracts = [
    {
      site_id: "[SITE_ID_1]", // To be replaced with actual site ID
      contract_details: {
        startDate: "2023-01-01",
        endDate: "2024-01-01",
        contractNumber: "TEST-CNT-001",
        renewalTerms: "30 days automatic renewal",
        terminationPeriod: "60 days written notice",
        terms: []
      },
      notes: "Test contract for import validation",
      version_number: 1
    },
    {
      site_id: "[SITE_ID_2]", // To be replaced with actual site ID
      contract_details: {
        startDate: "2023-06-15",
        endDate: "2024-06-14",
        contractNumber: "TEST-CNT-002",
        renewalTerms: "60 days review period",
        terminationPeriod: "90 days written notice",
        terms: []
      },
      notes: "Test contract with different terms",
      version_number: 1
    }
  ];
  
  return {
    clients: testClients,
    sites: testSites,
    contracts: testContracts
  };
};

// Generate a single unified import template
export const generateUnifiedImportTemplate = (): string => {
  const headers = [
    'record_type', // Type of record: client, site, or contract
    'action', // Action to take: create, update, or delete
    'id', // Database ID (blank for new records)
    'custom_id', // Custom identifier
    
    // Client fields
    'client_name',
    'client_contact_name',
    'client_email',
    'client_phone',
    'client_address',
    'client_city',
    'client_state',
    'client_postcode',
    'client_status',
    'client_notes',
    
    // Site fields
    'site_name',
    'site_address',
    'site_city',
    'site_state',
    'site_postcode',
    'site_status',
    'site_representative',
    'site_phone',
    'site_email',
    'site_client_id', // Can be database ID or custom_id (prefixed with "custom:")
    'site_monthly_cost',
    'site_monthly_revenue',
    
    // Contract fields
    'contract_site_id', // Can be database ID or custom_id (prefixed with "custom:")
    'contract_start_date',
    'contract_end_date',
    'contract_number',
    'contract_renewal_terms',
    'contract_termination_period',
    'contract_notes'
  ];
  
  // Sample data for clients
  const clientSample = [
    'client', 'create', '', 'CL001', // Record type, action, id, custom_id
    'ACME Corporation', 'John Doe', 'john@acme.com', '123-456-7890',
    '123 Main St', 'New York', 'NY', '10001', 'active', 'New client',
    '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', ''
  ];
  
  // Sample data for sites
  const siteSample = [
    'site', 'create', '', 'ST001',
    '', '', '', '', '', '', '', '', '', '',
    'Main Office', '456 Business Ave', 'Chicago', 'IL', '60601', 'active',
    'Jane Smith', '987-654-3210', 'jane@acme.com', 'custom:CL001', '1000', '1500',
    '', '', '', '', '', '', ''
  ];
  
  // Sample data for contracts
  const contractSample = [
    'contract', 'create', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '',
    'custom:ST001', '2023-01-01', '2024-01-01', 'CNT-001', '30 days automatic renewal', '60 days written notice', 'Standard service contract'
  ];
  
  // Combine the samples
  const samples = [clientSample, siteSample, contractSample];
  
  return Papa.unparse(samples, { header: true, columns: headers });
};
