
import { DataType } from './types';

/**
 * Generates a CSV template for a given data type
 * @param type The data type
 * @returns CSV template as a string
 */
export function generateTemplateCSV(type: DataType): string {
  const headers = getHeadersForType(type);
  return headers.join(',') + '\n';
}

/**
 * Gets the headers for a given data type
 * @param type The data type
 * @returns Array of header strings
 */
function getHeadersForType(type: DataType): string[] {
  switch (type) {
    case 'client':
      return [
        'name',
        'contact_name',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'postcode',
        'status',
        'notes'
      ];
    case 'site':
      return [
        'name',
        'client_id',
        'address',
        'city',
        'state',
        'postcode',
        'status',
        'email',
        'phone',
        'representative',
        'monthly_revenue',
        'monthly_cost'
      ];
    case 'contractor':
      return [
        'business_name',
        'contact_name',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'postcode',
        'abn',
        'contractor_type',
        'status',
        'specialty',
        'notes'
      ];
    case 'contract':
      return [
        'site_id',
        'contract_details',
        'notes'
      ];
    case 'invoice':
      return [
        'invoice_number',
        'client_id',
        'site_id',
        'amount',
        'invoice_date',
        'due_date',
        'status',
        'notes'
      ];
    default:
      return [];
  }
}

/**
 * Generates a CSV from data
 * @param data The data to convert to CSV
 * @param includeHeaders Whether to include headers
 * @returns CSV string
 */
export function generateCSV(data: any[], includeHeaders: boolean = true): string {
  if (!data || data.length === 0) {
    return '';
  }
  
  // Get headers from the first object's keys
  const headers = Object.keys(data[0]);
  
  // Generate CSV rows
  const rows = data.map(item => {
    return headers.map(header => {
      const value = item[header];
      if (value === null || value === undefined) {
        return '';
      }
      
      if (typeof value === 'object') {
        // Convert objects to JSON strings
        const jsonString = JSON.stringify(value);
        // Escape quotes and wrap in quotes
        return `"${jsonString.replace(/"/g, '""')}"`;
      }
      
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        // Escape quotes and wrap in quotes
        return `"${value.replace(/"/g, '""')}"`;
      }
      
      return value;
    }).join(',');
  });
  
  // Add headers if requested
  if (includeHeaders) {
    rows.unshift(headers.join(','));
  }
  
  return rows.join('\n');
}
