
import { z } from 'zod';

// Schema for client form data
export const clientFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, { message: 'Client name is required' }),
  contact_name: z.string().min(1, { message: 'Contact name is required' }),
  email: z.string().email({ message: 'Valid email is required' }).or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']),
  notes: z.string().optional(),
  customId: z.string().optional(),
  custom_id: z.string().optional() // Alias for customId
});

// Define the TypeScript types derived from the schema
export type ClientFormData = z.infer<typeof clientFormSchema>;
