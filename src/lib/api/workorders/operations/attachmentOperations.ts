
import { supabase } from '@/integrations/supabase/client';
import { WorkOrderAttachment } from '@/hooks/useGoogleDriveFiles';
import { WorkOrderRecord } from '../types';

/**
 * Add attachment to a work order
 */
export const addWorkOrderAttachment = async (id: string, attachment: WorkOrderAttachment): Promise<WorkOrderRecord> => {
  try {
    // Get the current attachments first
    const { data: workOrder, error: fetchError } = await supabase
      .from('work_orders')
      .select('attachments')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    // Initialize attachments array or use existing one
    const existingAttachments = workOrder?.attachments || [];
    
    // Convert to a proper format for database storage
    const attachmentsData = JSON.parse(JSON.stringify([
      ...existingAttachments,
      attachment
    ]));

    // Update the work order with the new attachment
    const { data, error } = await supabase
      .from('work_orders')
      .update({ attachments: attachmentsData })
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
 * Remove attachment from a work order
 */
export const removeWorkOrderAttachment = async (id: string, attachmentId: string): Promise<WorkOrderRecord> => {
  try {
    // Get the current attachments first
    const { data: workOrder, error: fetchError } = await supabase
      .from('work_orders')
      .select('attachments')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (!workOrder?.attachments) {
      throw new Error('No attachments found for this work order');
    }

    // Filter out the attachment to remove
    const attachmentsArray = Array.isArray(workOrder.attachments) ? workOrder.attachments : [];
    const updatedAttachments = attachmentsArray.filter(
      (attachment: any) => attachment.id !== attachmentId
    );

    // Convert to a proper format for database storage
    const attachmentsData = JSON.parse(JSON.stringify(updatedAttachments));

    // Update the work order with the filtered attachments
    const { data, error } = await supabase
      .from('work_orders')
      .update({ attachments: attachmentsData })
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

/**
 * Update work order attachments (replace all)
 */
export const updateWorkOrderAttachments = async (id: string, attachments: WorkOrderAttachment[]): Promise<WorkOrderRecord> => {
  try {
    // Convert to a proper format for database storage
    const attachmentsData = JSON.parse(JSON.stringify(attachments));

    // Update the work order with the new attachments
    const { data, error } = await supabase
      .from('work_orders')
      .update({ attachments: attachmentsData })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as unknown as WorkOrderRecord;
  } catch (error) {
    console.error(`Error updating attachments for work order ${id}:`, error);
    throw error;
  }
};
