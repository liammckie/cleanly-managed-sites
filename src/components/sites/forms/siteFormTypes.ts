
import { SiteRecord, ContactRecord, ClientRecord } from '@/lib/types';
import { SecurityDetails } from './types/securityTypes';
import { JobSpecifications } from './types/jobSpecificationTypes';
import { Periodicals } from './types/periodicalTypes';
import { Replenishables } from './types/replenishableTypes';
import { ContractDetails } from './types/contractTypes';
import { BillingDetails } from './types/billingTypes';
import { SiteContact } from './types/contactTypes';
import { Subcontractor } from './types/subcontractorTypes';
import { SiteStatus } from '@/components/sites/SiteCard';

// Main form data type
export interface SiteFormData {
  // Basic information
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  status: SiteStatus;
  representative: string;
  phone: string;
  email: string;
  clientId: string;
  customId?: string; // Add custom ID field
  
  // Optional financial fields
  monthlyCost?: number;
  monthlyRevenue?: number;
  
  // Client data integration flag
  useClientInfo: boolean;
  
  // Extended information (stored as JSON)
  securityDetails: SecurityDetails;
  jobSpecifications: JobSpecifications;
  periodicals: Periodicals;
  replenishables: Replenishables;
  contractDetails: ContractDetails;
  billingDetails: BillingDetails;
  
  // Related entities
  contacts: SiteContact[];
  subcontractors: Subcontractor[];
}

// Function to get initial form data
export const getInitialFormData = (): SiteFormData => ({
  name: '',
  address: '',
  city: '',
  state: '',
  postcode: '',
  status: 'active',
  representative: '',
  phone: '',
  email: '',
  clientId: '',
  customId: '', // Initialize empty custom ID
  useClientInfo: false,
  
  // Initialize JSON objects with default values
  securityDetails: {
    needsAlarmCode: false,
    alarmCode: '',
    needsKey: false,
    keyLocation: '',
    hasSecurity: false,
    securityNotes: '',
    hasCamera: false,
    cameraDetails: '',
  },
  
  jobSpecifications: {
    requiresSpecialEquipment: false,
    equipmentDetails: '',
    cleaningInstructions: '',
    notes: '',
    areas: []
  },
  
  periodicals: {
    tasks: []
  },
  
  replenishables: {
    supplies: []
  },
  
  contractDetails: {
    startDate: '',
    endDate: '',
    renewalDate: '',
    contractValue: '',
    paymentTerms: '',
    paymentFrequency: 'monthly',
    contractType: 'ongoing',
    noticePeriod: '',
    notes: '',
  },
  
  billingDetails: {
    billingContact: '',
    billingEmail: '',
    billingPhone: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingPostcode: '',
    billingMethod: 'invoice',
    purchaseOrderRequired: false,
    purchaseOrderNumber: '',
    contacts: [],
  },
  
  contacts: [],
  subcontractors: [],
});

export interface SiteFormValidationErrors {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  representative?: string;
  clientId?: string;
  customId?: string; // Add validation for custom ID
}
