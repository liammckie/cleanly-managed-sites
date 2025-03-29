
import { z } from 'zod';

// Business details schema
export const businessDetailsSchema = z.object({
  name: z.string().min(1, { message: 'Business name is required' }),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
  tax_id: z.string().optional(),
  industry: z.string().optional(),
  description: z.string().optional(),
  business_hours: z.string().optional(),
  social_media: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional()
  }).optional()
});

// Export the type derived from the schema
export type BusinessDetailsFormData = z.infer<typeof businessDetailsSchema>;
