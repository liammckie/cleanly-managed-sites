
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

    // Parse existing attachments
    let existingAttachments: WorkOrderAttachment[] = [];
    if (workOrder?.attachments) {
      try {
        // Handle both string and JSON object formats
        const parsed = typeof workOrder.attachments === 'string' 
          ? JSON.parse(workOrder.attachments) 
          : workOrder.attachments;
          
        existingAttachments = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error('Error parsing attachments:', e);
      }
    }
    
    // Create a new array with the added attachment
    const updatedAttachments = [...existingAttachments, attachment];

    // Update the work order with the new attachment
    const { data, error } = await supabase
      .from('work_orders')
      .update({ 
        attachments: JSON.stringify(updatedAttachments)
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Parse attachments for the return value
    let attachments: WorkOrderAttachment[] | undefined = undefined;
    if (data.attachments) {
      try {
        const parsedAttachments = typeof data.attachments === 'string' 
          ? JSON.parse(data.attachments) 
          : data.attachments;
        
        attachments = Array.isArray(parsedAttachments) ? parsedAttachments : undefined;
      } catch (e) {
        console.error('Error parsing returned attachments:', e);
      }
    }

    // Return a properly typed WorkOrderRecord
    return {
      ...data as unknown as Omit<WorkOrderRecord, 'attachments'>,
      attachments
    };
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

    // Parse existing attachments
    let attachmentsArray: WorkOrderAttachment[] = [];
    try {
      // Handle both string and JSON object formats
      const parsed = typeof workOrder.attachments === 'string' 
        ? JSON.parse(workOrder.attachments) 
        : workOrder.attachments;
        
      attachmentsArray = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error parsing attachments:', e);
      throw new Error('Invalid attachment format');
    }

    // Filter out the attachment to remove
    const updatedAttachments = attachmentsArray.filter(
      attachment => attachment.id !== attachmentId
    );

    // Update the work order with the filtered attachments
    const { data, error } = await supabase
      .from('work_orders')
      .update({ 
        attachments: JSON.stringify(updatedAttachments)
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Parse attachments for the return value
    let attachments: WorkOrderAttachment[] | undefined = undefined;
    if (data.attachments) {
      try {
        const parsedAttachments = typeof data.attachments === 'string' 
          ? JSON.parse(data.attachments) 
          : data.attachments;
        
        attachments = Array.isArray(parsedAttachments) ? parsedAttachments : undefined;
      } catch (e) {
        console.error('Error parsing returned attachments:', e);
      }
    }

    // Return a properly typed WorkOrderRecord
    return {
      ...data as unknown as Omit<WorkOrderRecord, 'attachments'>,
      attachments
    };
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
    // Update the work order with the new attachments as a JSON string
    const { data, error } = await supabase
      .from('work_orders')
      .update({ 
        attachments: JSON.stringify(attachments)
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Parse attachments for the return value
    let parsedAttachments: WorkOrderAttachment[] | undefined = undefined;
    if (data.attachments) {
      try {
        const parsed = typeof data.attachments === 'string' 
          ? JSON.parse(data.attachments) 
          : data.attachments;
        
        parsedAttachments = Array.isArray(parsed) ? parsed : undefined;
      } catch (e) {
        console.error('Error parsing returned attachments:', e);
      }
    }

    // Return a properly typed WorkOrderRecord
    return {
      ...data as unknown as Omit<WorkOrderRecord, 'attachments'>,
      attachments: parsedAttachments
    };
  } catch (error) {
    console.error(`Error updating attachments for work order ${id}:`, error);
    throw error;
  }
};
