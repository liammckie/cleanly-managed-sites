
import { ContactRecord } from '@/lib/types';

export interface SiteContact {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  department?: string;
  notes?: string;
  entity_id?: string;
  entity_type?: string;
  is_primary?: boolean;
}

export interface BillingContact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
}

export const convertContactRecordToSiteContact = (contactRecord: ContactRecord): SiteContact => {
  return {
    id: contactRecord.id,
    name: contactRecord.name,
    email: contactRecord.email,
    phone: contactRecord.phone,
    role: contactRecord.role,
    department: contactRecord.department,
    notes: contactRecord.notes,
    entity_id: contactRecord.entity_id,
    entity_type: contactRecord.entity_type,
    is_primary: contactRecord.is_primary
  };
};
