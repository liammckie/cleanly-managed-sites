
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
  AdHocWorkAuthorization 
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
