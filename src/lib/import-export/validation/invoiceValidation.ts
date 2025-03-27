
import { ValidationResult, ValidationMessage, ValidationError } from '../types';
import { InvoiceRecord, InvoiceLineItem } from '../types';

/**
 * Validates invoice data for importing
 * @param invoiceData The invoice data to validate
 * @returns Validation result with success flag and error messages
 */
export function validateInvoiceData(invoiceData: any[]): ValidationResult<Partial<InvoiceRecord>[]> {
  const messages: ValidationMessage[] = [];
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  let valid = true;
  
  if (!Array.isArray(invoiceData)) {
    const error = {
      path: 'data',
      message: 'Invoice data must be an array'
    };
    errors.push(error);
    messages.push({
      type: 'error',
      field: 'data',
      message: 'Invoice data must be an array'
    });
    return { valid: false, errors, warnings, messages };
  }
  
  const validData: Partial<InvoiceRecord>[] = [];
  
  invoiceData.forEach((invoice, index) => {
    const validInvoice: Partial<InvoiceRecord> = {};
    
    // Required fields
    if (!invoice.client_id) {
      valid = false;
      const error = {
        path: `[${index}].client_id`,
        message: `Row ${index + 1}: Client ID is required`
      };
      errors.push(error);
      messages.push({
        type: 'error',
        field: 'client_id',
        message: `Row ${index + 1}: Client ID is required`,
        row: index,
        value: invoice.client_id
      });
    } else {
      validInvoice.client_id = invoice.client_id;
    }
    
    if (!invoice.invoice_number) {
      valid = false;
      const error = {
        path: `[${index}].invoice_number`,
        message: `Row ${index + 1}: Invoice number is required`
      };
      errors.push(error);
      messages.push({
        type: 'error',
        field: 'invoice_number',
        message: `Row ${index + 1}: Invoice number is required`,
        row: index
      });
    } else {
      validInvoice.invoice_number = invoice.invoice_number;
    }
    
    if (!invoice.amount && invoice.amount !== 0) {
      valid = false;
      const error = {
        path: `[${index}].amount`,
        message: `Row ${index + 1}: Amount is required`
      };
      errors.push(error);
      messages.push({
        type: 'error',
        field: 'amount',
        message: `Row ${index + 1}: Amount is required`,
        row: index,
        value: invoice.amount
      });
    } else {
      validInvoice.amount = Number(invoice.amount);
    }
    
    if (!invoice.invoice_date) {
      valid = false;
      const error = {
        path: `[${index}].invoice_date`,
        message: `Row ${index + 1}: Invoice date is required`
      };
      errors.push(error);
      messages.push({
        type: 'error',
        field: 'invoice_date',
        message: `Row ${index + 1}: Invoice date is required`,
        row: index,
        value: invoice.invoice_date
      });
    } else {
      validInvoice.invoice_date = invoice.invoice_date;
    }
    
    // Date validation
    if (invoice.invoice_date && isNaN(Date.parse(invoice.invoice_date))) {
      valid = false;
      const error = {
        path: `[${index}].invoice_date`,
        message: `Row ${index + 1}: Invalid invoice date format`
      };
      errors.push(error);
      messages.push({
        type: 'error',
        field: 'invoice_date',
        message: `Row ${index + 1}: Invalid invoice date format`,
        row: index,
        value: invoice.invoice_date
      });
    }
    
    if (invoice.due_date && isNaN(Date.parse(invoice.due_date))) {
      valid = false;
      const error = {
        path: `[${index}].due_date`,
        message: `Row ${index + 1}: Invalid due date format`
      };
      errors.push(error);
      messages.push({
        type: 'error',
        field: 'due_date',
        message: `Row ${index + 1}: Invalid due date format`,
        row: index,
        value: invoice.due_date
      });
    } else {
      validInvoice.due_date = invoice.due_date;
    }
    
    // Additional fields
    validInvoice.site_id = invoice.site_id;
    validInvoice.status = invoice.status || 'draft';
    validInvoice.notes = invoice.notes;
    
    // Process line items if present
    if (invoice.line_items && Array.isArray(invoice.line_items)) {
      validInvoice.line_items = validateInvoiceLineItems(invoice.line_items, index, errors, warnings, messages);
    }
    
    // Add to valid data if all required fields are present
    if (validInvoice.client_id && validInvoice.invoice_number && validInvoice.amount !== undefined && validInvoice.invoice_date) {
      validData.push(validInvoice);
    }
  });
  
  return { valid, data: validData, errors, warnings, messages };
}

