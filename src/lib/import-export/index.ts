
import { parseCSV, parseUnifiedImport, convertCSVToClientFormat, convertCSVToSiteFormat, convertCSVToContractFormat } from './csvParser';
import { exportToJson, exportToCSV, exportClients, exportSites, exportContracts, generateUnifiedImportTemplate } from './exportOperations';
import { parseImportedFile, importClients, importSites, importContracts, importInvoices } from './importOperations';
import { 
  checkExistingItems, 
  mergeImportData, 
  validateClientData, 
  validateSiteData, 
  validateContractData, 
  validateInvoiceData,
  validateInvoiceLineItemData
} from './dataValidation';
import { generateTestData, setupTestData } from './testData';
import { ParsedImportData, ImportOptions, InvoiceRecord, InvoiceLineItemRecord } from './types';

// Handle unified import of data
export const handleUnifiedImport = async (file: File, options: ImportOptions): Promise<void> => {
  try {
    const csvData = await parseCSV(file);
    const { clients, sites, contracts, invoices } = await parseUnifiedImport(csvData, options);
    
    console.log(`Parsed unified import: ${clients.length} clients, ${sites.length} sites, ${contracts.length} contracts, ${invoices?.length || 0} invoices`);
    
    if (clients.length > 0) {
      await importClients(clients);
    }
    
    if (sites.length > 0) {
      await importSites(sites);
    }
    
    if (contracts.length > 0) {
      await importContracts(contracts);
    }
    
    if (invoices && invoices.length > 0) {
      await importInvoices(invoices);
    }
  } catch (error) {
    console.error('Error during unified import:', error);
    throw error;
  }
};

export {
  // CSV Parser exports
  parseCSV,
  parseUnifiedImport,
  convertCSVToClientFormat,
  convertCSVToSiteFormat,
  convertCSVToContractFormat,
  
  // Export operations
  exportToJson,
  exportToCSV,
  exportClients,
  exportSites,
  exportContracts,
  generateUnifiedImportTemplate,
  
  // Import operations
  parseImportedFile,
  importClients,
  importSites,
  importContracts,
  importInvoices,
  
  // Data validation
  checkExistingItems,
  mergeImportData,
  validateClientData,
  validateSiteData,
  validateContractData,
  validateInvoiceData,
  validateInvoiceLineItemData,
  
  // Test data
  generateTestData,
  setupTestData,
  
  // Types
  type InvoiceRecord,
  type InvoiceLineItemRecord
};
