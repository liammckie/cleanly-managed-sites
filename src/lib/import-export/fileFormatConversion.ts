
// Basic format conversion functions
export function convertCSVToClientFormat(csvData: any[]): any[] {
  return csvData.map(row => ({
    name: row.name || '',
    contact_name: row.contact_name || row.contactName || row.contact || '',
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || row.postal_code || row.zip || '',
    status: row.status || 'active',
    notes: row.notes || row.note || ''
  }));
}

export function convertCSVToSiteFormat(csvData: any[]): any[] {
  return csvData.map(row => ({
    name: row.name || '',
    client_id: row.client_id || row.clientId || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || row.postal_code || row.zip || '',
    monthly_revenue: parseFloat(row.monthly_revenue || 0),
    representative: row.representative || '',
    status: row.status || 'active'
  }));
}

export function convertCSVToContractFormat(csvData: any[]): any[] {
  return csvData.map(row => ({
    site_id: row.site_id || row.siteId || '',
    contract_number: row.contract_number || row.contractNumber || '',
    contract_type: row.contract_type || row.contractType || 'maintenance',
    start_date: row.start_date || row.startDate || '',
    end_date: row.end_date || row.endDate || '',
    value: parseFloat(row.value || 0),
    billing_cycle: row.billing_cycle || row.billingCycle || 'monthly',
    auto_renew: row.auto_renew === 'true' || row.autoRenew === 'true' || false,
    notes: row.notes || ''
  }));
}

export function convertCSVToContractorFormat(csvData: any[]): any[] {
  return csvData.map(row => ({
    business_name: row.business_name || row.businessName || '',
    contact_name: row.contact_name || row.contactName || '',
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || row.postal_code || row.zip || '',
    contractor_type: row.contractor_type || row.contractorType || 'general',
    status: row.status || 'active',
    hourly_rate: parseFloat(row.hourly_rate || row.hourlyRate || 0),
    day_rate: parseFloat(row.day_rate || row.dayRate || 0)
  }));
}
