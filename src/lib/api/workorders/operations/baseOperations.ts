
import { supabase } from '@/integrations/supabase/client';
import { WorkOrderRecord, CreateWorkOrderData, UpdateWorkOrderData, WorkOrderStatus } from '../types';
import { Json } from '@/integrations/supabase/types';
import { WorkOrderAttachment } from '@/hooks/useGoogleDriveFiles';

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
        purchase_order_number: workOrderData.purchase_order_number,
        // Cast attachments to Json for Supabase
        attachments: workOrderData.attachments ? (workOrderData.attachments as unknown as Json) : null
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Cast the returned data to WorkOrderRecord
    const workOrder = data as unknown as WorkOrderRecord;
    
    // Ensure attachments are properly cast from Json to WorkOrderAttachment[]
    if (workOrder.attachments) {
      workOrder.attachments = workOrder.attachments as unknown as WorkOrderAttachment[];
    }
    
    return workOrder;
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
    // Process data to ensure proper types
    const processedData = { ...workOrderData };
    
    // Cast attachments to Json for Supabase if they exist
    if (processedData.attachments) {
      processedData.attachments = processedData.attachments as unknown as Json;
    }
    
    // Just pass the update data directly - Supabase handles JSON conversion
    const { data, error } = await supabase
      .from('work_orders')
      .update(processedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Need to explicitly cast the return type
    const workOrder = data as unknown as WorkOrderRecord;
    
    // If the data contains attachments, ensure they are properly cast back to WorkOrderAttachment[]
    if (workOrder.attachments) {
      workOrder.attachments = workOrder.attachments as unknown as WorkOrderAttachment[];
    }
    
    return workOrder;
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
