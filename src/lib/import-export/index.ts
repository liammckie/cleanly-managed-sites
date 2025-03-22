
import { parseCSV, parseUnifiedImport, convertCSVToClientFormat, convertCSVToSiteFormat, convertCSVToContractFormat } from './csvParser';
import { exportToJson, exportToCSV, exportClients, exportSites, exportContracts, generateUnifiedImportTemplate } from './exportOperations';
import { parseImportedFile } from './importUtils';
import { importClients } from './clientImport';
import { importSites } from './siteImport';
import { importContracts } from './contractImport';
import { importInvoices } from './invoiceImport';
import { 
  checkExistingItems, 
  mergeImportData, 
  validateClientData, 
  validateSiteData, 
  validateContractData, 
  validateInvoiceData,
  validateInvoiceLineItemData
} from './validation';
import { generateTestData, setupTestData } from './testData';
import { ParsedImportData, ImportOptions, InvoiceRecord, InvoiceLineItemRecord, ValidationMessage, ValidationResult } from './types';

// Handle unified import of data
export const handleUnifiedImport = async (file: File, options: ImportOptions): Promise<void> => {
  try {
    console.log('Starting unified import with mode:', options.mode);
    const csvData = await parseCSV(file);
    console.log(`Parsed ${csvData.length} rows from CSV`);
    
    // Parse the data into separate entity types
    const { clients, sites, contracts, invoices } = await parseUnifiedImport(csvData, options);
    
    console.log(`Unified import parsed:
      - ${clients.length} clients
      - ${sites.length} sites
      - ${contracts.length} contracts
      - ${invoices?.length || 0} invoices`);
    
    // Process clients first to establish references
    if (clients.length > 0) {
      console.log('Importing clients...');
      await importClients(clients);
    }
    
    // Process sites after clients
    if (sites.length > 0) {
      console.log('Importing sites...');
      
      // If a site references a client by custom_id, resolve it to an actual client_id
      for (const site of sites) {
        if (site.client_id && site.client_id.startsWith('custom:')) {
          const customId = site.client_id.substring(7); // Remove 'custom:' prefix
          console.log(`Resolving client custom ID: ${customId}`);
          // This lookup would need to be implemented
          // site.client_id = await resolveClientCustomId(customId);
        }
      }
      
      await importSites(sites);
    }
    
    // Process contracts after sites
    if (contracts.length > 0) {
      console.log('Importing contracts...');
      
      // If a contract references a site by custom_id, resolve it to an actual site_id
      for (const contract of contracts) {
        if (contract.site_id && contract.site_id.startsWith('custom:')) {
          const customId = contract.site_id.substring(7); // Remove 'custom:' prefix
          console.log(`Resolving site custom ID: ${customId}`);
          // This lookup would need to be implemented
          // contract.site_id = await resolveSiteCustomId(customId);
        }
      }
      
      await importContracts(contracts);
    }
    
    // Process invoices after all other entities
    if (invoices && invoices.length > 0) {
      console.log('Importing invoices...');
      await importInvoices(invoices);
    }
    
    console.log('Unified import completed successfully');
  } catch (error) {
    console.error('Error during unified import:', error);
    throw error;
  }
};

// The rest of the exports
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
  type ValidationMessage,
  type ValidationResult,
  type InvoiceRecord,
  type InvoiceLineItemRecord
};
