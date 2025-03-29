
import { z } from 'zod';

// Contract term schema
const contractTermSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Term name is required' }),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  renewalTerms: z.string().optional(),
  terminationPeriod: z.string().optional(),
  autoRenew: z.boolean().optional(),
  description: z.string().optional(),
  value: z.union([z.number(), z.string()]).optional(),
  type: z.string().optional()
});

// Main contract schema
export const contractSchema = z.object({
  id: z.string().optional(),
  contractNumber: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  autoRenewal: z.boolean().optional(),
  renewalNoticeDays: z.number().optional(),
  renewalLengthMonths: z.number().optional(),
  reviewDate: z.string().optional(),
  annualValue: z.number().optional(),
  terminationClause: z.string().optional(),
  noticePeriodDays: z.number().optional(),
  nextIncreaseDate: z.string().optional(),
  specialTerms: z.string().optional(),
  value: z.number().optional(),
  billingCycle: z.string().optional(),
  contractType: z.string().optional(),
  terminationPeriod: z.string().optional(),
  renewalTerms: z.string().optional(),
  contractLength: z.number().optional(),
  contractLengthUnit: z.string().optional(),
  renewalPeriod: z.string().optional(),
  renewalNotice: z.number().optional(),
  noticeUnit: z.string().optional(),
  serviceFrequency: z.string().optional(),
  serviceDeliveryMethod: z.string().optional(),
  notes: z.string().optional(),
  terms: z.array(contractTermSchema).optional()
});

// Export types
export type ContractTerm = z.infer<typeof contractTermSchema>;
export type ContractDetails = z.infer<typeof contractSchema>;
