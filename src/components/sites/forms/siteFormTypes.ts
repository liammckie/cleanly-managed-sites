import { SiteRecord, ContactRecord, ClientRecord } from '@/lib/types';
import { SecurityDetails } from './types/securityTypes';
import { JobSpecifications } from './types/jobSpecificationTypes';
import { Periodicals } from './types/periodicalTypes';
import { Replenishables } from './types/replenishableTypes';
import { ContractDetails } from './types/contractTypes';
import { BillingDetails, AdHocWorkAuthorization } from './types/billingTypes';
import { SiteContact, BillingContact } from './types/contactTypes';
import { Subcontractor } from './types/subcontractorTypes';
import { SiteStatus } from '@/components/sites/SiteCard';

// Export BillingContact for use in other modules
export { BillingContact };

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
  adHocWorkAuthorization: AdHocWorkAuthorization;
  
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
    accessCode: '',
    alarmCode: '',
    keyLocation: '',
    outOfHoursAccess: false,
    needsAlarmCode: false,
    needsKey: false,
    hasSecurity: false,
    securityNotes: '',
    hasCamera: false,
    cameraDetails: '',
  },
  
  jobSpecifications: {
    daysPerWeek: 5,
    hoursPerDay: 3,
    directEmployees: false,
    notes: '',
    requiresSpecialEquipment: false,
    equipmentDetails: '',
    cleaningInstructions: '',
    areas: []
  },
  
  periodicals: {
    windowCleaning: {
      frequency: 'quarterly',
      lastCompleted: '',
      nextScheduled: ''
    },
    steamCleaning: {
      charges: '',
      frequency: 'semi-annually',
      lastCompleted: ''
    },
    tasks: []
  },
  
  replenishables: {
    stock: ['', '', '', '', ''],
    contactDetails: '',
    supplies: []
  },
  
  contractDetails: {
    startDate: '',
    endDate: '',
    contractNumber: '',
    renewalTerms: '',
    terminationPeriod: '',
    renewalDate: '',
    contractValue: '',
    paymentTerms: '',
    paymentFrequency: 'monthly',
    contractType: 'ongoing',
    noticePeriod: '',
    notes: '',
  },
  
  billingDetails: {
    rate: '',
    billingFrequency: 'monthly',
    paymentTerms: '30 days',
    invoiceMethod: 'email',
    accountNumber: '',
    purchaseOrderRequired: false,
    purchaseOrderNumber: '',
    billingEmail: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingPostcode: '',
    useSiteAddress: true,
    contacts: [],
    taxId: '',
    xeroContactId: '',
    notes: '',
    billingContact: '',
    billingPhone: '',
  },
  
  adHocWorkAuthorization: {
    approvalLimit: 500,
    approverName: '',
    approverEmail: '',
    approverPhone: '',
    requirePurchaseOrder: true
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
