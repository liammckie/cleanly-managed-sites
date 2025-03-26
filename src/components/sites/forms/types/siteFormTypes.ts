
import { SiteFormData } from './siteForms';

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
  };
}

export type { SiteFormData };
