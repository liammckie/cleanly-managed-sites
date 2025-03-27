
import { z } from 'zod';

// Enum values
export const entityTypeEnum = z.enum(['client', 'site', 'supplier', 'internal']);
export const assignmentTypeEnum = z.enum(['single', 'all_sites', 'all_clients']);

// Schema for contact form data
export const contactFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, { message: 'Name is required' }),
  role: z.string().min(1, { message: 'Role is required' }),
  department: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
  phone: z.string().optional(),
  notes: z.string().optional(),
  is_primary: z.boolean().default(false),
  entity_type: entityTypeEnum.optional(),
  entity_id: z.string().optional(),
  services: z.record(z.any()).optional(),
});

// Schema for employee-specific fields
export const employeeServicesSchema = z.object({
  position: z.string().optional(),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'casual', 'intern']).default('full-time'),
  startDate: z.string().optional(), // Store as ISO string
  employeeId: z.string().optional(),
  reportingTo: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

// Schema for employee form data
export const employeeFormSchema = contactFormSchema.extend({
  position: z.string().optional(),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'casual', 'intern']).default('full-time'),
  startDate: z.date().optional(),
  employeeId: z.string().optional(),
  reportingTo: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

// Define the TypeScript types derived from the schemas
export type EntityType = z.infer<typeof entityTypeEnum>;
export type AssignmentType = z.infer<typeof assignmentTypeEnum>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type EmployeeServices = z.infer<typeof employeeServicesSchema>;
export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
