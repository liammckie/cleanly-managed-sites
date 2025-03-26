import { supabase } from '../supabase';
import { InvoiceRecord } from './types';
import { validateInvoiceData, validateInvoiceLineItemData } from './validation/invoiceValidation';
import { checkExistingItems } from './validation/commonValidation';

// Import invoices
export const importInvoices = async (invoices: InvoiceRecord[]): Promise<void> => {
  try {
    // Validate invoice data
    const { isValid, errors, data: validData } = validateInvoiceData(invoices);
    
    if (!isValid) {
      console.error('Invalid invoice data:', errors);
      throw new Error(`Invalid invoice data. Please check your import file. ${errors.map(e => e.message).join(', ')}`);
    }
    
    // Check for existing invoices by ID to avoid duplicates
    const invoicesWithIds = validData.filter(invoice => invoice.id);
    const existingIds = await checkExistingItems('invoices', invoicesWithIds.map(invoice => invoice.id as string));
    
    const invoicesToInsert = validData.filter(invoice => !invoice.id || !existingIds.includes(invoice.id as string));
    const invoicesToUpdate = validData.filter(invoice => invoice.id && existingIds.includes(invoice.id as string));
    
    // Insert new invoices
    if (invoicesToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('invoices')
        .insert(invoicesToInsert);
      
      if (insertError) {
        console.error('Error inserting invoices:', insertError);
        throw new Error(`Failed to import invoices: ${insertError.message}`);
      }
    }
    
    // Update existing invoices
    for (const invoice of invoicesToUpdate) {
      const { error: updateError } = await supabase
        .from('invoices')
        .update(invoice)
        .eq('id', invoice.id);
      
      if (updateError) {
        console.error(`Error updating invoice ${invoice.id}:`, updateError);
      }
    }
    
    // Process invoice line items if they exist
    for (const invoice of invoices) {
      if (invoice.line_items && Array.isArray(invoice.line_items) && invoice.line_items.length > 0) {
        // For each invoice, process its line items
        await importInvoiceLineItems(invoice.id as string, invoice.line_items);
      }
    }
    
  } catch (error) {
    console.error('Error importing invoices:', error);
    throw error;
  }
};

// Helper function to import invoice line items
const importInvoiceLineItems = async (invoiceId: string, lineItems: any[]): Promise<void> => {
  try {
    // Validate line items
    const { isValid, errors, data: validItems } = validateInvoiceLineItemData(
      lineItems.map(item => ({ ...item, invoice_id: invoiceId }))
    );
    
    if (!isValid) {
      console.error(`Invalid line items for invoice ${invoiceId}:`, errors);
      return;
    }
    
    // First, get existing line items for this invoice
    const { data: existingLineItems, error: fetchError } = await supabase
      .from('invoice_line_items')
      .select('id')
      .eq('invoice_id', invoiceId);
    
    if (fetchError) {
      console.error(`Error fetching line items for invoice ${invoiceId}:`, fetchError);
      return;
    }
    
    const existingIds = existingLineItems?.map(item => item.id) || [];
    
    // Filter items to insert vs update
    const itemsToInsert = validItems.filter(item => !item.id || !existingIds.includes(item.id as string));
    const itemsToUpdate = validItems.filter(item => item.id && existingIds.includes(item.id as string));
    
    // Insert new items
    if (itemsToInsert.length > 0) {
      const preparedItems = itemsToInsert.map(item => ({
        ...item,
        invoice_id: invoiceId
      }));
      
      const { error: insertError } = await supabase
        .from('invoice_line_items')
        .insert(preparedItems);
      
      if (insertError) {
        console.error(`Error inserting line items for invoice ${invoiceId}:`, insertError);
      }
    }
    
    // Update existing items
    for (const item of itemsToUpdate) {
      const { error: updateError } = await supabase
        .from('invoice_line_items')
        .update(item)
        .eq('id', item.id);
      
      if (updateError) {
        console.error(`Error updating line item ${item.id}:`, updateError);
      }
    }
    
  } catch (error) {
    console.error(`Error processing line items for invoice ${invoiceId}:`, error);
  }
};
