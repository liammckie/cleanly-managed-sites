
import Papa from 'papaparse';

// Parse CSV file into JSON
export const parseCSV = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      }
    });
  });
};

// Convert CSV data to client format
export const convertCSVToClientFormat = (data: any[]): any[] => {
  return data.map(row => ({
    name: row.name,
    contact_name: row.contact_name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    state: row.state,
    postal_code: row.postcode || row.postal_code,
    country: row.country || 'Australia',
    status: row.status || 'active',
    notes: row.notes
  }));
};

// Convert CSV data to site format
export const convertCSVToSiteFormat = (data: any[]): any[] => {
  return data.map(row => ({
    name: row.name,
    address: row.address,
    city: row.city,
    state: row.state,
    postal_code: row.postcode || row.postal_code,
    country: row.country || 'Australia',
    client_id: row.client_id,
    status: row.status || 'active',
    email: row.email,
    phone: row.phone,
    representative: row.representative
  }));
};

// Convert CSV data to contractor format
export const convertCSVToContractorFormat = (data: any[]): any[] => {
  return data.map(row => ({
    business_name: row.business_name,
    contact_name: row.contact_name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    state: row.state,
    postcode: row.postcode || row.postal_code,
    abn: row.abn || row.tax_id,
    contractor_type: row.contractor_type || 'cleaning',
    status: row.status || 'active',
    notes: row.notes
  }));
};

// Convert CSV data to contract format
export const convertCSVToContractFormat = (data: any[]): any[] => {
  return data.map(row => ({
    site_id: row.site_id,
    startDate: row.start_date,
    endDate: row.end_date,
    value: row.value || 0,
    contractNumber: row.contract_number,
    contractType: row.contract_type || 'cleaning',
    autoRenewal: row.auto_renewal === 'true' || row.auto_renewal === true
  }));
};

// Import functions
export const importClients = async (clients: any[]): Promise<any> => {
  console.log('Importing clients:', clients);
  // Would typically make an API call to import clients
  return Promise.resolve({ success: true, count: clients.length });
};

export const importSites = async (sites: any[]): Promise<any> => {
  console.log('Importing sites:', sites);
  // Would typically make an API call to import sites
  return Promise.resolve({ success: true, count: sites.length });
};

export const importContractors = async (contractors: any[]): Promise<any> => {
  console.log('Importing contractors:', contractors);
  // Would typically make an API call to import contractors
  return Promise.resolve({ success: true, count: contractors.length });
};

export const importContracts = async (contracts: any[]): Promise<any> => {
  console.log('Importing contracts:', contracts);
  // Would typically make an API call to import contracts
  return Promise.resolve({ success: true, count: contracts.length });
};
