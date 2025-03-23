
import { ContactRecord } from '@/lib/types';

export interface SiteContact extends ContactRecord {
  isPrimary?: boolean;
  role: string; // Changed from optional to required to match ContactRecord
}

export interface BillingContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
  position?: string; // Added position field
}

export function convertContactRecordToSiteContact(contact: ContactRecord): SiteContact {
  return {
    ...contact,
    isPrimary: contact.is_primary || false,
    role: contact.role || ''
  };
}

export function convertSiteContactToContactRecord(contact: SiteContact, entityId: string): ContactRecord {
  return {
    id: contact.id,
    name: contact.name,
    role: contact.role || '',
    department: contact.department || null,
    email: contact.email || null,
    phone: contact.phone || null,
    is_primary: contact.isPrimary || false,
    notes: contact.notes || null,
    entity_id: entityId,
    entity_type: 'site',
    created_at: contact.created_at || new Date().toISOString(),
    updated_at: contact.updated_at || new Date().toISOString()
  };
}
