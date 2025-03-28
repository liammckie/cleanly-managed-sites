
import { z } from 'zod';
import { ContractStatus, BillingFrequency } from '@/types/common';

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
  billingCycle: z.enum(['weekly', 'fortnightly', 'monthly', 'quarterly', 'annually', 'once-off'] as [string, ...string[]]).optional(),
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
  billingCycle: z.enum(['weekly', 'fortnightly', 'monthly', 'quarterly', 'annually', 'once-off'] as [string, ...string[]]).optional(),
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
 * Create a parsed contract or throw validation errors
 * @param data Contract data to validate
 * @returns Validated contract data
 */
export function validateContract(data: any) {
  return contractSchema.parse(data);
}

/**
 * Create a parsed contract or return validation errors
 * @param data Contract data to validate
 * @returns Validation result with success flag and data/errors
 */
export function safeValidateContract(data: any) {
  const result = contractSchema.safeParse(data);
  return result;
}

/**
 * Validate contract details form data
 * @param data Contract details form data
 * @returns Validation result with success flag and data/errors
 */
export function validateContractDetails(data: any) {
  return contractDetailsSchema.safeParse(data);
}
