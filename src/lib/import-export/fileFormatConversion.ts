
// Helper functions to convert CSV data to different formats
export function convertCSVToClientFormat(csvData: any[]): any[] {
  if (!csvData || !csvData.length) {
    return [];
  }
  
  return csvData.map(row => ({
    name: row.name || row.client_name || 'Unnamed Client',
    contact_name: row.contact_name || row.contact || '',
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || row.postal_code || row.zip || '',
    status: row.status || 'active',
    notes: row.notes || row.note || '',
    custom_id: row.custom_id || row.id || ''
  }));
}

export function convertCSVToSiteFormat(csvData: any[]): any[] {
  if (!csvData || !csvData.length) {
    return [];
  }
  
  return csvData.map(row => ({
    name: row.name || row.site_name || 'Unnamed Site',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || row.postal_code || row.zip || '',
    client_id: row.client_id || null,
    monthly_revenue: parseFloat(row.monthly_revenue || '0'),
    status: row.status || 'active',
    custom_id: row.custom_id || row.id || '',
    representative: row.representative || row.rep || ''
  }));
}

export function convertCSVToContractorFormat(csvData: any[]): any[] {
  if (!csvData || !csvData.length) {
    return [];
  }
  
  return csvData.map(row => ({
    business_name: row.business_name || row.company || row.name || 'Unnamed Contractor',
    contact_name: row.contact_name || row.contact || '',
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || row.postal_code || row.zip || '',
    abn: row.abn || row.tax_id || '',
    contractor_type: row.contractor_type || row.type || 'general',
    status: row.status || 'active',
    hourly_rate: parseFloat(row.hourly_rate || '0'),
    day_rate: parseFloat(row.day_rate || '0'),
    notes: row.notes || row.note || ''
  }));
}

export function convertCSVToContractFormat(csvData: any[]): any[] {
  if (!csvData || !csvData.length) {
    return [];
  }
  
  return csvData.map(row => ({
    site_id: row.site_id || null,
    contract_type: row.contract_type || row.type || 'service',
    value: parseFloat(row.value || row.amount || '0'),
    start_date: row.start_date || null,
    end_date: row.end_date || null,
    billing_cycle: row.billing_cycle || row.frequency || 'monthly',
    auto_renew: row.auto_renew === 'true' || row.auto_renew === true || false,
    termination_period: row.termination_period || '',
    renewal_terms: row.renewal_terms || '',
    notes: row.notes || row.note || ''
  }));
}
