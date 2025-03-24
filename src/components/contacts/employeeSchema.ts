
import { z } from 'zod';

export const employeeSchema = z.object({
  // Basic contact information
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  department: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  notes: z.string().optional(),
  
  // Employee specific fields
  position: z.string().optional(),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'casual', 'intern']).default('full-time'),
  startDate: z.date().optional(),
  employeeId: z.string().optional(),
  reportingTo: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
