
import { supabase } from '@/integrations/supabase/client';
import { WorkOrderRecord, CreateWorkOrderData, UpdateWorkOrderData, WorkOrderStatus } from './types';

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

/**
 * Create a new work order
 */
export const createWorkOrder = async (workOrderData: CreateWorkOrderData): Promise<WorkOrderRecord> => {
  try {
    // First insert the work order
    const { data, error } = await supabase
      .from('work_orders')
      .insert({
        title: workOrderData.title,
        description: workOrderData.description,
        site_id: workOrderData.site_id,
        priority: workOrderData.priority,
        due_date: workOrderData.due_date,
        estimated_cost: workOrderData.estimated_cost,
        billing_amount: workOrderData.billing_amount,
        assigned_to: workOrderData.assigned_to,
        status: 'draft', // Always start as draft
        created_by: (await supabase.auth.getUser()).data.user?.id,
        requires_purchase_order: workOrderData.requires_purchase_order,
        purchase_order_number: workOrderData.purchase_order_number
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // TODO: Handle file uploads for attachments if needed

    return data as unknown as WorkOrderRecord;
  } catch (error) {
    console.error('Error creating work order:', error);
    throw error;
  }
};

/**
 * Update an existing work order
 */
export const updateWorkOrder = async (id: string, workOrderData: UpdateWorkOrderData): Promise<WorkOrderRecord> => {
  try {
    const { data, error } = await supabase
      .from('work_orders')
      .update(workOrderData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as unknown as WorkOrderRecord;
  } catch (error) {
    console.error(`Error updating work order ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a work order
 */
export const deleteWorkOrder = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('work_orders')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(`Error deleting work order ${id}:`, error);
    throw error;
  }
};

/**
 * Update the status of a work order
 */
export const updateWorkOrderStatus = async (id: string, status: WorkOrderStatus): Promise<WorkOrderRecord> => {
  try {
    const { data, error } = await supabase
      .from('work_orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as unknown as WorkOrderRecord;
  } catch (error) {
    console.error(`Error updating work order status ${id}:`, error);
    throw error;
  }
};

/**
 * Assign a work order to a subcontractor
 */
export const assignWorkOrder = async (id: string, subcontractorId: string): Promise<WorkOrderRecord> => {
  try {
    const { data, error } = await supabase
      .from('work_orders')
      .update({
        assigned_to: subcontractorId,
        status: 'assigned'
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as unknown as WorkOrderRecord;
  } catch (error) {
    console.error(`Error assigning work order ${id}:`, error);
    throw error;
  }
};
