
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

/**
 * Mark a work order as completed with specified completion date
 */
export const completeWorkOrder = async (id: string, completionDate?: string): Promise<WorkOrderRecord> => {
  try {
    // Use provided completion date or default to current date
    const actualCompletionDate = completionDate || new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('work_orders')
      .update({
        status: 'completed',
        completion_date: actualCompletionDate
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as unknown as WorkOrderRecord;
  } catch (error) {
    console.error(`Error completing work order ${id}:`, error);
    throw error;
  }
};
