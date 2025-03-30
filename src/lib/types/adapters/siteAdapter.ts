
/**
 * Site Type Adapter
 * Provides consistent mapping between frontend and database site formats
 */
import { typeRegistry } from './typeRegistry';
import { SiteRecord } from '@/lib/types/siteTypes';
import { Json } from '@/lib/types/common';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';

// Define a database site record type to ensure proper mapping
export interface DbSiteRecord {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  status: string;
  representative: string;
  phone?: string;
  email?: string;
  client_id: string;
  user_id: string;
  custom_id?: string;
  created_at: string;
  updated_at: string;
  contract_details?: Json;
  billing_details?: Json;
  monthly_revenue?: number;
  weekly_revenue?: number;
  annual_revenue?: number;
  monthly_cost?: number;
  subcontractors?: Json;
  replenishables?: Json;
  periodicals?: Json;
  job_specifications?: Json;
  security_details?: Json;
  has_subcontractors?: boolean;
  billing_on_hold?: boolean;
  billing_hold_start_date?: string;
  billing_hold_end_date?: string;
}

// Register site type mapping
typeRegistry.register<SiteRecord, DbSiteRecord>({
  name: 'Site',
  fields: [
    { frontend: 'id', database: 'id' },
    { frontend: 'name', database: 'name' },
    { frontend: 'address', database: 'address' },
    { frontend: 'city', database: 'city' },
    { frontend: 'state', database: 'state' },
    { frontend: 'postcode', database: 'postcode' },
    { frontend: 'country', database: 'country' },
    { frontend: 'status', database: 'status' },
    { frontend: 'representative', database: 'representative' },
    { frontend: 'phone', database: 'phone' },
    { frontend: 'email', database: 'email' },
    { frontend: 'clientId', database: 'client_id' },
    { frontend: 'userId', database: 'user_id' },
    { frontend: 'customId', database: 'custom_id' },
    { frontend: 'createdAt', database: 'created_at' },
    { frontend: 'updatedAt', database: 'updated_at' },
    { frontend: 'monthlyRevenue', database: 'monthly_revenue' },
    { frontend: 'weeklyRevenue', database: 'weekly_revenue' },
    { frontend: 'annualRevenue', database: 'annual_revenue' },
    { frontend: 'monthlyCost', database: 'monthly_cost' },
    { frontend: 'hasSubcontractors', database: 'has_subcontractors' },
    { frontend: 'billingOnHold', database: 'billing_on_hold' },
    { frontend: 'billingHoldStartDate', database: 'billing_hold_start_date' },
    { frontend: 'billingHoldEndDate', database: 'billing_hold_end_date' },
    { 
      frontend: 'contractDetails', 
      database: 'contract_details',
      transform: (value, direction) => {
        // Handle JSON serialization
        if (direction === 'toDb') {
          return value as Json;
        }
        return value;
      }
    },
    { 
      frontend: 'billingDetails', 
      database: 'billing_details',
      transform: (value, direction) => {
        if (direction === 'toDb') {
          return value as Json;
        }
        return value;
      }
    },
    { 
      frontend: 'subcontractors', 
      database: 'subcontractors',
      transform: (value, direction) => {
        if (direction === 'toDb') {
          return value as Json;
        }
        return value;
      }
    },
    { 
      frontend: 'replenishables', 
      database: 'replenishables',
      transform: (value, direction) => {
        if (direction === 'toDb') {
          return value as Json;
        }
        return value;
      }
    },
    { 
      frontend: 'periodicals', 
      database: 'periodicals',
      transform: (value, direction) => {
        if (direction === 'toDb') {
          return value as Json;
        }
        return value;
      }
    },
    { 
      frontend: 'jobSpecifications', 
      database: 'job_specifications',
      transform: (value, direction) => {
        if (direction === 'toDb') {
          return value as Json;
        }
        return value;
      }
    },
    { 
      frontend: 'securityDetails', 
      database: 'security_details',
      transform: (value, direction) => {
        if (direction === 'toDb') {
          return value as Json;
        }
        return value;
      }
    }
  ]
});

