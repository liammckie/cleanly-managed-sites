
import { z } from 'zod';

// Contract term schema
export const contractTermSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Term name is required' }),
  description: z.string().optional(),
  value: z.any().optional(),
  type: z.string().optional()
});

// Contract schema for validation
export const contractSchema = z.object({
  id: z.string().optional(),
  contractNumber: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  autoRenewal: z.boolean().optional(),
  renewalPeriod: z.string().optional(), 
  renewalNoticeDays: z.number().optional(),
  noticeUnit: z.string().optional(),
  serviceFrequency: z.string().optional(),
  serviceDeliveryMethod: z.string().optional(),
  renewalTerms: z.string().optional(),
  terminationPeriod: z.string().optional(),
  value: z.number().optional(),
  billingCycle: z.string().optional(),
  notes: z.string().optional(),
  terms: z.array(contractTermSchema).optional()
});

// Export the type derived from the schema
export type ContractFormData = z.infer<typeof contractSchema>;
export type ContractTermData = z.infer<typeof contractTermSchema>;
