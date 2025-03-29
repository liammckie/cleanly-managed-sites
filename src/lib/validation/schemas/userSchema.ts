
import { z } from 'zod';

// User profile schema for validation
export const userSchema = z.object({
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Valid email is required' }),
  role_id: z.string().uuid({ message: 'Role is required' }).optional(),
  phone: z.string().optional(),
  title: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']).default('active'),
  custom_id: z.string().optional(),
  notes: z.string().optional(),
  territories: z.array(z.string()).optional(),
  avatar_url: z.string().optional(),
  daily_summary: z.boolean().default(false),
});

// Export the type derived from the schema
export type UserFormData = z.infer<typeof userSchema>;
