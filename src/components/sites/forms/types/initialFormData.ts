
import { SiteFormData, SiteStatus } from './siteFormData';

// Function to get initial form data
export const getInitialFormData = (): SiteFormData => {
  return {
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '', // Corrected from postcode
    country: 'Australia',
    client_id: '',  // Corrected from clientId
    representative: '',
    // Changed contactDetails to be included in contact property or removed
    // contactDetails removed
    status: 'pending' as SiteStatus,
    monthlyRevenue: 0,
    annualRevenue: 0,
    monthlyCost: 0,
    contacts: [],
    contract_details: {  // Changed from contractDetails
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
