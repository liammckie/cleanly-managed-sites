
import { ClientRecord, SiteRecord, ContractorRecord } from '@/lib/types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';

export async function parseCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          reject(new Error('Failed to read file'));
          return;
        }
        
        // Simple CSV parsing logic
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const data = lines.slice(1)
          .filter(line => line.trim().length > 0)
          .map(line => {
            const values = line.split(',').map(v => v.trim());
            const row: Record<string, string> = {};
            
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            
            return row;
          });
        
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

export function convertCSVToClientFormat(data: any[]): Partial<ClientRecord>[] {
  return data.map(row => ({
    name: row.name || row.client_name,
    contact_name: row.contact_name || row.contactName,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    state: row.state,
    postcode: row.postcode || row.postal_code,
    notes: row.notes
  }));
}

export function convertCSVToSiteFormat(data: any[]): Partial<SiteRecord>[] {
  return data.map(row => ({
    name: row.name || row.site_name,
    address: row.address,
    city: row.city,
    state: row.state,
    postcode: row.postcode || row.postal_code,
    client_id: row.client_id,
    client_name: row.client_name,
    status: row.status || 'active',
    representative: row.representative || row.rep_name,
    notes: row.notes
  }));
}

export function convertCSVToContractFormat(data: any[]): Partial<ContractHistoryEntry>[] {
  return data.map(row => ({
    site_id: row.site_id,
    contract_details: {
      contractNumber: row.contract_number,
      startDate: row.start_date,
      endDate: row.end_date,
      autoRenewal: row.auto_renewal === 'true',
      contractType: row.contract_type || 'fixed_term'
    },
    notes: row.notes
  }));
}

export function convertCSVToContractorFormat(data: any[]): Partial<ContractorRecord>[] {
  return data.map(row => ({
    business_name: row.business_name || row.company_name,
    contact_name: row.contact_name || row.contactName,
    email: row.email,
    phone: row.phone,
    address: row.address,
    status: row.status || 'active',
    contractor_type: row.contractor_type || row.type || 'general',
    notes: row.notes
  }));
}
