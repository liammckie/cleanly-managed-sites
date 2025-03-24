
import { SiteFormData } from './siteFormData';
import { SiteStatus } from '../../SiteCard';

// Function to get initial form data
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
  customId: '', // Initialize empty custom ID
  weeklyRevenue: undefined,
  monthlyRevenue: undefined,
  annualRevenue: undefined,
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
    cleaningFrequency: 'daily',
    customFrequency: '',
    serviceDays: '',
    serviceTime: '',
    estimatedHours: '',
    equipmentRequired: '',
    scopeNotes: '',
    serviceDeliveryType: 'direct',
    annualContractorCost: 0
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
    tasks: [],
    carpet: {
      cleaning: false,
      shampooing: false
    },
    floor: {
      buffing: false,
      stripping: false
    },
    windows: {
      internal: false,
      external: false
    },
    highLevel: {
      dusting: false
    },
    additional: {
      upholstery: false,
      pressureWashing: false
    },
    notes: ''
  },
  
  replenishables: {
    stock: ['', '', '', '', ''],
    contactDetails: '',
    supplies: [],
    notes: ''
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
    contractType: 'cleaning', // Updated to use a valid ContractType
    noticePeriod: '',
    notes: '',
    terms: [], // Initialize with empty terms array
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
    annualForecast: '',
    serviceDeliveryType: 'direct', // Service delivery type field
    annualContractorCost: 0, // Annual contractor cost field
    weeklyContractorCost: 0, // Weekly contractor cost field
    monthlyContractorCost: 0, // Monthly contractor cost field
    contractorCostFrequency: 'annually', // Frequency for cost entry
    contractorInvoiceFrequency: 'monthly', // Contractor invoice frequency
    weeklyBudget: 0, // Weekly budget for direct employees
    laborPlan: { // Labor plan for direct employees
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
    },
    billingLines: [{
      id: crypto.randomUUID(),
      description: 'General Contract Cleaning',
      amount: 0,
      frequency: 'monthly',
      isRecurring: true
    }], // Initialize with default general cleaning line
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
  additionalContracts: [], // Initialize with empty array
});
