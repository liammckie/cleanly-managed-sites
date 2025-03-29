
import { z } from 'zod';

// Client schema for validation
export const clientFormSchema = z.object({
  name: z.string().min(1, { message: 'Client name is required' }),
  contact_name: z.string().min(1, { message: 'Contact name is required' }),
  email: z.string().email({ message: 'Valid email is required' }).optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']).default('active'),
  notes: z.string().optional(),
  customId: z.string().optional(),
});

// Export types derived from the schema
export type ClientFormData = z.infer<typeof clientFormSchema>;

