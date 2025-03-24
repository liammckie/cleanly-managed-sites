
import { z } from 'zod';

// Define a schema for the business location documents
export const businessDocumentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Document name is required'),
  type: z.enum(['insurance', 'certification', 'license', 'registration', 'other']),
  file_url: z.string().optional(),
  issue_date: z.date().optional(),
  expiry_date: z.date().optional(),
  reminder_days: z.number().default(30),
  issuer: z.string().optional(),
  document_number: z.string().optional(),
  notes: z.string().optional(),
});

// Define a schema for business location contact points
export const businessLocationContactSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Contact name is required'),
  role: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  is_primary: z.boolean().default(false),
});

// Main business location schema
export const businessLocationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Location name is required'),
  type: z.enum(['head_office', 'branch', 'warehouse', 'other']).default('branch'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().default('Australia'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  is_active: z.boolean().default(true),
  opening_hours: z.string().optional(),
  manager_id: z.string().optional(),
  notes: z.string().optional(),
  documents: z.array(businessDocumentSchema).default([]),
  contacts: z.array(businessLocationContactSchema).default([]),
});

export type BusinessDocument = z.infer<typeof businessDocumentSchema>;
export type BusinessLocationContact = z.infer<typeof businessLocationContactSchema>;
export type BusinessLocation = z.infer<typeof businessLocationSchema>;
