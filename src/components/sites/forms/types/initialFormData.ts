
import { SiteFormData } from './siteFormData';
import { SiteStatus } from '@/types/common';

export function getInitialFormData(): SiteFormData {
  return {
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    postcode: '',  // Include both for compatibility
    country: 'Australia',
    status: 'pending' as SiteStatus,
    siteId: '',
    contacts: [],
    contract_details: {
      contractNumber: '',
      startDate: '',
      endDate: '',
      autoRenewal: false,
      renewalPeriod: '12 months',
      renewalNoticeDays: 30,
      terminationPeriod: '30 days',
      billingCycle: 'monthly',
      serviceFrequency: 'weekly',
      serviceDeliveryMethod: 'on-site',
      terms: []
    },
    billingDetails: {
      billingLines: [],
      useClientInfo: false,
      billingMethod: '',
      paymentTerms: '',
      billingEmail: '',
      billingAddress: {
        line1: '',
        city: '',
        state: '',
        postcode: '',
        country: 'Australia'
      },
      serviceDeliveryType: 'direct',
      contacts: []
    },
    subcontractors: []
  };
}
