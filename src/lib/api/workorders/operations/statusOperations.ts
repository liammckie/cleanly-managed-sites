
import { supabase } from '@/integrations/supabase/client';
import { WorkOrderRecord, WorkOrderStatus } from '../types';

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
