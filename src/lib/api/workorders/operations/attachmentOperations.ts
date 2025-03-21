
import { supabase } from '@/integrations/supabase/client';
import { WorkOrderRecord } from '../types';

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
      .maybeSingle();
    
    if (getError) {
      throw getError;
    }
    
    if (!workOrder) {
      throw new Error(`Work order with ID ${id} not found`);
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
