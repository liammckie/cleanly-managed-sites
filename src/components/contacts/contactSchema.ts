
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  department: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  notes: z.string().optional(),
  is_primary: z.boolean().default(false),
});

export const entityTypes = ['client', 'site', 'supplier', 'internal'] as const;
export type EntityType = typeof entityTypes[number];

export const assignmentTypes = ['single', 'all_sites', 'all_clients'] as const;
export type AssignmentType = typeof assignmentTypes[number];

export type ContactFormValues = z.infer<typeof contactSchema>;
