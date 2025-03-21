import { SiteStatus } from '../SiteCard';
import { ContactRecord } from '@/lib/types';

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

export type BillingContact = {
  name: string;
  position: string;
  email: string;
  phone: string;
}

export type BillingDetails = {
  rate: string;
  billingFrequency: string;
  paymentTerms: string;
  invoiceMethod: string;
  accountNumber: string;
  purchaseOrderRequired: boolean;
  purchaseOrderNumber: string;
  billingEmail: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingPostcode: string;
  useSiteAddress: boolean;
  contacts: BillingContact[];
  taxId: string;
  xeroContactId: string;
  notes: string;
}

export type AdHocWorkAuthorization = {
  approvalLimit: number;
  approverName: string;
  approverEmail: string;
  approverPhone: string;
  requirePurchaseOrder: boolean;
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
  useClientInfo: boolean;
  subcontractors: Subcontractor[];
  periodicals: Periodicals;
  jobSpecifications: JobSpecifications;
  replenishables: Replenishables;
  securityDetails: SecurityDetails;
  contractDetails: ContractDetails;
  billingDetails: BillingDetails;
  adHocWorkAuthorization: AdHocWorkAuthorization;
  contacts: ContactRecord[];
}

export const requiredFields = {
  basicInformation: ['name', 'address', 'city', 'state', 'postcode', 'representative', 'clientId'],
  contractDetails: ['startDate', 'contractNumber'],
  billingDetails: ['rate', 'billingFrequency', 'paymentTerms'],
  subcontractors: [] // Subcontractors are optional
};

export const isValidEmail = (email: string): boolean => {
  if (!email) return true; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^\+?[0-9\s\-()]{8,}$/;
  return phoneRegex.test(phone);
};

export const getInitialFormData = (): SiteFormData => ({
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
  useClientInfo: false,
  
  subcontractors: [
    {
      businessName: '',
      contactName: '',
      email: '',
      phone: ''
    }
  ],
  
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
  
  jobSpecifications: {
    daysPerWeek: 5,
    hoursPerDay: 3,
    directEmployees: false,
    notes: ''
  },
  
  replenishables: {
    stock: ['', '', '', '', ''],
    contactDetails: ''
  },
  
  securityDetails: {
    accessCode: '',
    alarmCode: '',
    keyLocation: '',
    outOfHoursAccess: false
  },
  
  contractDetails: {
    startDate: '',
    endDate: '',
    contractNumber: '',
    renewalTerms: '',
    terminationPeriod: ''
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
    notes: ''
  },
  
  adHocWorkAuthorization: {
    approvalLimit: 500,
    approverName: '',
    approverEmail: '',
    approverPhone: '',
    requirePurchaseOrder: true
  },
  
  contacts: []
});
