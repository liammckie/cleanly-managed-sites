
import { supabase } from '@/lib/supabase';
import { InvoiceRecord, InvoiceLineItem } from './types';
import { validateInvoiceData } from './validation/invoiceValidation';
import { ValidationResult } from './types';

// Import invoices
export const importInvoices = async (invoices: Partial<InvoiceRecord>[]): Promise<void> => {
  try {
    console.log(`Starting invoice import with ${invoices.length} records`);
    
    // Validate invoice data
    const validationResult: ValidationResult<Partial<InvoiceRecord>[]> = validateInvoiceData(invoices);
    
    if (!validationResult.valid) {
      const errorMessages = validationResult.errors?.map(e => e.message).join(', ');
      console.error('Invoice validation errors:', errorMessages);
      throw new Error(`Invoice validation failed: ${errorMessages}`);
    }
    
    const validInvoices = validationResult.data || [];
    console.log(`Validated ${validInvoices.length} invoices`);
    
    // Check for existing invoices by ID to avoid duplicates
    const invoicesWithIds = validInvoices.filter(invoice => invoice.id);
    const existingIds = invoicesWithIds.length > 0 ? 
      await checkExistingInvoices(invoicesWithIds.map(invoice => invoice.id as string)) : 
      [];
    
    const invoicesToInsert = validInvoices.filter(invoice => !invoice.id || !existingIds.includes(invoice.id as string));
    const invoicesToUpdate = validInvoices.filter(invoice => invoice.id && existingIds.includes(invoice.id as string));
    
    // Process invoice insertions
    await processInvoiceInsertions(invoicesToInsert);
    
    // Process invoice updates
    await processInvoiceUpdates(invoicesToUpdate);
    
    console.log('Invoice import completed successfully');
  } catch (error) {
    console.error('Error during invoice import:', error);
    throw error;
  }
};

// Helper function to check existing invoices
const checkExistingInvoices = async (ids: string[]): Promise<string[]> => {
  if (ids.length === 0) return [];
  
  try {
    const { data } = await supabase
      .from('invoices')
      .select('id')
      .in('id', ids);
    
    return data?.map(item => item.id) || [];
  } catch (error) {
    console.error('Error checking existing invoices:', error);
    return [];
  }
};

// Helper function to process invoice insertions
const processInvoiceInsertions = async (invoices: Partial<InvoiceRecord>[]): Promise<void> => {
  if (invoices.length === 0) return;
  
  try {
    // Separate line items from invoices
    const processedInvoices = invoices.map(({ line_items, ...invoiceData }) => invoiceData);
    
    // Insert invoices
    const { data: insertedInvoices, error: insertError } = await supabase
      .from('invoices')
      .insert(processedInvoices)
      .select('id, invoice_number');
    
    if (insertError) {
      console.error('Error inserting invoices:', insertError);
      throw insertError;
    }
    
    console.log(`Inserted ${insertedInvoices?.length || 0} invoices`);
    
    // Process line items if they exist
    if (insertedInvoices) {
      for (let i = 0; i < invoices.length; i++) {
        const invoice = invoices[i];
        const insertedInvoice = insertedInvoices[i];
        
        if (invoice.line_items && Array.isArray(invoice.line_items) && invoice.line_items.length > 0 && insertedInvoice) {
          await processInvoiceLineItems(insertedInvoice.id, invoice.line_items);
        }
      }
    }
  } catch (error) {
    console.error('Error processing invoice insertions:', error);
    throw error;
  }
};

// Helper function to process invoice updates
const processInvoiceUpdates = async (invoices: Partial<InvoiceRecord>[]): Promise<void> => {
  if (invoices.length === 0) return;
  
  try {
    for (const invoice of invoices) {
      const { line_items, ...invoiceData } = invoice;
      const { error: updateError } = await supabase
        .from('invoices')
        .update(invoiceData)
        .eq('id', invoice.id as string);
      
      if (updateError) {
        console.error(`Error updating invoice ${invoice.id}:`, updateError);
        continue;
      }
      
      console.log(`Updated invoice ${invoice.id}`);
      
      // Process line items if they exist
      if (line_items && Array.isArray(line_items) && line_items.length > 0) {
        await processInvoiceLineItems(invoice.id as string, line_items);
      }
    }
  } catch (error) {
    console.error('Error processing invoice updates:', error);
    throw error;
  }
};

// Helper function to process invoice line items
const processInvoiceLineItems = async (invoiceId: string, lineItems: InvoiceLineItem[]): Promise<void> => {
  if (lineItems.length === 0) return;
  
  try {
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
    const itemsToInsert = lineItems.filter(item => !item.id || !existingIds.includes(item.id as string));
    const itemsToUpdate = lineItems.filter(item => item.id && existingIds.includes(item.id as string));
    
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
      } else {
        console.log(`Inserted ${itemsToInsert.length} line items for invoice ${invoiceId}`);
      }
    }
    
    // Update existing items
    for (const item of itemsToUpdate) {
      const { error: updateError } = await supabase
        .from('invoice_line_items')
        .update(item)
        .eq('id', item.id as string);
      
      if (updateError) {
        console.error(`Error updating line item ${item.id}:`, updateError);
      } else {
        console.log(`Updated line item ${item.id}`);
      }
    }
  } catch (error) {
    console.error(`Error processing line items for invoice ${invoiceId}:`, error);
  }
};
