import { ClientRecord, SiteRecord } from '@/lib/types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';

// Validation for client data
export const validateClientData = (clients: ClientRecord[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  clients.forEach((client, index) => {
    if (!client.name) {
      errors.push(`Client #${index + 1}: Name is required`);
    }
    if (client.email && !isValidEmail(client.email)) {
      errors.push(`Client #${index + 1}: Invalid email format`);
    }
    // Add more validation rules as needed
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validation for site data
export const validateSiteData = (sites: SiteRecord[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  sites.forEach((site, index) => {
    if (!site.name) {
      errors.push(`Site #${index + 1}: Name is required`);
    }
    if (!site.client_id) {
      errors.push(`Site #${index + 1}: Client ID is required`);
    }
    // Add more validation rules as needed
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validation for contract history data
export const validateContractData = (contracts: ContractHistoryEntry[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  contracts.forEach((contract, index) => {
    if (!contract.site_id) {
      errors.push(`Contract #${index + 1}: Site ID is required`);
    }
    if (!contract.contract_details) {
      errors.push(`Contract #${index + 1}: Contract details are required`);
    }
    // Add more validation rules as needed
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Helper function to validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
