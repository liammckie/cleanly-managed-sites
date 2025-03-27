
import { validateGenericData, validateNumber, validateDateFormat } from './commonValidation';
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
      
      const dueDateError = validateDateFormat(item.due_date, 'due_date', index);
      if (dueDateError) errors.push(dueDateError);
      
      // Validate amount
      const amountError = validateNumber(item.amount, 'amount', index);
      if (amountError) errors.push(amountError);
      
      // Status validation
      if (!['draft', 'sent', 'paid', 'overdue', 'cancelled'].includes(item.status)) {
        errors.push({
          path: 'status',
          message: 'Status must be one of: draft, sent, paid, overdue, cancelled',
          row: index,
          value: item.status
        });
      }
      
      // Validate line items if present
      if (item.line_items) {
        if (typeof item.line_items === 'string') {
          try {
            item.line_items = JSON.parse(item.line_items);
          } catch (e) {
            errors.push({
              path: 'line_items',
              message: 'Line items must be valid JSON',
              row: index,
              value: item.line_items
            });
          }
        }
        
        if (Array.isArray(item.line_items)) {
          item.line_items.forEach((lineItem, lineIndex) => {
            if (!lineItem.description) {
              errors.push({
                path: `line_items[${lineIndex}].description`,
                message: 'Description is required for line item',
                row: index
              });
            }
            
            const quantityError = validateNumber(lineItem.quantity, `line_items[${lineIndex}].quantity`, index);
            if (quantityError) errors.push(quantityError);
            
            const unitPriceError = validateNumber(lineItem.unit_price, `line_items[${lineIndex}].unit_price`, index);
            if (unitPriceError) errors.push(unitPriceError);
          });
        }
      }
      
      return errors;
    }
  );
}
