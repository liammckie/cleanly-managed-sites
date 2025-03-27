
import { z } from 'zod';

// Schema for social media links
export const socialMediaSchema = z.object({
  facebook: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
});

// Schema for business details form data
export const businessFormSchema = z.object({
  name: z.string().min(1, { message: 'Business name is required' }),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
  website: z.string().url({ message: 'Invalid website URL' }).optional().or(z.literal('')),
  tax_id: z.string().optional(),
  industry: z.string().optional(),
  description: z.string().optional(),
  business_hours: z.string().optional(),
  social_media: socialMediaSchema.optional(),
});

// Define the TypeScript types derived from the schemas
export type SocialMedia = z.infer<typeof socialMediaSchema>;
export type BusinessFormData = z.infer<typeof businessFormSchema>;
