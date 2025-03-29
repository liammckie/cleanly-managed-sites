
import { z } from 'zod';

// Billing address schema
const billingAddressSchema = z.object({
  street: z.string().optional(),
  line1: z.string().optional(), // For compatibility
  city: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().default('Australia')
});

// Billing line schema
const billingLineSchema = z.object({
  id: z.string(),
  description: z.string().min(1, { message: 'Description is required' }),
  amount: z.number(),
  frequency: z.enum(['weekly', 'monthly', 'quarterly', 'annually']),
  isRecurring: z.boolean().optional(),
  onHold: z.boolean().optional(),
  weeklyAmount: z.number().optional(),
  monthlyAmount: z.number().optional(),
  annualAmount: z.number().optional()
});

// Billing contact schema
const billingContactSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.string().min(1, { message: 'Role is required' }),
  department: z.string().optional(),
  isPrimary: z.boolean().optional(),
  is_primary: z.boolean().optional(),
  notes: z.string().optional()
});

// Billing details schema
export const billingDetailsSchema = z.object({
  billingAddress: billingAddressSchema.optional(),
  useClientInfo: z.boolean().optional(),
  billingMethod: z.string().optional(),
  paymentTerms: z.string().optional(),
  billingEmail: z.string().email().optional(),
  billingLines: z.array(billingLineSchema).optional(),
  serviceType: z.string().optional(),
  deliveryMethod: z.string().optional(),
  serviceDeliveryType: z.enum(['direct', 'contractor']).optional(),
  contractorCostFrequency: z.string().optional(),
  weeklyContractorCost: z.number().optional(),
  monthlyContractorCost: z.number().optional(),
  annualContractorCost: z.number().optional(),
  contractorInvoiceFrequency: z.string().optional(),
  weeklyBudget: z.number().optional(),
  rate: z.string().optional(),
  xeroContactId: z.string().optional(),
  contacts: z.array(billingContactSchema).optional()
});

// Export types
export type BillingAddress = z.infer<typeof billingAddressSchema>;
export type BillingLine = z.infer<typeof billingLineSchema>;
export type BillingContact = z.infer<typeof billingContactSchema>;
export type BillingDetails = z.infer<typeof billingDetailsSchema>;
