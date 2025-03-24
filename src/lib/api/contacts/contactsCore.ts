
import { supabase } from '@/integrations/supabase/client';
import { ContactFilters } from './types';

// Apply filters to the contacts query
export function applyContactFilters(query: any, filters: ContactFilters = {}) {
  // Apply entity type filter
  if (filters.entityType && filters.entityType !== 'all') {
    query = query.eq('entity_type', filters.entityType);
  }
  
  // Apply entity ID filter - special handling for "all_sites" and "all_clients"
  if (filters.entityId) {
    query = query.eq('entity_id', filters.entityId);
  }
  
  // Apply role filter
  if (filters.role && filters.role.trim() !== '') {
    query = query.ilike('role', `%${filters.role}%`);
  }
  
  // Apply department filter
  if (filters.department && filters.department.trim() !== '') {
    query = query.ilike('department', `%${filters.department}%`);
  }
  
  // Apply primary contact filter
  if (filters.isPrimary !== undefined) {
    query = query.eq('is_primary', filters.isPrimary);
  }
  
  // Apply sorting
  if (filters.sortBy) {
    const direction = filters.sortDirection || 'asc';
    query = query.order(filters.sortBy, { ascending: direction === 'asc' });
  } else {
    // Default sorting by created_at
    query = query.order('created_at', { ascending: false });
  }
  
  return query;
}

// Special handling for bulk assignments and internal contacts
export function prepareEntityId(entityType: string, entityId: string | null) {
  if (entityType === 'internal') {
    return null;
  } else if (['all_sites', 'all_clients'].includes(entityId as string)) {
    return entityId;
  } else {
    return entityId && entityId.trim() !== '' ? entityId : null;
  }
}