// Register site form data to DB mapping
typeRegistry.register<SiteFormData, DbSiteRecord>({
  name: 'SiteFormToDb',
  fields: [
    { frontend: 'name', database: 'name' },
    { frontend: 'address', database: 'address' },
    { frontend: 'city', database: 'city' },
    { frontend: 'state', database: 'state' },
    { frontend: 'postalCode', database: 'postcode' },
    { frontend: 'country', database: 'country' },
    { frontend: 'status', database: 'status' },
    { frontend: 'representative', database: 'representative' },
    { frontend: 'phone', database: 'phone' },
    { frontend: 'email', database: 'email' },
    { frontend: 'client_id', database: 'client_id' },
    { frontend: 'clientId', database: 'client_id' },
    { frontend: 'customId', database: 'custom_id' },
    { frontend: 'siteId', database: 'id' },
    { frontend: 'monthlyRevenue', database: 'monthly_revenue' },
    { frontend: 'weeklyRevenue', database: 'weekly_revenue' },
    { frontend: 'annualRevenue', database: 'annual_revenue' },
    { frontend: 'monthlyCost', database: 'monthly_cost' },
    { frontend: 'hasSubcontractors', database: 'has_subcontractors' },
    { 
      frontend: 'contractDetails', 
      database: 'contract_details',
      transform: (value, direction) => {
        if (direction === 'toDb') {
          return value as Json;
        }
        return value;
      }
    },
    { 
      frontend: 'contract_details', 
      database: 'contract_details',
      transform: (value, direction) => {
        if (direction === 'toDb') {
          return value as Json;
        }
        return value;
      }
    },
    { 
      frontend: 'billingDetails', 
      database: 'billing_details',
      transform: (value, direction) => {
        if (direction === 'toDb') {
          return value as Json;
        }
        return value;
      }
    },
    { 
      frontend: 'subcontractors', 
      database: 'subcontractors',
      transform: (value, direction) => {
        if (direction === 'toDb' && Array.isArray(value)) {
          return value.map(sub => ({
            id: sub.id,
            business_name: sub.business_name || sub.name,
            contact_name: sub.contact_name,
            email: sub.email,
            phone: sub.phone,
            services: sub.services,
            is_flat_rate: sub.is_flat_rate || sub.isFlatRate,
            monthly_cost: sub.monthly_cost || sub.monthlyCost,
            notes: sub.notes
          }));
        }
        return value;
      }
    },
    { 
      frontend: 'replenishables', 
      database: 'replenishables',
      transform: (value, direction) => {
        if (direction === 'toDb') {
          return value as Json;
        }
        return value;
      }
    },
    { 
      frontend: 'periodicals', 
      database: 'periodicals',
      transform: (value, direction) => {
        if (direction === 'toDb') {
          return value as Json;
        }
        return value;
      }
    },
    { 
      frontend: 'jobSpecifications', 
      database: 'job_specifications',
      transform: (value, direction) => {
        if (direction === 'toDb') {
          return value as Json;
        }
        return value;
      }
    },
    { 
      frontend: 'securityDetails', 
      database: 'security_details',
      transform: (value, direction) => {
        if (direction === 'toDb') {
          return value as Json;
        }
        return value;
      }
    }
  ]
});

// Create and export site adapters
export const siteAdapter = typeRegistry.createAdapter<SiteRecord, DbSiteRecord>('Site');
export const siteFormAdapter = typeRegistry.createAdapter<SiteFormData, DbSiteRecord>('SiteFormToDb');

// Export adapter functions directly for cleaner imports
export const adaptSiteToDb = siteAdapter.toDb;
export const adaptSiteFromDb = siteAdapter.fromDb;
export const adaptSiteFormToDb = siteFormAdapter.toDb;

// Special case adapter for preparing site data for the database
export function prepareSiteForDb(siteData: SiteFormData): DbSiteRecord {
  const dbSiteData = adaptSiteFormToDb(siteData);
  
  // Handle any special cases not covered by the standard mapping
  return dbSiteData;
}
