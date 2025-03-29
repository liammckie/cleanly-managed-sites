
import { z } from 'zod';

// Import the contractDetailsSchema and other related schemas
import { contractDetailsSchema } from './contractSchema';
import { billingDetailsSchema } from './businessSchema';

// Schema for site form data
export const siteFormSchema = z.object({
  name: z.string().min(1, { message: 'Site name is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  postalCode: z.string().min(1, { message: 'Postal code is required' }),
  country: z.string().default('Australia'),
  client_id: z.string().uuid({ message: 'Client is required' }).optional(),
  client_name: z.string().optional(),
  status: z.enum(['active', 'pending', 'inactive', 'lost', 'on-hold']),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  representative: z.string().optional(),
  customId: z.string().optional(),
  contract_details: contractDetailsSchema.optional(),
  billing_details: billingDetailsSchema.optional(),
  notes: z.string().optional(),
});

// Export the type derived from the schema
export type SiteFormData = z.infer<typeof siteFormSchema>;
