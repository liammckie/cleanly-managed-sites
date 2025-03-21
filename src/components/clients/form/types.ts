
import { ClientRecord } from '@/lib/api';

export type ClientFormData = {
  name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  status: 'active' | 'inactive' | 'pending';
  notes: string;
};

export interface ClientFormProps {
  mode: 'create' | 'edit';
  client?: ClientRecord;
}

export const initialFormData: ClientFormData = {
  name: '',
  contact_name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postcode: '',
  status: 'active',
  notes: '',
};
