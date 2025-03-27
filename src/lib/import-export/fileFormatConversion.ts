
// File Format Conversion Utilities
import { z } from 'zod';

// Client format conversion
export const convertCSVToClientFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    name: row.name || row.Name || '',
    contact_name: row.contact_name || row.contact || row['Contact Name'] || '',
    email: row.email || row.Email || '',
    phone: row.phone || row.Phone || row['Phone Number'] || '',
    address: row.address || row.Address || '',
    city: row.city || row.City || '',
    state: row.state || row.State || '',
    postcode: row.postcode || row.zip || row.Zip || row['Postal Code'] || '',
    notes: row.notes || row.Notes || '',
    status: 'active'
  }));
};

// Contractor format conversion
export const convertCSVToContractorFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    business_name: row.business_name || row['Business Name'] || row.name || row.Name || '',
    contact_name: row.contact_name || row['Contact Name'] || row.contact || '',
    email: row.email || row.Email || '',
    phone: row.phone || row.Phone || row['Phone Number'] || '',
    address: row.address || row.Address || '',
    city: row.city || row.City || '',
    state: row.state || row.State || '',
    postcode: row.postcode || row.zip || row.Zip || row['Postal Code'] || '',
    tax_id: row.tax_id || row.abn || row.ABN || row['Tax ID'] || '',
    status: 'active',
    contractor_type: row.contractor_type || row.type || row.Type || row['Contractor Type'] || 'cleaning',
    notes: row.notes || row.Notes || ''
  }));
};

// Site format conversion
export const convertCSVToSiteFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    name: row.name || row.Name || row['Site Name'] || '',
    address: row.address || row.Address || '',
    city: row.city || row.City || '',
    state: row.state || row.State || '',
    postcode: row.postcode || row.zip || row.Zip || row['Postal Code'] || '',
    representative: row.representative || row.contact || row['Site Contact'] || '',
    phone: row.phone || row.Phone || row['Phone Number'] || '',
    email: row.email || row.Email || '',
    client_id: row.client_id || row['Client ID'] || '',
    client_name: row.client_name || row['Client Name'] || '',
    status: 'active',
    monthly_revenue: parseFloat(row.monthly_revenue || row['Monthly Revenue'] || '0') || 0,
    weekly_revenue: parseFloat(row.weekly_revenue || row['Weekly Revenue'] || '0') || 0,
    annual_revenue: parseFloat(row.annual_revenue || row['Annual Revenue'] || '0') || 0,
    monthly_cost: parseFloat(row.monthly_cost || row['Monthly Cost'] || '0') || 0,
    custom_id: row.custom_id || row['Custom ID'] || row.id || '',
    notes: row.notes || row.Notes || ''
  }));
};

// Contract format conversion
export const convertCSVToContractFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    site_id: row.site_id || row['Site ID'] || '',
    site_name: row.site_name || row['Site Name'] || '',
    client_id: row.client_id || row['Client ID'] || '',
    client_name: row.client_name || row['Client Name'] || '',
    contract_number: row.contract_number || row['Contract Number'] || '',
    start_date: row.start_date || row['Start Date'] || '',
    end_date: row.end_date || row['End Date'] || '',
    value: parseFloat(row.value || row.Value || row['Contract Value'] || '0') || 0,
    status: row.status || row.Status || 'active',
    contract_type: row.contract_type || row['Contract Type'] || 'cleaning',
    auto_renewal: row.auto_renewal === 'true' || row.auto_renewal === 'Yes' || false,
    renewal_terms: row.renewal_terms || row['Renewal Terms'] || '',
    termination_period: row.termination_period || row['Termination Period'] || '',
    notes: row.notes || row.Notes || ''
  }));
};
