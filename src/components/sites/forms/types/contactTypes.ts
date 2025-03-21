
import { ContactRecord } from '@/lib/types';

export type BillingContact = {
  name: string;
  position: string;
  email: string;
  phone: string;
}

export type SiteContact = {
  name: string;
  role: string;
  department?: string;
  email?: string;
  phone?: string;
  is_primary?: boolean;
  notes?: string;
}
