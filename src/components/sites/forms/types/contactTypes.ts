
import { ContactRecord } from '@/lib/types';

export interface SiteContact extends ContactRecord {
  isPrimary?: boolean;
  role?: string;
}

export interface BillingContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
}

export function convertContactRecordToSiteContact(contact: ContactRecord): SiteContact {
  return {
    ...contact,
    isPrimary: false,
    role: ''
  };
}
