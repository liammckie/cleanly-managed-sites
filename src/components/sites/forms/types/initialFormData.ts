
import { SiteFormData } from './siteFormData';

// Create initial form data for new site creation
export function getInitialFormData(): SiteFormData {
  return {
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Australia',
    status: 'active',
    phone: '',
    email: '',
    representative: '',
    customId: '',
    contacts: [],
    contractDetails: {
      contractNumber: '',
      startDate: '',
      endDate: '',
      autoRenewal: false,
      renewalPeriod: '12',
      renewalNoticeDays: 30,
      terminationPeriod: '30 days'
    },
    billingDetails: {
      billingFrequency: 'monthly',
      billingLines: []
    },
    subcontractors: [],
    replenishables: {
      stock: [],
      supplies: [],
      notes: ''
    },
    periodicals: {
      items: []
    },
    securityDetails: {
      alarmCode: '',
      keyLocation: '',
      accessNotes: ''
    },
    jobSpecifications: {
      daysPerWeek: 5,
      hoursPerDay: 8,
      directEmployees: 0,
      cleaningFrequency: 'daily',
      serviceDays: '',
      serviceTime: '',
      scopeNotes: ''
    }
  };
}
