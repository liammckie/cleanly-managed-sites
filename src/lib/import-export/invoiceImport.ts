
import { supabase } from '@/lib/supabase';
import { InvoiceRecord } from './types';
import { validateInvoiceData } from './validation/invoiceValidation';

export const importInvoices = async (invoices: any[]): Promise<{
  success: boolean;
  count: number;
  errors?: any[];
}> => {
  try {
    console.log(`Starting invoice import with ${invoices.length} records`);
    
    // Validate invoice data
    const validationResult = validateInvoiceData(invoices);
    
    if (!validationResult.valid) {
      console.error('Invoice validation errors:', validationResult.errors);
      return {
        success: false,
        count: 0,
        errors: validationResult.errors
      };
    }
    
    if (validationResult.warnings && validationResult.warnings.length > 0) {
      console.warn('Invoice validation warnings:', validationResult.warnings);
    }
    
    const validInvoices = validationResult.data || [];
    console.log(`Validated ${validInvoices.length} invoices`);
    
    if (validInvoices.length === 0) {
      return {
        success: true,
        count: 0
      };
    }
    
    // Process invoices and line items
    const processedInvoices = [];
    const lineItems = [];
    
    for (const invoice of validInvoices) {
      const invoiceLineItems = invoice.line_items || [];
      delete invoice.line_items; // Remove line_items before inserting invoice
      
      processedInvoices.push(invoice);
      
      // Prepare line items for insertion after invoices
      if (invoiceLineItems.length > 0) {
        invoiceLineItems.forEach((lineItem: any) => {
          lineItems.push({
            ...lineItem,
            // We'll update this later once we have invoice IDs
            invoice_id: invoice.id || ''
          });
        });
      }
    }
    
    // Insert invoices
    const { data: insertedInvoices, error: invoiceError } = await supabase
      .from('invoices')
      .insert(processedInvoices)
      .select();
    
    if (invoiceError) {
      console.error('Error inserting invoices:', invoiceError);
      return {
        success: false,
        count: 0,
        errors: [{ message: invoiceError.message }]
      };
    }
    
    let lineItemCount = 0;
    
    // Insert line items if any
    if (lineItems.length > 0 && insertedInvoices) {
      // Map line items to inserted invoices
      const updatedLineItems = lineItems.map((lineItem: any, index: number) => {
        const invoiceIndex = Math.floor(index / lineItems.length * insertedInvoices.length);
        return {
          ...lineItem,
          invoice_id: insertedInvoices[invoiceIndex].id
        };
      });
      
      const { data: insertedLineItems, error: lineItemError } = await supabase
        .from('invoice_line_items')
        .insert(updatedLineItems)
        .select();
      
      if (lineItemError) {
        console.error('Error inserting invoice line items:', lineItemError);
      } else {
        lineItemCount = insertedLineItems?.length || 0;
      }
    }
    
    console.log(`Invoice import completed successfully: ${insertedInvoices?.length || 0} invoices, ${lineItemCount} line items`);
    return {
      success: true,
      count: insertedInvoices?.length || 0
    };
  } catch (error) {
    console.error('Error during invoice import:', error);
    return {
      success: false,
      count: 0,
      errors: [{ message: (error as Error).message }]
    };
  }
};
