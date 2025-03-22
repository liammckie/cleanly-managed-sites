
import { parseCSV, parseUnifiedImport, convertCSVToClientFormat, convertCSVToSiteFormat, convertCSVToContractFormat } from './csvParser';
import { exportToJson, exportToCSV, exportClients, exportSites, exportContracts, generateUnifiedImportTemplate } from './exportOperations';
import { parseImportedFile, importClients, importSites, importContracts } from './importOperations';
import { checkExistingItems, mergeImportData, validateClientData, validateSiteData, validateContractData } from './dataValidation';
import { generateTestData, setupTestData } from './testData';
import { ParsedImportData, ImportOptions } from './types';

// Handle unified import of data
export const handleUnifiedImport = async (file: File, options: ImportOptions): Promise<void> => {
  try {
    const csvData = await parseCSV(file);
    const { clients, sites, contracts } = await parseUnifiedImport(csvData, options);
    
    console.log(`Parsed unified import: ${clients.length} clients, ${sites.length} sites, ${contracts.length} contracts`);
    
    if (clients.length > 0) {
      await importClients(clients);
    }
    
    if (sites.length > 0) {
      await importSites(sites);
    }
    
    if (contracts.length > 0) {
      await importContracts(contracts);
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
  
  // Data validation
  checkExistingItems,
  mergeImportData,
  validateClientData,
  validateSiteData,
  validateContractData,
  
  // Test data
  generateTestData,
  setupTestData
};
