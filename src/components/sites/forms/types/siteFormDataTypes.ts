
import { SiteStatus } from '../../SiteCard';
import { ContactRecord } from '@/lib/types';
import { 
  Periodicals, 
  JobSpecifications, 
  Replenishables, 
  SecurityDetails, 
  Subcontractor, 
  ContractDetails, 
  BillingDetails, 
  AdHocWorkAuthorization,
  ContractType
} from './index';

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
  customId?: string;
  monthlyCost?: number;
  monthlyRevenue?: number;
  weeklyRevenue?: number; // Add weekly revenue
  annualRevenue?: number; // Add annual revenue
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
  // Add support for multiple contracts
  additionalContracts?: ContractDetails[];
}

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
  customId: '',
  monthlyCost: undefined,
  monthlyRevenue: undefined,
  weeklyRevenue: undefined,
  annualRevenue: undefined,
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
    },
    tasks: []
  },
  
  jobSpecifications: {
    daysPerWeek: 5,
    hoursPerDay: 3,
    directEmployees: true,
    notes: '',
    requiresSpecialEquipment: false,
    equipmentDetails: '',
    cleaningInstructions: '',
    areas: [],
    workingDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    serviceDeliveryType: 'direct', // Add service delivery type
    annualContractorCost: 0 // Add annual contractor cost
  },
  
  replenishables: {
    stock: ['', '', '', '', ''],
    contactDetails: '',
    supplies: []
  },
  
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
    cameraDetails: ''
  },
  
  contractDetails: {
    startDate: '',
    endDate: '',
    contractNumber: '',
    renewalTerms: '',
    terminationPeriod: '',
    contractType: 'cleaning', // Default to cleaning
    terms: []
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
    billingLines: [],
    weeklyBudget: 0,
    laborPlan: {
      workingDays: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false
      },
      shiftStartTime: '',
      shiftEndTime: '',
      notes: ''
    }
  },
  
  adHocWorkAuthorization: {
    approvalLimit: 500,
    approverName: '',
    approverEmail: '',
    approverPhone: '',
    requirePurchaseOrder: true
  },
  
  contacts: [],
  
  // Initialize with empty additional contracts array
  additionalContracts: []
});
