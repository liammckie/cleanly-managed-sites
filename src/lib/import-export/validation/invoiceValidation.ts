
import { validateGenericData, validateDateFormat, validateEmail } from './commonValidation';
import { ValidationError, ValidationResult } from './types';
import { InvoiceRecord } from '../types';

/**
 * Validates invoice data for import
 * @param data The invoice data to validate
 * @returns A validation result
 */
export function validateInvoiceData(data: any[]): ValidationResult<InvoiceRecord[]> {
  const requiredFields = ['invoice_number', 'client_id', 'amount', 'invoice_date', 'status'];
  
  return validateGenericData<InvoiceRecord>(
    data,
    requiredFields,
    (item, index) => {
      const errors: ValidationError[] = [];
      
      // Validate dates
      const invoiceDateError = validateDateFormat(item.invoice_date, 'invoice_date', index);
      if (invoiceDateError) errors.push(invoiceDateError);
      
      if (item.due_date) {
        const dueDateError = validateDateFormat(item.due_date, 'due_date', index);
        if (dueDateError) errors.push(dueDateError);
        
        // Check that due date is not before invoice date
        if (new Date(item.due_date) < new Date(item.invoice_date)) {
          errors.push({
            path: 'due_date',
            message: 'Due date cannot be before invoice date',
            row: index,
            value: item.due_date
          });
        }
      }
      
      // Validate numeric fields
      if (isNaN(Number(item.amount)) || Number(item.amount) <= 0) {
        errors.push({
          path: 'amount',
          message: 'Amount must be a positive number',
          row: index,
          value: item.amount
        });
      }
      
      // Status validation
      const validStatuses = ['draft', 'sent', 'paid', 'overdue', 'cancelled', 'void'];
      if (item.status && !validStatuses.includes(item.status)) {
        errors.push({
          path: 'status',
          message: `Status must be one of: ${validStatuses.join(', ')}`,
          row: index,
          value: item.status
        });
      }
      
      // Validate line items if present
      if (item.line_items && Array.isArray(item.line_items)) {
        item.line_items.forEach((lineItem, lineIndex) => {
          // Validate required fields for line items
          if (!lineItem.description) {
            errors.push({
              path: `line_items[${lineIndex}].description`,
              message: 'Line item description is required',
              row: index
            });
          }
          
          if (isNaN(Number(lineItem.quantity)) || Number(lineItem.quantity) <= 0) {
            errors.push({
              path: `line_items[${lineIndex}].quantity`,
              message: 'Line item quantity must be a positive number',
              row: index,
              value: lineItem.quantity
            });
          }
          
          if (isNaN(Number(lineItem.unit_price))) {
            errors.push({
              path: `line_items[${lineIndex}].unit_price`,
              message: 'Line item unit price must be a number',
              row: index,
              value: lineItem.unit_price
            });
          }
        });
      }
      
      return errors;
    }
  );
}

/**
 * Exports validation functions for explicit imports
 */
export const invoiceValidation = {
  validateInvoiceData
};
