
import { SiteFormData, SiteStatus } from './siteFormData';

// Function to get initial form data
export const getInitialFormData = (): SiteFormData => {
  return {
    name: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
    country: 'Australia',
    clientId: '',
    representative: '',
    contactDetails: {
      email: '',
      phone: '',
      notes: ''
    },
    status: 'pending',
    monthlyRevenue: 0,
    annualRevenue: 0,
    monthlyCost: 0,
    contacts: []
  };
};
