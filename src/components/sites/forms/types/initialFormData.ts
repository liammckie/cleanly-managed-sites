
import { SiteFormData } from './siteFormData';
import { SiteStatus } from '@/lib/types/commonTypes';

export const getInitialFormData = (): SiteFormData => ({
  name: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'Australia',
  status: 'active' as SiteStatus,
  phone: '',
  email: '',
  representative: '',
  customId: '',
  primary_contact: {
    name: '',
    email: '',
    phone: '',
    role: 'site_manager'
  },
  contacts: [],
  contract_details: {
    contractNumber: '',
    startDate: '',
    endDate: '',
    terminationPeriod: '30 days',
    renewalTerms: '',
    autoRenewal: false,
    contractType: 'cleaning',
    value: 0
  },
  billingDetails: {
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingPostcode: '',
    billingEmail: '',
    billingPhone: '',
    billingLines: [],
    billingFrequency: 'monthly',
    useSiteAddress: false,
    // Include additional fields required by BillingDetails
    billingOnHold: false,
    billingHoldStartDate: '',
    billingHoldEndDate: '',
    billingHoldReason: '',
    invoiceMethod: 'email',
    purchaseOrderRequired: false,
    purchaseOrderNumber: '',
    accountNumber: '',
    taxId: '',
    notes: '',
    weeklyContractorCost: 0,
    monthlyContractorCost: 0,
    annualContractorCost: 0,
    weeklyBudget: 0,
    serviceType: 'regular',
    deliveryMethod: 'direct',
    contractorCostFrequency: 'monthly',
    contractorInvoiceFrequency: 'monthly'
  },
  useClientInfo: false,
  additionalContracts: [],
  subcontractors: [],
  replenishables: {
    stock: [],
    supplies: [],
    notes: ''
  },
  monthlyCost: 0,
  weeklyRevenue: 0,
  monthlyRevenue: 0,
  annualRevenue: 0,
  periodicals: {
    monthly: [],
    quarterly: [],
    biannual: [],
    annual: []
  },
  adHocWorkAuthorization: {
    approvalRequired: true,
    approvalLimit: 0,
    approvers: []
  },
  securityDetails: {
    alarmCode: '',
    alarmInstructions: '',
    keyLocation: '',
    accessNotes: ''
  },
  jobSpecifications: {
    daysPerWeek: 5,
    hoursPerDay: 8,
    directEmployees: 1,
    notes: '',
    cleaningFrequency: 'daily',
    serviceDays: 'Monday-Friday',
    serviceTime: '9:00 AM - 5:00 PM',
    estimatedHours: '40',
    equipmentRequired: '',
    scopeNotes: ''
  }
});