/**
 * Validates invoice line items data
 * @param lineItems The line items to validate
 * @param invoiceIndex The parent invoice index for error messages
 * @param errors Array to collect errors
 * @param warnings Array to collect warnings
 * @param messages Array to collect validation messages
 * @returns Array of valid line items
 */
export function validateInvoiceLineItems(
  lineItems: any[], 
  invoiceIndex: number, 
  errors: ValidationError[],
  warnings: ValidationError[],
  messages: ValidationMessage[]
): InvoiceLineItem[] {
  const validLineItems: InvoiceLineItem[] = [];
  
  lineItems.forEach((item, itemIndex) => {
    const validItem: Partial<InvoiceLineItem> = {};
    let isItemValid = true;
    
    // Required fields
    if (!item.description) {
      const error = {
        path: `[${invoiceIndex}].line_items[${itemIndex}].description`,
        message: `Row ${invoiceIndex + 1}, Item ${itemIndex + 1}: Description is required`
      };
      errors.push(error);
      messages.push({
        type: 'error',
        field: `line_items[${itemIndex}].description`,
        message: `Row ${invoiceIndex + 1}, Item ${itemIndex + 1}: Description is required`,
        row: invoiceIndex,
        value: null
      });
      isItemValid = false;
    } else {
      validItem.description = item.description;
    }
    
    // Unit price validation
    if (item.unit_price !== undefined) {
      if (isNaN(Number(item.unit_price)) || Number(item.unit_price) < 0) {
        const error = {
          path: `[${invoiceIndex}].line_items[${itemIndex}].unit_price`,
          message: `Row ${invoiceIndex + 1}, Item ${itemIndex + 1}: Unit price must be a positive number`
        };
        errors.push(error);
        messages.push({
          type: 'error',
          field: `line_items[${itemIndex}].unit_price`,
          message: `Row ${invoiceIndex + 1}, Item ${itemIndex + 1}: Unit price must be a positive number`,
          row: invoiceIndex,
          value: item.unit_price
        });
        isItemValid = false;
      } else {
        validItem.unit_price = Number(item.unit_price);
      }
    } else {
      validItem.unit_price = 0;
    }
    
    // Quantity validation
    if (item.quantity !== undefined) {
      if (isNaN(Number(item.quantity)) || Number(item.quantity) <= 0) {
        const error = {
          path: `[${invoiceIndex}].line_items[${itemIndex}].quantity`,
          message: `Row ${invoiceIndex + 1}, Item ${itemIndex + 1}: Quantity must be a positive number`
        };
        errors.push(error);
        messages.push({
          type: 'error',
          field: `line_items[${itemIndex}].quantity`,
          message: `Row ${invoiceIndex + 1}, Item ${itemIndex + 1}: Quantity must be a positive number`,
          row: invoiceIndex,
          value: item.quantity
        });
        isItemValid = false;
      } else {
        validItem.quantity = Number(item.quantity);
      }
    } else {
      validItem.quantity = 1;
    }
    
    // Add other fields
    validItem.id = item.id;
    validItem.invoice_id = item.invoice_id;
    validItem.tax_type = item.tax_type;
    
    // Add to valid items if all required fields are present
    if (isItemValid && validItem.description && validItem.unit_price !== undefined && validItem.quantity !== undefined) {
      validLineItems.push(validItem as InvoiceLineItem);
    }
  });
  
  return validLineItems;
}
