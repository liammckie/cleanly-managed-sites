
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
  };
}
