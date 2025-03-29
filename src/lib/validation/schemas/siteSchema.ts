
import { z } from 'zod';
import { contractSchema } from './contractSchema';
import { billingDetailsSchema } from './billingSchema';

// Define SiteStatus enum
const SiteStatusEnum = z.enum(['active', 'pending', 'inactive', 'lost', 'on-hold']);

// Contact schema for site contacts
const siteContactSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Contact name is required' }),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.string().min(1, { message: 'Role is required' }),
  department: z.string().optional(),
  isPrimary: z.boolean().optional(),
  is_primary: z.boolean().optional(),
  notes: z.string().optional()
});

// Main site schema
export const siteSchema = z.object({
  name: z.string().min(1, { message: 'Site name is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  postalCode: z.string().min(1, { message: 'Postal code is required' }),
  postcode: z.string().optional(), // Alias for postalCode
  country: z.string().default('Australia'),
  status: SiteStatusEnum,
  client_id: z.string().uuid({ message: 'Client is required' }).optional(),
  clientId: z.string().optional(), // Alias for client_id
  phone: z.string().optional(),
  email: z.string().email().optional(),
  representative: z.string().optional(),
  customId: z.string().optional(),
  siteId: z.string().optional(), // For edit mode
  contacts: z.array(siteContactSchema).optional().default([]),
  primary_contact: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    role: z.string().optional()
  }).optional(),
  contract_details: z.any().optional(), // Will be validated separately
  contractDetails: z.any().optional(), // Alias
  useClientInfo: z.boolean().optional(),
  billingDetails: z.any().optional(), // Will be validated separately
  additionalContracts: z.array(z.any()).optional(),
  subcontractors: z.array(z.any()).optional(),
  hasSubcontractors: z.boolean().optional(),
  monthlyCost: z.number().optional(),
  weeklyRevenue: z.number().optional(),
  monthlyRevenue: z.number().optional(),
  annualRevenue: z.number().optional(),
  notes: z.string().optional()
});

// Type definition
export type SiteFormData = z.infer<typeof siteSchema>;

// Validation errors type
export type SiteFormValidationErrors = string[];
