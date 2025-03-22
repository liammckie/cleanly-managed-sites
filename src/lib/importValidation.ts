
import { ClientRecord, SiteRecord } from './types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import { toast } from 'sonner';
import Papa from 'papaparse';

export interface ValidationError {
  row: number;
  field: string;
  message: string;
  value: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  data: any[];
}

// Validate client data with detailed errors
export const validateClientData = (data: any[]): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  data.forEach((client, index) => {
    // Required fields
    if (!client.name) {
      errors.push({
        row: index + 1,
        field: 'name',
        message: 'Client name is required',
        value: client.name
      });
    }
    
    if (!client.contact_name) {
      errors.push({
        row: index + 1,
        field: 'contact_name',
        message: 'Contact name is required',
        value: client.contact_name
      });
    }
    
    // Email validation
    if (client.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
      warnings.push({
        row: index + 1,
        field: 'email',
        message: 'Email format appears to be invalid',
        value: client.email
      });
    }
    
    // Phone validation
    if (client.phone && !/^[+]?[\d\s()-]{7,}$/.test(client.phone)) {
      warnings.push({
        row: index + 1,
        field: 'phone',
        message: 'Phone number format appears to be invalid',
        value: client.phone
      });
    }
    
    // Status validation
    if (client.status && !['active', 'inactive', 'pending'].includes(client.status)) {
      warnings.push({
        row: index + 1,
        field: 'status',
        message: 'Status should be active, inactive, or pending',
        value: client.status
      });
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data
  };
};

// Validate site data with detailed errors
export const validateSiteData = (data: any[]): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  data.forEach((site, index) => {
    // Required fields
    if (!site.name) {
      errors.push({
        row: index + 1,
        field: 'name',
        message: 'Site name is required',
        value: site.name
      });
    }
    
    if (!site.address) {
      errors.push({
        row: index + 1,
        field: 'address',
        message: 'Address is required',
        value: site.address
      });
    }
    
    if (!site.client_id) {
      errors.push({
        row: index + 1,
        field: 'client_id',
        message: 'Client ID is required',
        value: site.client_id
      });
    }
    
    // Email validation
    if (site.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.email)) {
      warnings.push({
        row: index + 1,
        field: 'email',
        message: 'Email format appears to be invalid',
        value: site.email
      });
    }
    
    // Phone validation
    if (site.phone && !/^[+]?[\d\s()-]{7,}$/.test(site.phone)) {
      warnings.push({
        row: index + 1,
        field: 'phone',
        message: 'Phone number format appears to be invalid',
        value: site.phone
      });
    }
    
    // Status validation
    if (site.status && !['active', 'inactive', 'pending'].includes(site.status)) {
      warnings.push({
        row: index + 1,
        field: 'status',
        message: 'Status should be active, inactive, or pending',
        value: site.status
      });
    }
    
    // Numeric fields validation
    if (site.monthly_cost && isNaN(parseFloat(site.monthly_cost))) {
      warnings.push({
        row: index + 1,
        field: 'monthly_cost',
        message: 'Monthly cost must be a number',
        value: site.monthly_cost
      });
    }
    
    if (site.monthly_revenue && isNaN(parseFloat(site.monthly_revenue))) {
      warnings.push({
        row: index + 1,
        field: 'monthly_revenue',
        message: 'Monthly revenue must be a number',
        value: site.monthly_revenue
      });
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data
  };
};

// Validate contract data with detailed errors
export const validateContractData = (data: any[]): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  data.forEach((contract, index) => {
    // Required fields
    if (!contract.site_id) {
      errors.push({
        row: index + 1,
        field: 'site_id',
        message: 'Site ID is required',
        value: contract.site_id
      });
    }
    
    // Date validations
    const dateFields = ['start_date', 'end_date'];
    dateFields.forEach(field => {
      if (contract[field] && !/^\d{4}-\d{2}-\d{2}$/.test(contract[field])) {
        warnings.push({
          row: index + 1,
          field,
          message: `${field} should be in YYYY-MM-DD format`,
          value: contract[field]
        });
      }
    });
    
    // Logical validation
    if (contract.start_date && contract.end_date) {
      const startDate = new Date(contract.start_date);
      const endDate = new Date(contract.end_date);
      
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && startDate > endDate) {
        warnings.push({
          row: index + 1,
          field: 'end_date',
          message: 'End date should be after start date',
          value: `${contract.start_date} > ${contract.end_date}`
        });
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data
  };
};

// Generate comprehensive templates with all fields and examples
export const getClientCSVTemplate = (): string => {
  const headers = [
    'name', 'contact_name', 'email', 'phone', 'address', 'city', 'state', 'postcode', 
    'status', 'notes', 'custom_id'
  ];
  
  const sample1 = [
    'ACME Corporation', 'John Doe', 'john@acme.com', '123-456-7890', 
    '123 Main St', 'New York', 'NY', '10001', 'active', 
    'Large corporate client', 'CL001'
  ];
  
  const sample2 = [
    'XYZ Enterprises', 'Jane Smith', 'jane@xyz.com', '987-654-3210', 
    '456 Business Ave', 'Chicago', 'IL', '60601', 'active', 
    'Small business client', 'CL002'
  ];
  
  return Papa.unparse([sample1, sample2], { header: true, columns: headers });
};

export const getSiteCSVTemplate = (): string => {
  const headers = [
    'name', 'address', 'city', 'state', 'postcode', 'status', 'representative', 
    'phone', 'email', 'client_id', 'custom_id', 'monthly_cost', 'monthly_revenue'
  ];
  
  const sample1 = [
    'Main Office', '456 Business Ave', 'Chicago', 'IL', '60601', 'active', 
    'Jane Smith', '987-654-3210', 'jane@acme.com', 'client-id-here', 'ST001', 
    '1000', '1500'
  ];
  
  const sample2 = [
    'Downtown Branch', '789 Market St', 'San Francisco', 'CA', '94103', 'active', 
    'Bob Johnson', '555-123-4567', 'bob@acme.com', 'client-id-here', 'ST002', 
    '800', '1200'
  ];
  
  return Papa.unparse([sample1, sample2], { header: true, columns: headers });
};

export const getContractCSVTemplate = (): string => {
  const headers = [
    'site_id', 'start_date', 'end_date', 'contract_number', 'renewal_terms', 'termination_period', 'notes'
  ];
  
  const sample1 = [
    'site-id-goes-here', '2023-01-01', '2024-01-01', 'CNT-001', 
    '30 days automatic renewal', '60 days written notice', 
    'Standard service contract'
  ];
  
  const sample2 = [
    'another-site-id', '2023-06-15', '2024-06-14', 'CNT-002', 
    '60 days review period', '90 days written notice', 
    'Premium service level agreement'
  ];
  
  return Papa.unparse([sample1, sample2], { header: true, columns: headers });
};
