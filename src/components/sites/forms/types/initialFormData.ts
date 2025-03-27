
import { SiteFormData } from './siteFormData';

export function getInitialFormData(): SiteFormData {
  return {
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Australia',
    status: 'active',
    contacts: [],
    notes: '',
    locationDetails: {
      floor: '',
      building: '',
      suite: '',
      propertyType: '',
      accessHours: '',
      keyLocation: '',
      parkingDetails: '',
      siteSize: '',
      siteSizeUnit: 'sqm',
    },
    billingDetails: {
      billingLines: [],
      useClientInfo: false,
      billingMethod: '',
      paymentTerms: '',
      billingAddress: {
        street: '',
        city: '',
        state: '',
        postcode: '',
        country: 'Australia'
      }
    }
  };
}
