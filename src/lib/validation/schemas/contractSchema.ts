
import { z } from 'zod';
import { isValidDateFormat } from '../core/formatValidators';

/**
 * Schema for contract term validation
 */
export const contractTermSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Term name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  renewalTerms: z.string(),
  terminationPeriod: z.string(),
  autoRenew: z.boolean().default(false),
  description: z.string().optional()
});

/**
 * Schema for contract details validation
 */
export const contractDetailsSchema = z.object({
  id: z.string().optional(),
  contractNumber: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  autoRenewal: z.boolean().default(false),
  renewalPeriod: z.union([z.string(), z.number()]).optional(),
  renewalNoticeDays: z.number().optional(),
  noticeUnit: z.string().optional(),
  terminationPeriod: z.string().optional(),
  renewalTerms: z.string().optional(),
  contractLength: z.number().optional(),
  contractLengthUnit: z.string().optional(),
  serviceFrequency: z.string().optional(),
  serviceDeliveryMethod: z.string().optional(),
  terms: z.array(contractTermSchema).optional(),
  additionalContracts: z.array(z.any()).optional(),
  contractType: z.string().optional(),
  value: z.number().nonnegative("Value must be a positive number").optional(),
  billingCycle: z.enum(['weekly', 'fortnightly', 'monthly', 'quarterly', 'annually', 'once-off']).optional(),
  notes: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional()
});

/**
 * Schema for contract validation
 */
export const contractSchema = z.object({
  id: z.string(),
  siteId: z.string(),
  siteName: z.string().optional(),
  clientId: z.string(),
  clientName: z.string().optional(),
  status: z.string(),
  contractNumber: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  value: z.number().optional(),
  monthlyRevenue: z.number().optional(),
  contractDetails: z.any().optional(),
  autoRenewal: z.boolean().optional(),
  renewalPeriod: z.union([z.string(), z.number()]).optional(),
  renewalNoticeDays: z.number().optional(),
  terminationPeriod: z.string().optional(),
  billingCycle: z.enum(['weekly', 'fortnightly', 'monthly', 'quarterly', 'annually', 'once-off']).optional(),
  serviceFrequency: z.string().optional(),
  serviceDeliveryMethod: z.string().optional(),
  isPrimary: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  site: z.object({
    id: z.string(),
    name: z.string()
  }).optional(),
  client: z.object({
    id: z.string(),
    name: z.string()
  }).optional()
});

/**
 * Validation functions for contracts
 */

/**
 * Create a parsed contract or throw validation errors
 */
export const validateContract = (data: any) => {
  return contractSchema.parse(data);
};

/**
 * Create a parsed contract or return validation result
 */
export const safeValidateContract = (data: any) => {
  return contractSchema.safeParse(data);
};

/**
 * Validate contract details
 */
export const validateContractDetails = (data: any) => {
  return contractDetailsSchema.safeParse(data);
};

/**
 * Manual contract validator for more complex validations
 */
export const manualValidateContract = (contract: any) => {
  const errors: { field: string; message: string }[] = [];
  
  // Check required fields
  if (!contract.siteId) {
    errors.push({ field: 'siteId', message: 'Site ID is required' });
  }
  
  if (!contract.clientId) {
    errors.push({ field: 'clientId', message: 'Client ID is required' });
  }
  
  // Check date formats
  if (contract.startDate && !isValidDateFormat(contract.startDate)) {
    errors.push({ field: 'startDate', message: 'Invalid start date format (use YYYY-MM-DD)' });
  }
  
  if (contract.endDate && !isValidDateFormat(contract.endDate)) {
    errors.push({ field: 'endDate', message: 'Invalid end date format (use YYYY-MM-DD)' });
  }
  
  // Check that end date is after start date
  if (contract.startDate && contract.endDate && 
      isValidDateFormat(contract.startDate) && isValidDateFormat(contract.endDate) &&
      new Date(contract.endDate) <= new Date(contract.startDate)) {
    errors.push({ field: 'endDate', message: 'End date must be after start date' });
  }
  
  // Check that value is positive if provided
  if (contract.value !== undefined && contract.value < 0) {
    errors.push({ field: 'value', message: 'Value must be non-negative' });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
