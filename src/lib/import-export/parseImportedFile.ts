
import Papa from 'papaparse';

/**
 * Parse an imported file (CSV or JSON) into an array of objects
 */
export const parseCSV = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

/**
 * Parse any imported file based on its extension
 */
export const parseImportedFile = async (file: File): Promise<any[]> => {
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  
  if (fileExt === 'csv') {
    return parseCSV(file);
  } else if (fileExt === 'json') {
    const text = await file.text();
    try {
      return JSON.parse(text);
    } catch (error) {
      throw new Error('Invalid JSON file');
    }
  } else {
    throw new Error('Unsupported file type. Please upload a CSV or JSON file.');
  }
};

/**
 * Basic format conversion utilities
 */
export const convertCSVToClientFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    name: row.name,
    contact_name: row.contact_name || row.contactName || '',
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || row.postalCode || row.postal_code || '',
    status: row.status || 'active'
  }));
};

export const convertCSVToSiteFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    name: row.name,
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || row.postalCode || row.postal_code || '',
    client_id: row.client_id || '',
    status: row.status || 'active'
  }));
};

export const convertCSVToContractFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    site_id: row.site_id,
    contract_details: {
      startDate: row.start_date || row.startDate,
      endDate: row.end_date || row.endDate,
      contractNumber: row.contract_number || row.contractNumber,
      value: parseFloat(row.value) || 0,
    },
    notes: row.notes || ''
  }));
};

export const convertCSVToContractorFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    business_name: row.business_name || row.businessName,
    contact_name: row.contact_name || row.contactName,
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || row.postalCode || row.postal_code || '',
    contractor_type: row.contractor_type || row.contractorType || 'general',
    status: row.status || 'active'
  }));
};
