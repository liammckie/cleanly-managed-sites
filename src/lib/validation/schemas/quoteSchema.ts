
import { z } from 'zod';

// Quote schema for validation
export const quoteSchema = z.object({
  name: z.string().min(1, { message: 'Quote name is required' }),
  client_name: z.string().optional(),
  site_name: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['draft', 'pending', 'accepted', 'rejected', 'expired']).default('draft'),
  overhead_percentage: z.number().min(0).max(100).default(15),
  margin_percentage: z.number().min(0).max(100).default(20),
  quote_number: z.string().optional(),
  valid_until: z.string().optional(),
  client_id: z.string().uuid().optional(),
  site_id: z.string().uuid().optional()
});

// Quote shift schema
export const quoteShiftSchema = z.object({
  id: z.string().optional(),
  quoteId: z.string().optional(),
  day: z.string().min(1, { message: 'Day is required' }),
  startTime: z.string().min(1, { message: 'Start time is required' }),
  endTime: z.string().min(1, { message: 'End time is required' }),
  breakDuration: z.number().min(0).default(30),
  numberOfCleaners: z.number().min(1).default(1),
  employmentType: z.string().min(1, { message: 'Employment type is required' }),
  level: z.number().min(1).max(5),
  allowances: z.array(z.string()).optional().default([]),
  estimatedCost: z.number().optional(),
  location: z.string().optional(),
  notes: z.string().optional()
});

// Quote subcontractor schema
export const quoteSubcontractorSchema = z.object({
  id: z.string().optional(),
  quoteId: z.string().optional(),
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  cost: z.number().min(0),
  frequency: z.string().default('monthly'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  service: z.string().optional(),
  notes: z.string().optional()
});

// Export types derived from the schemas
export type QuoteFormData = z.infer<typeof quoteSchema>;
export type QuoteShiftData = z.infer<typeof quoteShiftSchema>;
export type QuoteSubcontractorData = z.infer<typeof quoteSubcontractorSchema>;
