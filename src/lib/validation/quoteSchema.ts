
import { z } from 'zod';

// Schema for quotes
export const quoteSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional(),
  name: z.string().min(1, { message: 'Quote name is required' }),
  description: z.string().optional(),
  clientName: z.string().min(1, { message: 'Client name is required' }),
  siteName: z.string().optional(),
  status: z.enum(['draft', 'submitted', 'approved', 'declined', 'expired']).default('draft'),
  laborCost: z.number().nonnegative(),
  overheadPercentage: z.number().nonnegative(),
  marginPercentage: z.number().nonnegative(),
  marginAmount: z.number().optional(),
  overheadCost: z.number().optional(),
  totalCost: z.number().optional(),
  subcontractorCost: z.number().nonnegative(),
  totalPrice: z.number().nonnegative(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  expiryDate: z.string().optional(),
  contractLength: z.number().optional(),
  contractLengthUnit: z.string().optional(),
  quoteNumber: z.string().optional(),
  validUntil: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Schema for overhead profiles
export const overheadProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  laborPercentage: z.number().nonnegative(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string().uuid().optional(),
});

// Define the TypeScript types derived from the schemas
export type Quote = z.infer<typeof quoteSchema>;
export type OverheadProfile = z.infer<typeof overheadProfileSchema>;
