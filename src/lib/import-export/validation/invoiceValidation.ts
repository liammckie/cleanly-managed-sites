
import { ValidationMessage, ValidationResult } from '../types';
import { InvoiceRecord, InvoiceLineItemRecord } from '../types';

// Validate invoice data
export const validateInvoiceData = (data: any[]): ValidationResult => {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];
  const validData: Partial<InvoiceRecord>[] = [];
  
  data.forEach((row, index) => {
    // Required fields
    if (!row.client_id) {
      errors.push({
        row: index + 1,
        field: 'client_id',
        message: 'Client ID is required',
        value: row.client_id
      });
    }
    
    if (!row.invoice_date) {
      errors.push({
        row: index + 1,
        field: 'invoice_date',
        message: 'Invoice date is required',
        value: row.invoice_date
      });
    }
    
    if (row.amount === undefined || row.amount === null) {
      errors.push({
        row: index + 1,
        field: 'amount',
        message: 'Amount is required',
        value: row.amount
      });
    }
    
    // Date validations
    const dateFields = ['invoice_date', 'due_date'];
    dateFields.forEach(field => {
      if (row[field] && !/^\d{4}-\d{2}-\d{2}$/.test(row[field])) {
        warnings.push({
          row: index + 1,
          field,
          message: `${field} should be in YYYY-MM-DD format`,
          value: row[field]
        });
      }
    });
    
    // Numeric field validations
    if (row.amount !== undefined && isNaN(parseFloat(row.amount))) {
      warnings.push({
        row: index + 1,
        field: 'amount',
        message: 'Amount must be a number',
        value: row.amount
      });
    }
    
    // Status validation
    if (row.status && !['draft', 'sent', 'paid', 'overdue', 'void'].includes(row.status)) {
      warnings.push({
        row: index + 1,
        field: 'status',
        message: 'Status should be one of: draft, sent, paid, overdue, void',
        value: row.status
      });
    }
    
    // Add the row to validData if it has all required fields
    if (row.client_id && row.invoice_date && row.amount !== undefined && row.amount !== null) {
      // Add to valid data even with warnings
      validData.push(row);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: validData
  };
};

// Validate invoice line item data
export const validateInvoiceLineItemData = (data: any[]): ValidationResult => {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];
  const validData: Partial<InvoiceLineItemRecord>[] = [];
  
  data.forEach((row, index) => {
    // Required fields
    if (!row.invoice_id) {
      errors.push({
        row: index + 1,
        field: 'invoice_id',
        message: 'Invoice ID is required',
        value: row.invoice_id
      });
    }
    
    if (!row.description) {
      errors.push({
        row: index + 1,
        field: 'description',
        message: 'Description is required',
        value: row.description
      });
    }
    
    if (row.quantity === undefined || row.quantity === null) {
      errors.push({
        row: index + 1,
        field: 'quantity',
        message: 'Quantity is required',
        value: row.quantity
      });
    }
    
    if (row.unit_price === undefined || row.unit_price === null) {
      errors.push({
        row: index + 1,
        field: 'unit_price',
        message: 'Unit price is required',
        value: row.unit_price
      });
    }
    
    // Numeric field validations
    const numericFields = ['quantity', 'unit_price'];
    numericFields.forEach(field => {
      if (row[field] !== undefined && isNaN(parseFloat(row[field]))) {
        warnings.push({
          row: index + 1,
          field,
          message: `${field} must be a number`,
          value: row[field]
        });
      }
    });
    
    // Add the row to validData if it has all required fields
    if (row.invoice_id && row.description && 
        row.quantity !== undefined && row.quantity !== null && 
        row.unit_price !== undefined && row.unit_price !== null) {
      // Add to valid data even with warnings
      validData.push(row);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: validData
  };
};
