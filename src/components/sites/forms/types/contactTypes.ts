
import { ContactRecord } from '@/lib/types';

export interface SiteContact extends ContactRecord {
  // Ensure we only have one primary flag property using is_primary from ContactRecord
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
    role: contact.role || ''
  };
}

export function convertSiteContactToContactRecord(contact: SiteContact, entityId: string): ContactRecord {
  return {
    id: contact.id,
    name: contact.name,
    role: contact.role || '',
    department: contact.department || undefined,
    email: contact.email || undefined,
    phone: contact.phone || undefined,
    is_primary: contact.is_primary || false,
    notes: contact.notes || undefined,
    entity_id: entityId,
    entity_type: 'site',
    created_at: contact.created_at || new Date().toISOString(),
    updated_at: contact.updated_at || new Date().toISOString()
  };
}
