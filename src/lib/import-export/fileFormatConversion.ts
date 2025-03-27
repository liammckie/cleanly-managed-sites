
import { ClientImportItem, ContractorRecord } from './types';
import { SiteRecord } from '@/lib/types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';

/**
 * Converts CSV data to client format
 * @param csvData The CSV data
 * @returns Client data in the correct format
 */
export function convertCSVToClientFormat(csvData: any[]): ClientImportItem[] {
  return csvData.map(row => ({
    name: row.name || '',
    contact_name: row.contact_name || '',
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || row.postal_code || '',
    status: row.status || 'active',
    notes: row.notes || ''
  }));
}

/**
 * Converts CSV data to site format
 * @param csvData The CSV data
 * @returns Site data in the correct format
 */
export function convertCSVToSiteFormat(csvData: any[]): Partial<SiteRecord>[] {
  return csvData.map(row => {
    // Handle JSON fields
    const contractDetails = row.contract_details ? 
      (typeof row.contract_details === 'string' ? JSON.parse(row.contract_details) : row.contract_details) : 
      undefined;
    
    const billingDetails = row.billing_details ? 
      (typeof row.billing_details === 'string' ? JSON.parse(row.billing_details) : row.billing_details) : 
      undefined;
    
    const jobSpecifications = row.job_specifications ? 
      (typeof row.job_specifications === 'string' ? JSON.parse(row.job_specifications) : row.job_specifications) : 
      undefined;
    
    return {
      name: row.name || '',
      address: row.address || '',
      city: row.city || '',
      state: row.state || '',
      postcode: row.postcode || row.postal_code || '',
      client_id: row.client_id || '',
      status: row.status || 'active',
      email: row.email || '',
      phone: row.phone || '',
      representative: row.representative || '',
      monthly_revenue: row.monthly_revenue ? Number(row.monthly_revenue) : undefined,
      monthly_cost: row.monthly_cost ? Number(row.monthly_cost) : undefined,
      contract_details: contractDetails,
      billing_details: billingDetails,
      job_specifications: jobSpecifications
    };
  });
}

/**
 * Converts CSV data to contractor format
 * @param csvData The CSV data
 * @returns Contractor data in the correct format
 */
export function convertCSVToContractorFormat(csvData: any[]): ContractorRecord[] {
  return csvData.map(row => {
    // Handle specialty array
    let specialty = row.specialty;
    if (specialty && typeof specialty === 'string') {
      try {
        specialty = JSON.parse(specialty);
      } catch (e) {
        // If it's not JSON, try comma-separated
        specialty = specialty.split(',').map((s: string) => s.trim());
      }
    }
    
    return {
      business_name: row.business_name || '',
      contact_name: row.contact_name || '',
      email: row.email || '',
      phone: row.phone || '',
      address: row.address || '',
      city: row.city || '',
      state: row.state || '',
      postcode: row.postcode || row.postal_code || '',
      abn: row.abn || '',
      contractor_type: row.contractor_type || 'company',
      status: row.status || 'active',
      specialty: specialty,
      notes: row.notes || ''
    };
  });
}

/**
 * Converts CSV data to contract format
 * @param csvData The CSV data
 * @returns Contract data in the correct format
 */
export function convertCSVToContractFormat(csvData: any[]): Partial<ContractHistoryEntry>[] {
  return csvData.map(row => {
    // Convert the CSV row to the ContractHistoryEntry format
    const contractDetails = typeof row.contract_details === 'string' 
      ? JSON.parse(row.contract_details) 
      : row.contract_details || {};
      
    return {
      site_id: row.site_id || '',
      contract_details: contractDetails,
      notes: row.notes || '',
      created_by: row.created_by || '',
      version_number: Number(row.version_number) || 0
    };
  });
}
