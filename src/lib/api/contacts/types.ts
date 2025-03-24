
import { ContactRecord } from '../../types';

export interface ContactFilters {
  entityType?: string;
  entityId?: string;
  search?: string;
  role?: string;
  department?: string;
  isPrimary?: boolean;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export type ContactEntity = {
  id: string;
  name: string;
  type: string;
  identifier?: string;
  parent_id?: string;
};
