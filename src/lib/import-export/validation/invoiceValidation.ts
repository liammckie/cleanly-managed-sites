
import { ValidationResult, ValidationMessage } from './types';

/**
 * Validates invoice data for importing
 * @param invoiceData The invoice data to validate
 * @returns Validation result with success flag and error messages
 */
export function validateInvoiceData(invoiceData: any[]): ValidationResult {
  const messages: ValidationMessage[] = [];
  let isValid = true;
  
  if (!Array.isArray(invoiceData)) {
    messages.push({
      type: 'error',
      field: 'data',
      message: 'Invoice data must be an array'
    });
    return { valid: false, messages };
  }
  
  invoiceData.forEach((invoice, index) => {
    // Required fields
    if (!invoice.client_id) {
      messages.push({
        type: 'error',
        field: 'client_id',
        message: `Row ${index + 1}: Client ID is required`,
        row: index,
        value: invoice.client_id
      });
      isValid = false;
    }
    
    if (!invoice.amount && invoice.amount !== 0) {
      messages.push({
        type: 'error',
        field: 'amount',
        message: `Row ${index + 1}: Amount is required`,
        row: index,
        value: invoice.amount
      });
      isValid = false;
    }
    
    if (!invoice.invoice_date) {
      messages.push({
        type: 'error',
        field: 'invoice_date',
        message: `Row ${index + 1}: Invoice date is required`,
        row: index,
        value: invoice.invoice_date
      });
      isValid = false;
    }
    
    // Date validation
    if (invoice.invoice_date && isNaN(Date.parse(invoice.invoice_date))) {
      messages.push({
        type: 'error',
        field: 'invoice_date',
        message: `Row ${index + 1}: Invalid invoice date format`,
        row: index,
        value: invoice.invoice_date
      });
      isValid = false;
    }
    
    if (invoice.due_date && isNaN(Date.parse(invoice.due_date))) {
      messages.push({
        type: 'error',
        field: 'due_date',
        message: `Row ${index + 1}: Invalid due date format`,
        row: index,
        value: invoice.due_date
      });
      isValid = false;
    }
    
    // Logic validation
    if (invoice.invoice_date && invoice.due_date) {
      const invoiceDate = new Date(invoice.invoice_date);
      const dueDate = new Date(invoice.due_date);
      
      if (invoiceDate > dueDate) {
        messages.push({
          type: 'warning',
          field: 'dates',
          message: `Row ${index + 1}: Due date is before invoice date`,
          row: index,
          value: invoice.due_date
        });
      }
    }
    
    // Amount validation
    if (invoice.amount !== undefined && (isNaN(Number(invoice.amount)) || Number(invoice.amount) < 0)) {
      messages.push({
        type: 'error',
        field: 'amount',
        message: `Row ${index + 1}: Amount must be a positive number`,
        row: index,
        value: invoice.amount
      });
      isValid = false;
    }
    
    // Status validation
    if (invoice.status && !['draft', 'sent', 'paid', 'overdue', 'canceled'].includes(invoice.status)) {
      messages.push({
        type: 'warning',
        field: 'status',
        message: `Row ${index + 1}: Invalid status, will default to 'draft'`,
        row: index,
        value: invoice.status
      });
    }
    
    // Line items validation if present
    if (invoice.line_items && Array.isArray(invoice.line_items)) {
      invoice.line_items.forEach((item: any, itemIndex: number) => {
        if (!item.description) {
          messages.push({
            type: 'error',
            field: `line_items[${itemIndex}].description`,
            message: `Row ${index + 1}, Item ${itemIndex + 1}: Description is required`,
            row: index,
            value: null
          });
          isValid = false;
        }
        
        if (item.unit_price !== undefined && (isNaN(Number(item.unit_price)) || Number(item.unit_price) < 0)) {
          messages.push({
            type: 'error',
            field: `line_items[${itemIndex}].unit_price`,
            message: `Row ${index + 1}, Item ${itemIndex + 1}: Unit price must be a positive number`,
            row: index,
            value: item.unit_price
          });
          isValid = false;
        }
        
        if (item.quantity !== undefined && (isNaN(Number(item.quantity)) || Number(item.quantity) <= 0)) {
          messages.push({
            type: 'error',
            field: `line_items[${itemIndex}].quantity`,
            message: `Row ${index + 1}, Item ${itemIndex + 1}: Quantity must be a positive number`,
            row: index,
            value: item.quantity
          });
          isValid = false;
        }
      });
    }
  });
  
  return { valid: isValid, messages };
}
