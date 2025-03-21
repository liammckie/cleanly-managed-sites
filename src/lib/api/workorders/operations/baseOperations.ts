
import { supabase } from '@/integrations/supabase/client';
import { WorkOrderRecord, CreateWorkOrderData, UpdateWorkOrderData, WorkOrderStatus } from '../types';
import { Json } from '@/integrations/supabase/types';
import { WorkOrderAttachment } from '@/hooks/useGoogleDriveFiles';

/**
 * Create a new work order
 */
export const createWorkOrder = async (workOrderData: CreateWorkOrderData): Promise<WorkOrderRecord> => {
  try {
    // Prepare the data for Supabase
    // For attachments, we need to serialize to a format Supabase can handle
    const dataForSupabase = {
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
      // Convert attachments to JSON string if they exist
      attachments: workOrderData.attachments ? JSON.stringify(workOrderData.attachments) : null
    };

    // First insert the work order
    const { data, error } = await supabase
      .from('work_orders')
      .insert(dataForSupabase)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Parse attachments back from JSON string to array if they exist
    let attachments: WorkOrderAttachment[] | undefined = undefined;
    if (data.attachments) {
      try {
        // Try to parse the JSON string
        const parsedAttachments = typeof data.attachments === 'string' 
          ? JSON.parse(data.attachments) 
          : data.attachments;
        
        // Ensure it's an array
        attachments = Array.isArray(parsedAttachments) ? parsedAttachments : undefined;
      } catch (e) {
        console.error('Error parsing attachments:', e);
      }
    }

    // Return a properly typed WorkOrderRecord
    const workOrder: WorkOrderRecord = {
      ...data as unknown as Omit<WorkOrderRecord, 'attachments'>,
      attachments
    };
    
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
    // Create a clean update object without type issues
    const updateData: Record<string, any> = {};
    
    // Copy all fields except attachments
    Object.keys(workOrderData).forEach(key => {
      if (key !== 'attachments') {
        updateData[key] = workOrderData[key as keyof UpdateWorkOrderData];
      }
    });
    
    // Handle attachments separately - convert to JSON string
    if (workOrderData.attachments !== undefined) {
      updateData.attachments = JSON.stringify(workOrderData.attachments);
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

    // Parse attachments back from JSON string to array if they exist
    let attachments: WorkOrderAttachment[] | undefined = undefined;
    if (data.attachments) {
      try {
        // Try to parse the JSON string
        const parsedAttachments = typeof data.attachments === 'string' 
          ? JSON.parse(data.attachments) 
          : data.attachments;
        
        // Ensure it's an array
        attachments = Array.isArray(parsedAttachments) ? parsedAttachments : undefined;
      } catch (e) {
        console.error('Error parsing attachments:', e);
      }
    }

    // Return a properly typed WorkOrderRecord
    const workOrder: WorkOrderRecord = {
      ...data as unknown as Omit<WorkOrderRecord, 'attachments'>,
      attachments
    };
    
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
