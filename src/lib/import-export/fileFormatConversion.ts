
/**
 * Convert CSV data to client format
 */
export const convertCSVToClientFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    name: row.name || '',
    contact_name: row.contact_name || row.contactName || '',
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || row.postal_code || '',
    status: row.status || 'active',
    notes: row.notes || '',
  }));
};

/**
 * Convert CSV data to site format
 */
export const convertCSVToSiteFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    name: row.name || '',
    client_id: row.client_id || row.clientId || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || row.postal_code || '',
    status: row.status || 'active',
    monthly_revenue: parseFloat(row.monthly_revenue || '0'),
    representative: row.representative || '',
  }));
};

/**
 * Convert CSV data to contractor format
 */
export const convertCSVToContractorFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    business_name: row.business_name || row.businessName || '',
    contact_name: row.contact_name || row.contactName || '',
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || row.postal_code || '',
    contractor_type: row.contractor_type || row.contractorType || 'general',
    status: row.status || 'active',
    hourly_rate: parseFloat(row.hourly_rate || '0'),
    day_rate: parseFloat(row.day_rate || '0'),
  }));
};

/**
 * Convert CSV data to contract format
 */
export const convertCSVToContractFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    site_id: row.site_id || row.siteId || '',
    contract_type: row.contract_type || row.contractType || 'standard',
    start_date: row.start_date || row.startDate || '',
    end_date: row.end_date || row.endDate || '',
    value: parseFloat(row.value || '0'),
    billing_cycle: row.billing_cycle || row.billingCycle || 'monthly',
    auto_renew: row.auto_renew === 'true' || row.autoRenew === 'true',
    renewal_terms: row.renewal_terms || row.renewalTerms || '',
    termination_period: row.termination_period || row.terminationPeriod || '',
    notes: row.notes || '',
  }));
};
