
import { supabase } from '@/integrations/supabase/client';
import { WorkOrderRecord, CreateWorkOrderData, UpdateWorkOrderData, WorkOrderStatus } from './types';

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
        // Convert WorkOrderAttachment[] to a JSON-compatible format
        attachments: workOrderData.attachments ? JSON.parse(JSON.stringify(workOrderData.attachments)) : null
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

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
    // Prepare the update data - handle the attachments separately
    const updateData = { ...workOrderData };
    if (updateData.attachments) {
      // Convert WorkOrderAttachment[] to a JSON-compatible format
      updateData.attachments = JSON.parse(JSON.stringify(updateData.attachments));
    }

    const { data, error } = await supabase
      .from('work_orders')
      .update(updateData)
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

/**
 * Add an attachment to a work order
 */
export const addWorkOrderAttachment = async (
  id: string, 
  attachment: any
): Promise<WorkOrderRecord> => {
  try {
    // First get the current attachments
    const { data: workOrder, error: getError } = await supabase
      .from('work_orders')
      .select('attachments')
      .eq('id', id)
      .single();
    
    if (getError) {
      throw getError;
    }
    
    // Handle the case where attachments might be null
    const currentAttachments = workOrder.attachments || [];
    
    // Ensure currentAttachments is an array
    const attachmentsArray = Array.isArray(currentAttachments) ? currentAttachments : [];
    
    // Add the new attachment
    const updatedAttachments = [...attachmentsArray, attachment];
    
    // Update the work order with the new attachment
    const { data, error } = await supabase
      .from('work_orders')
      .update({ 
        attachments: JSON.parse(JSON.stringify(updatedAttachments)) 
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return data as unknown as WorkOrderRecord;
  } catch (error) {
    console.error(`Error adding attachment to work order ${id}:`, error);
    throw error;
  }
};

/**
 * Remove an attachment from a work order
 */
export const removeWorkOrderAttachment = async (
  id: string,
  attachmentId: string
): Promise<WorkOrderRecord> => {
  try {
    // First get the current attachments
    const { data: workOrder, error: getError } = await supabase
      .from('work_orders')
      .select('attachments')
      .eq('id', id)
      .single();
    
    if (getError) {
      throw getError;
    }
    
    // Handle the case where attachments might be null
    const currentAttachments = workOrder.attachments || [];
    
    // Ensure currentAttachments is an array
    const attachmentsArray = Array.isArray(currentAttachments) ? currentAttachments : [];
    
    // Filter out the attachment to remove
    const updatedAttachments = attachmentsArray.filter(
      (attachment: any) => attachment.id !== attachmentId
    );
    
    // Update the work order with the filtered attachments
    const { data, error } = await supabase
      .from('work_orders')
      .update({ 
        attachments: JSON.parse(JSON.stringify(updatedAttachments)) 
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return data as unknown as WorkOrderRecord;
  } catch (error) {
    console.error(`Error removing attachment from work order ${id}:`, error);
    throw error;
  }
};
