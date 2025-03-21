
import { SiteStatus } from '../SiteCard';

export type WindowCleaning = {
  frequency: string;
  lastCompleted: string;
  nextScheduled: string;
}

export type SteamCleaning = {
  charges: string;
  frequency: string;
  lastCompleted: string;
}

export type Periodicals = {
  windowCleaning: WindowCleaning;
  steamCleaning: SteamCleaning;
}

export type JobSpecifications = {
  daysPerWeek: number;
  hoursPerDay: number;
  directEmployees: boolean;
  notes: string;
}

export type Replenishables = {
  stock: string[];
  contactDetails: string;
}

export type SecurityDetails = {
  accessCode: string;
  alarmCode: string;
  keyLocation: string;
  outOfHoursAccess: boolean;
}

export type Subcontractor = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
}

export type ContractDetails = {
  startDate: string;
  endDate: string;
  contractNumber: string;
  renewalTerms: string;
  terminationPeriod: string;
}

export type BillingDetails = {
  rate: string;
  billingFrequency: string;
  paymentTerms: string;
  invoiceMethod: string;
  accountNumber: string;
}

export type SiteFormData = {
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
  monthlyCost?: number;
  monthlyRevenue?: number;
  subcontractors: Subcontractor[];
  periodicals: Periodicals;
  jobSpecifications: JobSpecifications;
  replenishables: Replenishables;
  securityDetails: SecurityDetails;
  contractDetails: ContractDetails;
  billingDetails: BillingDetails;
}

// Required fields for each step
export const requiredFields = {
  basicInformation: ['name', 'address', 'city', 'state', 'postcode', 'representative', 'clientId'],
  contractDetails: ['startDate', 'contractNumber'],
  billingDetails: ['rate', 'billingFrequency', 'paymentTerms'],
  subcontractors: [] // Subcontractors are optional
};

// Helper function to validate an email address
export const isValidEmail = (email: string): boolean => {
  if (!email) return true; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate a phone number
export const isValidPhone = (phone: string): boolean => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^\+?[0-9\s\-()]{8,}$/;
  return phoneRegex.test(phone);
};

export const getInitialFormData = (): SiteFormData => ({
  // Basic information
  name: '',
  address: '',
  city: '',
  state: '',
  postcode: '',
  status: 'active' as SiteStatus,
  representative: '',
  phone: '',
  email: '',
  clientId: '',
  monthlyCost: undefined,
  monthlyRevenue: undefined,
  
  // Subcontractor details
  subcontractors: [
    {
      businessName: '',
      contactName: '',
      email: '',
      phone: ''
    }
  ],
  
  // Periodical inclusions
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
    }
  },
  
  // Job specifications
  jobSpecifications: {
    daysPerWeek: 5,
    hoursPerDay: 3,
    directEmployees: false,
    notes: ''
  },
  
  // Replenishables
  replenishables: {
    stock: ['', '', '', '', ''],
    contactDetails: ''
  },
  
  // Security details
  securityDetails: {
    accessCode: '',
    alarmCode: '',
    keyLocation: '',
    outOfHoursAccess: false
  },
  
  // Contract details
  contractDetails: {
    startDate: '',
    endDate: '',
    contractNumber: '',
    renewalTerms: '',
    terminationPeriod: ''
  },
  
  // Billing details
  billingDetails: {
    rate: '',
    billingFrequency: 'monthly',
    paymentTerms: '30 days',
    invoiceMethod: 'email',
    accountNumber: ''
  }
});
