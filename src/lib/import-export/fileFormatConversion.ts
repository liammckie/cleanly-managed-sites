
/**
 * File Format Conversion Utilities
 * 
 * Functions to convert between different data formats for import/export
 */

/**
 * Converts CSV data to client format
 */
export function convertCSVToClientFormat(csvData: any[]): any[] {
  return csvData.map(row => ({
    name: row.name || row.client_name || '',
    contact_name: row.contact_name || row.contactName || row.contact || '',
    email: row.email || '',
    phone: row.phone || row.phoneNumber || '',
    address: row.address || row.street || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || row.postal_code || row.postalCode || row.zip || '',
    country: row.country || 'Australia',
    status: row.status || 'active',
  }));
}

/**
 * Converts CSV data to site format
 */
export function convertCSVToSiteFormat(csvData: any[], clientMap?: Record<string, string>): any[] {
  return csvData.map(row => ({
    name: row.name || row.site_name || '',
    address: row.address || row.street || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || row.postal_code || row.postalCode || row.zip || '',
    country: row.country || 'Australia',
    client_id: clientMap?.[row.client_name] || row.client_id || null,
    status: row.status || 'active',
    email: row.email || '',
    phone: row.phone || row.phoneNumber || '',
  }));
}

/**
 * Converts CSV data to contract format
 */
export function convertCSVToContractFormat(csvData: any[]): any[] {
  return csvData.map(row => ({
    site_id: row.site_id || '',
    start_date: row.start_date || row.startDate || new Date().toISOString().split('T')[0],
    end_date: row.end_date || row.endDate || '',
    auto_renewal: row.auto_renewal || row.autoRenewal || false,
    value: row.value || row.amount || 0,
    contract_number: row.contract_number || row.contractNumber || '',
    notes: row.notes || '',
  }));
}

/**
 * Converts CSV data to contractor format
 */
export function convertCSVToContractorFormat(csvData: any[]): any[] {
  return csvData.map(row => ({
    business_name: row.business_name || row.businessName || row.company || '',
    contact_name: row.contact_name || row.contactName || row.contact || '',
    email: row.email || '',
    phone: row.phone || row.phoneNumber || '',
    address: row.address || row.street || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || row.postal_code || row.postalCode || row.zip || '',
    tax_id: row.tax_id || row.taxId || row.abn || '',
    contractor_type: row.contractor_type || row.contractorType || 'cleaning',
    status: row.status || 'active',
  }));
}

/**
 * Converts CSV data to invoice format
 */
export function convertCSVToInvoiceFormat(csvData: any[]): any[] {
  return csvData.map(row => ({
    invoice_number: row.invoice_number || row.invoiceNumber || '',
    client_id: row.client_id || '',
    site_id: row.site_id || '',
    amount: parseFloat(row.amount || 0),
    status: row.status || 'draft',
    due_date: row.due_date || row.dueDate || '',
    issue_date: row.issue_date || row.issueDate || new Date().toISOString().split('T')[0],
    notes: row.notes || '',
  }));
}
