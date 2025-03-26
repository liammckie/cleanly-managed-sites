
import Papa from 'papaparse';
import { DataType } from './types';

export function generateCSV(data: any[], type: DataType): string {
  // Handle special processing for certain data types
  let processedData = data;
  
  // For contracts, we need to stringify the contract_details field
  if (type === 'contracts') {
    processedData = data.map(item => ({
      ...item,
      contract_details: typeof item.contract_details === 'object'
        ? JSON.stringify(item.contract_details)
        : item.contract_details
    }));
  }
  
  return Papa.unparse(processedData);
}

export function generateTemplateCSV(type: DataType): string {
  let headers: string[] = [];
  let examples: Record<string, string>[] = [];
  
  switch (type) {
    case 'clients':
      headers = ['name', 'email', 'phone', 'address', 'city', 'state', 'postcode', 'status', 'notes'];
      examples = [{
        name: 'Example Company',
        email: 'contact@example.com',
        phone: '555-1234',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        postcode: '10001',
        status: 'active',
        notes: 'Example client'
      }];
      break;
      
    case 'sites':
      headers = ['name', 'client_id', 'address', 'city', 'state', 'postcode', 'status', 'email', 'phone', 'notes'];
      examples = [{
        name: 'Example Site',
        client_id: 'client_123',
        address: '456 Business Ave',
        city: 'Chicago',
        state: 'IL',
        postcode: '60601',
        status: 'active',
        email: 'site@example.com',
        phone: '555-5678',
        notes: 'Example site'
      }];
      break;
      
    case 'contracts':
      headers = ['site_id', 'contract_details', 'notes', 'created_by'];
      examples = [{
        site_id: 'site_123',
        contract_details: JSON.stringify({
          startDate: '2023-01-01',
          endDate: '2024-01-01',
          autoRenewal: true,
          contractLength: 12,
          contractLengthUnit: 'months'
        }),
        notes: 'Example contract',
        created_by: 'admin@example.com'
      }];
      break;
      
    case 'unified':
      headers = ['record_type', 'id', 'name', 'client_id', 'site_id', 'address', 'city', 'state', 'postcode', 'status', 'email', 'phone', 'contract_details', 'notes'];
      examples = [
        {
          record_type: 'client',
          id: 'client_123',
          name: 'Example Company',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          postcode: '10001',
          status: 'active',
          email: 'contact@example.com',
          phone: '555-1234',
          notes: 'Example client'
        },
        {
          record_type: 'site',
          id: 'site_123',
          name: 'Example Site',
          client_id: 'client_123',
          address: '456 Business Ave',
          city: 'Chicago',
          state: 'IL',
          postcode: '60601',
          status: 'active',
          email: 'site@example.com',
          phone: '555-5678',
          notes: 'Example site'
        },
        {
          record_type: 'contract',
          site_id: 'site_123',
          contract_details: JSON.stringify({
            startDate: '2023-01-01',
            endDate: '2024-01-01'
          }),
          notes: 'Example contract'
        }
      ];
      break;
  }
  
  return Papa.unparse({
    fields: headers,
    data: examples
  });
}
