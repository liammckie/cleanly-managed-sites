
import { z } from 'zod';

// Schema for user role permissions
export const userRolePermissionsSchema = z.record(z.boolean());

// Schema for user roles
export const userRoleSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, { message: 'Role name must be at least 2 characters' }),
  description: z.string().optional(),
  permissions: userRolePermissionsSchema,
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  user_count: z.number().optional(),
});

// Schema for user creation/updates
export const userSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email({ message: 'Invalid email address' }),
  full_name: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  avatar_url: z.string().url().optional().or(z.literal('')),
  title: z.string().optional(),
  phone: z.string().optional(),
  custom_id: z.string().optional(),
  note: z.string().optional(),
  notes: z.string().optional(),
  territories: z.array(z.string()).optional(),
  status: z.enum(['active', 'pending', 'inactive']),
  role_id: z.string().uuid().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  last_login: z.string().optional(),
  daily_summary: z.boolean().optional(),
});

// Define the TypeScript types derived from the schemas
export type UserRole = z.infer<typeof userRoleSchema>;
export type UserRolePermissions = z.infer<typeof userRolePermissionsSchema>;
export type User = z.infer<typeof userSchema>;
