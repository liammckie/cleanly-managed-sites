import Papa from 'papaparse';
import { ClientRecord, SiteRecord } from '@/lib/types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import { DataType } from './types';
import { toast } from 'sonner';

export async function parseCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.error('CSV parsing errors:', results.errors);
          reject(new Error(`Error parsing CSV: ${results.errors[0].message}`));
        } else {
          resolve(results.data);
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        reject(error);
      }
    });
  });
}

export function parseCSVForType(
  file: File, 
  type: DataType
): Promise<ClientRecord[] | SiteRecord[] | ContractHistoryEntry[] | any[]> {
  return parseCSV(file)
    .then(data => {
      switch (type) {
        case 'clients':
          return transformToClients(data);
        case 'sites':
          return transformToSites(data);
        case 'contracts':
          return transformToContracts(data);
        case 'unified':
          return data; // No transformation needed for unified import
        default:
          throw new Error(`Unknown data type: ${type}`);
      }
    })
    .catch(error => {
      toast.error(`Error parsing CSV: ${error.message}`);
      throw error;
    });
}

function transformToClients(data: any[]): ClientRecord[] {
  return data.map(row => {
    // Basic client record transformation
    return {
      id: row.id,
      name: row.name || '',
      email: row.email || '',
      phone: row.phone || '',
      address: row.address || '',
      city: row.city || '',
      state: row.state || '',
      postcode: row.postcode || '',
      notes: row.notes || '',
      contact_name: row.contact_name || '',
      status: row.status || 'active',
      custom_id: row.custom_id || '',
      created_at: row.created_at || new Date().toISOString(),
      updated_at: row.updated_at || new Date().toISOString(),
      user_id: row.user_id || '',
      xero_contact_id: row.xero_contact_id || ''
    } as ClientRecord;
  });
}

function transformToSites(data: any[]): SiteRecord[] {
  return data.map(row => {
    // Basic site record transformation
    return {
      id: row.id,
      name: row.name || '',
      address: row.address || '',
      city: row.city || '',
      state: row.state || '',
      postcode: row.postcode || '',
      email: row.email || '',
      phone: row.phone || '',
      client_id: row.client_id || '',
      status: row.status || 'active',
      // ... other fields
    } as unknown as SiteRecord;
  });
}

function transformToContracts(data: any[]): ContractHistoryEntry[] {
  return data.map(row => {
    return {
      id: row.id || '',
      site_id: row.site_id || '',
      contract_details: typeof row.contract_details === 'string' 
        ? JSON.parse(row.contract_details) 
        : row.contract_details || {},
      notes: row.notes || '',
      created_by: row.created_by || '',
      created_at: row.created_at || new Date().toISOString(),
      version_number: Number(row.version_number) || 0
    } as ContractHistoryEntry;
  });
}
