
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
  entity_id?: string;
  entity_type?: 'site' | 'client';
  id?: string; // Add id field for existing contacts
  created_at?: string;
  updated_at?: string;
}

// Helper function to convert SiteContact to ContactRecord
export const convertSiteContactToContactRecord = (
  contact: SiteContact, 
  entityId: string
): Partial<ContactRecord> => {
  return {
    id: contact.id, // Pass through id if it exists
    name: contact.name,
    role: contact.role,
    department: contact.department,
    email: contact.email,
    phone: contact.phone,
    is_primary: contact.is_primary,
    notes: contact.notes,
    entity_id: entityId,
    entity_type: 'site',
    created_at: contact.created_at,
    updated_at: contact.updated_at
  };
};

// Helper function to convert ContactRecord to SiteContact
export const convertContactRecordToSiteContact = (
  contact: ContactRecord
): SiteContact => {
  return {
    id: contact.id,
    name: contact.name,
    role: contact.role,
    department: contact.department,
    email: contact.email,
    phone: contact.phone,
    is_primary: contact.is_primary,
    notes: contact.notes,
    entity_id: contact.entity_id,
    entity_type: contact.entity_type,
    created_at: contact.created_at,
    updated_at: contact.updated_at
  };
};
