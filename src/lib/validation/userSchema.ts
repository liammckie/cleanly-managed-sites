
import { z } from 'zod';
import { UserStatus } from '@/types/common';

// Basic user schema for validation
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  status: z.union([
    z.literal('active'),
    z.literal('pending'),
    z.literal('inactive')
  ]).default('active'),
  role_id: z.string().uuid('Invalid role ID'),
  avatar_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  phone: z.string().optional(),
  title: z.string().optional(),
  notes: z.string().optional(),
  territories: z.array(z.string()).optional(),
  custom_id: z.string().optional(),
  daily_summary: z.boolean().optional()
});

// User profile schema that extends userSchema
export const userProfileSchema = userSchema.extend({
  id: z.string().uuid('Invalid user ID').optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  last_login: z.string().optional(),
});

// User role schema for role validation
export const userRoleSchema = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters'),
  description: z.string().optional(),
  permissions: z.record(z.boolean()).or(z.record(z.string().transform(val => val === 'true'))),
  id: z.string().uuid('Invalid role ID').optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// User invitation schema for sending invitations
export const userInviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  role_id: z.string().uuid('Invalid role ID'),
  title: z.string().optional(),
  territories: z.array(z.string()).optional(),
});

// Types derived from schemas
export type UserSchemaType = z.infer<typeof userSchema>;
export type UserProfileSchemaType = z.infer<typeof userProfileSchema>;
export type UserRoleSchemaType = z.infer<typeof userRoleSchema>;
export type UserInviteSchemaType = z.infer<typeof userInviteSchema>;
