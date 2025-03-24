
import { supabase } from '@/integrations/supabase/client';
import { WorkOrderRecord } from './types';

/**
 * Get all work orders with enhanced data
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
          client_id,
          client_name:clients(name)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform the data to extract client name
    const transformedData = data.map(workOrder => {
      const transformedWorkOrder = { ...workOrder } as any;
      
      // Extract client_name from nested structure
      if (transformedWorkOrder.site && 
          transformedWorkOrder.site.client_name && 
          transformedWorkOrder.site.client_name.length > 0) {
        transformedWorkOrder.site.client_name = transformedWorkOrder.site.client_name[0].name;
      }
      
      return transformedWorkOrder;
    });

    return transformedData as unknown as WorkOrderRecord[];
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
          client_id,
          client_name:clients(name)
        )
      `)
      .eq('site_id', siteId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform the data to extract client name
    const transformedData = data.map(workOrder => {
      const transformedWorkOrder = { ...workOrder } as any;
      
      // Extract client_name from nested structure
      if (transformedWorkOrder.site && 
          transformedWorkOrder.site.client_name && 
          transformedWorkOrder.site.client_name.length > 0) {
        transformedWorkOrder.site.client_name = transformedWorkOrder.site.client_name[0].name;
      }
      
      return transformedWorkOrder;
    });

    return transformedData as unknown as WorkOrderRecord[];
  } catch (error) {
    console.error(`Error fetching work orders for site ${siteId}:`, error);
    throw error;
  }
};

/**
 * Get a single work order by ID with enhanced data
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

    // Transform to add client_name directly to site
    if (data && data.site && data.site.client) {
      const transformed = {
        ...data,
        site: {
          ...data.site,
          client_name: data.site.client.name
        }
      };
      return transformed as unknown as WorkOrderRecord;
    }

    return data as unknown as WorkOrderRecord;
  } catch (error) {
    console.error(`Error fetching work order ${id}:`, error);
    throw error;
  }
};
