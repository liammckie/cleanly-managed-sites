
import { supabase } from '@/integrations/supabase/client';
import { WorkOrderRecord } from './types';

/**
 * Get all work orders
 */
export const getWorkOrders = async (): Promise<WorkOrderRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('work_orders')
      .select(`
        *,
        site:site_id (
          id,
          name,
          address,
          city,
          state,
          postcode,
          client_id
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as unknown as WorkOrderRecord[];
  } catch (error) {
    console.error('Error fetching work orders:', error);
    throw error;
  }
};

/**
 * Get work orders for a specific site
 */
export const getSiteWorkOrders = async (siteId: string): Promise<WorkOrderRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('work_orders')
      .select(`
        *,
        site:site_id (
          id,
          name,
          address,
          city,
          state,
          postcode,
          client_id
        )
      `)
      .eq('site_id', siteId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as unknown as WorkOrderRecord[];
  } catch (error) {
    console.error(`Error fetching work orders for site ${siteId}:`, error);
    throw error;
  }
};

/**
 * Get a single work order by ID
 */
export const getWorkOrder = async (id: string): Promise<WorkOrderRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('work_orders')
      .select(`
        *,
        site:site_id (
          *,
          client:client_id (
            id,
            name
          )
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as unknown as WorkOrderRecord;
  } catch (error) {
    console.error(`Error fetching work order ${id}:`, error);
    throw error;
  }
};
