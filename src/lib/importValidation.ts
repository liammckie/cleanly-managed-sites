
import { ClientRecord, SiteRecord } from '@/lib/types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';

// Update ValidationResult type to include warnings and data
export interface ValidationMessage {
  row: number;
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationMessage[];
  warnings: ValidationMessage[];
  data: any[];
}

// Validation for client data
export const validateClientData = (clients: ClientRecord[]): ValidationResult => {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];
  
  clients.forEach((client, index) => {
    if (!client.name) {
      errors.push({
        row: index + 1,
        field: 'name',
        message: `Client #${index + 1}: Name is required`,
        value: client.name
      });
    }
    if (client.email && !isValidEmail(client.email)) {
      errors.push({
        row: index + 1,
        field: 'email',
        message: `Client #${index + 1}: Invalid email format`,
        value: client.email
      });
    }
    // Add more validation rules as needed
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: clients
  };
};

// Validation for site data
export const validateSiteData = (sites: SiteRecord[]): ValidationResult => {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];
  
  sites.forEach((site, index) => {
    if (!site.name) {
      errors.push({
        row: index + 1,
        field: 'name',
        message: `Site #${index + 1}: Name is required`,
        value: site.name
      });
    }
    if (!site.client_id) {
      errors.push({
        row: index + 1,
        field: 'client_id',
        message: `Site #${index + 1}: Client ID is required`,
        value: site.client_id
      });
    }
    // Add more validation rules as needed
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: sites
  };
};

// Validation for contract history data
export const validateContractData = (contracts: Partial<ContractHistoryEntry>[]): ValidationResult => {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];
  
  contracts.forEach((contract, index) => {
    if (!contract.site_id) {
      errors.push({
        row: index + 1,
        field: 'site_id',
        message: `Contract #${index + 1}: Site ID is required`,
        value: contract.site_id
      });
    }
    if (!contract.contract_details) {
      errors.push({
        row: index + 1,
        field: 'contract_details',
        message: `Contract #${index + 1}: Contract details are required`,
        value: contract.contract_details
      });
    }
    // Add more validation rules as needed
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: contracts
  };
};

// Helper function to validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Template generators
export const getClientCSVTemplate = (): string => {
  return 'name,email,phone,address,city,state,postcode,status\nExample Corp,contact@example.com,555-1234,123 Main St,New York,NY,10001,active';
};

export const getSiteCSVTemplate = (): string => {
  return 'name,client_id,address,city,state,postcode,status,phone,email\nMain Office,client_123,456 Business Ave,Chicago,IL,60601,active,555-5678,site@example.com';
};

export const getContractCSVTemplate = (): string => {
  return 'site_id,contract_details,notes,created_by,version_number\nsite_123,"{\"startDate\":\"2023-01-01\",\"endDate\":\"2024-01-01\"}",Initial contract,john.doe@example.com,1';
};
