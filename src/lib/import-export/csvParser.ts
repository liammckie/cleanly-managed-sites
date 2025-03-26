
import Papa from 'papaparse';
import { ClientRecord, SiteRecord } from '@/lib/types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import { ImportData, ValidationResult } from './types';
import { validateClientData } from './validation/clientValidation';
import { validateSiteData } from './validation/siteValidation';
import { validateContractData } from './validation/contractValidation';
import { ensureContractHistoryIds, adaptClientRecordForImport } from '@/lib/utils/fixes';

/**
 * Parse CSV data into structured objects
 */
export const parseCsvData = (csvString: string, type: 'clients' | 'sites' | 'contracts'): ValidationResult => {
  const parseResult = Papa.parse(csvString, { header: true });
  
  if (parseResult.errors.length > 0) {
    return {
      isValid: false,
      errors: parseResult.errors.map(err => ({
        row: err.row,
        field: '',
        message: err.message,
        value: err.code
      })),
      warnings: [],
      data: []
    };
  }
  
  const records = parseResult.data;
  
  // Validate based on data type
  switch (type) {
    case 'clients':
      return validateClientData(records as Partial<ClientRecord>[]);
    case 'sites':
      return validateSiteData(records as Partial<SiteRecord>[]);
    case 'contracts':
      return validateContractData(records as Partial<ContractHistoryEntry>[]);
    default:
      return { isValid: false, errors: [{ row: 0, field: '', message: 'Unknown data type', value: type }], warnings: [], data: [] };
  }
};

/**
 * Convert parsed data into the appropriate format
 */
export const convertParsedCsvToImportData = (validationResult: ValidationResult, type: 'clients' | 'sites' | 'contracts'): ImportData => {
  if (!validationResult.isValid) {
    return {};
  }
  
  const importData: ImportData = {};
  
  switch (type) {
    case 'clients':
      importData.clients = validationResult.data.map(client => 
        adaptClientRecordForImport(client)
      );
      break;
    case 'sites':
      importData.sites = validationResult.data as SiteRecord[];
      break;
    case 'contracts':
      importData.contracts = ensureContractHistoryIds(validationResult.data as Partial<ContractHistoryEntry>[]);
      break;
  }
  
  return importData;
};
