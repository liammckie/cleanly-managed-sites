
/**
 * Site contact types for forms
 */

export interface SiteContact {
  id?: string;
  name: string;
  role: string;
  department?: string;
  email?: string;
  phone?: string;
  notes?: string;
  is_primary?: boolean;
  entity_type?: string;
  entity_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContactFormState {
  isOpen: boolean;
  mode: 'add' | 'edit';
  currentContact: SiteContact | null;
}

export interface ContactsStepState {
  contacts: SiteContact[];
  useClientInfo: boolean;
  errors: Record<string, string>;
}
