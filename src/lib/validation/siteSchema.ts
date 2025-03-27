
import { z } from 'zod';

// Schema for billing address
export const billingAddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().default('Australia'),
});

// Schema for billing line
export const billingLineSchema = z.object({
  id: z.string(),
  description: z.string().min(1, { message: 'Description is required' }),
  amount: z.number().nonnegative({ message: 'Amount must be a positive number' }),
  frequency: z.enum(['weekly', 'monthly', 'quarterly', 'annually']),
  isRecurring: z.boolean().default(true),
  onHold: z.boolean().default(false),
  weeklyAmount: z.number().optional(),
  monthlyAmount: z.number().optional(),
  annualAmount: z.number().optional(),
});

// Schema for billing details
export const billingDetailsSchema = z.object({
  billingAddress: billingAddressSchema.optional(),
  useClientInfo: z.boolean().default(false),
  billingMethod: z.string().optional(),
  paymentTerms: z.string().optional(),
  billingEmail: z.string().email().optional().or(z.literal('')),
  billingLines: z.array(billingLineSchema).default([]),
  serviceType: z.string().optional(),
  deliveryMethod: z.string().optional(),
  serviceDeliveryType: z.enum(['direct', 'contractor']).optional().default('direct'),
  contractorCostFrequency: z.string().optional(),
  weeklyContractorCost: z.number().optional(),
  monthlyContractorCost: z.number().optional(),
  annualContractorCost: z.number().optional(),
  contractorInvoiceFrequency: z.string().optional(),
  weeklyBudget: z.number().optional(),
  rate: z.string().optional(),
  xeroContactId: z.string().optional(),
});

// Schema for contract details
export const contractDetailsSchema = z.object({
  id: z.string().optional(),
  contractNumber: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  autoRenewal: z.boolean().optional(),
  contractLength: z.number().optional(),
  contractLengthUnit: z.string().optional(),
  contractType: z.string().optional(),
  renewalPeriod: z.string().optional(), // Changed from number to string to match DTO
  renewalNoticeDays: z.number().optional(),
  noticeUnit: z.string().optional(),
  serviceFrequency: z.string().optional(),
  serviceDeliveryMethod: z.string().optional(),
  renewalTerms: z.string().optional(),
  terminationPeriod: z.string().optional(),
  value: z.number().optional(),
  billingCycle: z.string().optional(),
  notes: z.string().optional(),
});

// Schema for security details
export const securityDetailsSchema = z.object({
  keyLocation: z.string().optional(),
  alarmCode: z.string().optional(),
  securityContact: z.string().optional(),
  specialAccess: z.string().optional(),
  notes: z.string().optional(),
});

// Schema for job specifications
export const jobSpecificationsSchema = z.object({
  daysPerWeek: z.number().optional(),
  hoursPerDay: z.number().optional(),
  directEmployees: z.number().optional(),
  notes: z.string().optional(),
  cleaningFrequency: z.string().optional(),
  customFrequency: z.string().optional(),
  serviceDays: z.string().optional(),
  serviceTime: z.string().optional(),
  estimatedHours: z.string().optional(),
  equipmentRequired: z.string().optional(),
  scopeNotes: z.string().optional(),
  weeklyContractorCost: z.number().optional(),
  monthlyContractorCost: z.number().optional(),
  annualContractorCost: z.number().optional(),
});

// Schema for site contact
export const siteContactSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  role: z.string().min(1, { message: 'Role is required' }),
  isPrimary: z.boolean().optional(),
  department: z.string().optional(),
  notes: z.string().optional(),
});

// Schema for site form data
export const siteFormSchema = z.object({
  name: z.string().min(1, { message: 'Site name is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  postalCode: z.string().min(1, { message: 'Postal code is required' }),
  postcode: z.string().optional(), // Alias for postalCode
  country: z.string().default('Australia'),
  client_id: z.string().uuid({ message: 'Client is required' }).optional(),
  clientId: z.string().uuid().optional(), // Alias for client_id
  client_name: z.string().optional(),
  status: z.enum(['active', 'pending', 'inactive', 'lost', 'on-hold']),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  representative: z.string().optional(),
  customId: z.string().optional(),
  contacts: z.array(siteContactSchema).optional().default([]),
  primary_contact: z.object({
    name: z.string(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    role: z.string(),
  }).optional(),
  contract_details: contractDetailsSchema.optional(),
  contractDetails: contractDetailsSchema.optional(), // Alias for contract_details
  useClientInfo: z.boolean().optional(),
  billingDetails: billingDetailsSchema.optional().default({}),
  additionalContracts: z.array(contractDetailsSchema).optional(),
  subcontractors: z.array(z.any()).optional(),
  hasSubcontractors: z.boolean().optional(),
  monthlyCost: z.number().optional(),
  weeklyRevenue: z.number().optional(),
  monthlyRevenue: z.number().optional(),
  annualRevenue: z.number().optional(),
  replenishables: z.object({
    stock: z.array(z.any()).optional(),
    supplies: z.array(z.any()).optional(),
    notes: z.string().optional(),
  }).optional(),
  periodicals: z.any().optional(),
  adHocWorkAuthorization: z.any().optional(),
  securityDetails: securityDetailsSchema.optional(),
  jobSpecifications: jobSpecificationsSchema.optional(),
  locationDetails: z.object({
    floor: z.string().optional(),
    building: z.string().optional(),
    suite: z.string().optional(),
    propertyType: z.string().optional(),
    accessHours: z.string().optional(),
    keyLocation: z.string().optional(),
    parkingDetails: z.string().optional(),
    siteSize: z.string().optional(),
    siteSizeUnit: z.enum(['sqft', 'sqm']).optional(),
  }).optional(),
  notes: z.string().optional(),
});

// Define the TypeScript types derived from the schemas
export type BillingAddress = z.infer<typeof billingAddressSchema>;
export type BillingLine = z.infer<typeof billingLineSchema>;
export type BillingDetails = z.infer<typeof billingDetailsSchema>;
export type ContractDetails = z.infer<typeof contractDetailsSchema>;
export type SecurityDetails = z.infer<typeof securityDetailsSchema>;
export type JobSpecifications = z.infer<typeof jobSpecificationsSchema>;
export type SiteContact = z.infer<typeof siteContactSchema>;
export type SiteFormData = z.infer<typeof siteFormSchema>;
