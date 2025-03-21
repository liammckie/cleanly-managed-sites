
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
  subcontractors: Subcontractor[];
  periodicals: Periodicals;
  jobSpecifications: JobSpecifications;
  replenishables: Replenishables;
  securityDetails: SecurityDetails;
  contractDetails: ContractDetails;
  billingDetails: BillingDetails;
}

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
