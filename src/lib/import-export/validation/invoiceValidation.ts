
import { validateGenericData, validateDateFormat } from './commonValidation';
import { ValidationError, ValidationResult } from './types';
import { InvoiceRecord } from '@/lib/import-export/types';

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
      if (item.invoice_date) {
        const invoiceDateError = validateDateFormat(item.invoice_date, 'invoice_date', index);
        if (invoiceDateError) errors.push(invoiceDateError);
      }
      
      if (item.due_date) {
        const dueDateError = validateDateFormat(item.due_date, 'due_date', index);
        if (dueDateError) errors.push(dueDateError);
        
        // Check that due date is after invoice date
        if (item.invoice_date && new Date(item.due_date) < new Date(item.invoice_date)) {
          errors.push({
            path: 'due_date',
            message: 'Due date must be on or after invoice date',
            row: index,
            value: item.due_date
          });
        }
      }
      
      // Validate amount
      if (isNaN(Number(item.amount))) {
        errors.push({
          path: 'amount',
          message: 'Amount must be a number',
          row: index,
          value: item.amount
        });
      }
      
      // Validate status
      if (!['draft', 'sent', 'paid', 'overdue', 'cancelled', 'void'].includes(item.status)) {
        errors.push({
          path: 'status',
          message: 'Status must be one of: draft, sent, paid, overdue, cancelled, void',
          row: index,
          value: item.status
        });
      }
      
      // Validate line items if present
      if (item.line_items && !Array.isArray(item.line_items)) {
        errors.push({
          path: 'line_items',
          message: 'Line items must be an array',
          row: index,
          value: item.line_items
        });
      } else if (Array.isArray(item.line_items)) {
        item.line_items.forEach((lineItem: any, lineIndex: number) => {
          if (!lineItem.description) {
            errors.push({
              path: `line_items[${lineIndex}].description`,
              message: 'Line item description is required',
              row: index,
              value: lineItem
            });
          }
          
          if (isNaN(Number(lineItem.quantity))) {
            errors.push({
              path: `line_items[${lineIndex}].quantity`,
              message: 'Line item quantity must be a number',
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
