
import { SiteFormData, SiteStatus } from './siteFormData';

// Function to get initial form data
export const getInitialFormData = (): SiteFormData => {
  return {
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '', // Using postalCode consistently
    country: 'Australia',
    client_id: '',  // Using client_id consistently
    representative: '',
    status: 'pending' as SiteStatus,
    monthlyRevenue: 0,
    annualRevenue: 0,
    monthlyCost: 0,
    contacts: [],
    contract_details: {  // Using contract_details consistently
      contractType: 'cleaning',
      value: 0,
      startDate: '',
      endDate: '',
      terms: []
    },
    billingDetails: {
      billingFrequency: 'monthly',
      billingLines: [],
      useSiteAddress: true
    },
    replenishables: {
      stock: [],
      supplies: []
    },
    subcontractors: []
  };
};
