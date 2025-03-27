
// CSV to Client format converter
export const convertCSVToClientFormat = (csvData: any[]): any[] => {
  return csvData.map(row => {
    return {
      name: row.name || row.client_name || '',
      contact_name: row.contact_name || row.contact || '',
      email: row.email || '',
      phone: row.phone || row.telephone || '',
      address: row.address || '',
      city: row.city || row.suburb || '',
      state: row.state || '',
      postcode: row.postcode || row.zip || row.postal_code || '',
      status: row.status || 'active',
      notes: row.notes || ''
    };
  });
};

// CSV to Site format converter
export const convertCSVToSiteFormat = (csvData: any[]): any[] => {
  return csvData.map(row => {
    return {
      name: row.name || row.site_name || '',
      address: row.address || '',
      city: row.city || row.suburb || '',
      state: row.state || '',
      postcode: row.postcode || row.zip || row.postal_code || '',
      status: row.status || 'active',
      client_id: row.client_id || null,
      client_name: row.client_name || '',
      phone: row.phone || row.telephone || '',
      email: row.email || '',
      representative: row.representative || row.contact_name || ''
    };
  });
};

// CSV to Contract format converter
export const convertCSVToContractFormat = (csvData: any[]): any[] => {
  return csvData.map(row => {
    return {
      site_id: row.site_id || null,
      site_name: row.site_name || row.name || '',
      start_date: row.start_date || '',
      end_date: row.end_date || '',
      contract_value: parseFloat(row.contract_value || '0') || 0,
      status: row.status || 'active',
      contract_type: row.contract_type || 'fixed_term'
    };
  });
};

// CSV to Contractor format converter
export const convertCSVToContractorFormat = (csvData: any[]): any[] => {
  return csvData.map(row => {
    return {
      business_name: row.business_name || row.name || '',
      contact_name: row.contact_name || row.contact || '',
      email: row.email || '',
      phone: row.phone || row.telephone || '',
      address: row.address || '',
      city: row.city || row.suburb || '',
      state: row.state || '',
      postcode: row.postcode || row.zip || row.postal_code || '',
      status: row.status || 'active',
      contractor_type: row.contractor_type || 'individual',
      specialty: row.specialty ? [row.specialty] : [],
      hourly_rate: parseFloat(row.hourly_rate || '0') || null,
      day_rate: parseFloat(row.day_rate || '0') || null
    };
  });
};
