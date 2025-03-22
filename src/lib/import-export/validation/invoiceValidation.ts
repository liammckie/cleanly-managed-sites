
import { ValidationMessage, ValidationResult } from '../types';
import { InvoiceRecord, InvoiceLineItemRecord } from '../types';

// Validate invoice data
export const validateInvoiceData = (data: any[]): ValidationResult => {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];
  const validData: Partial<InvoiceRecord>[] = [];
  
  data.forEach((row, index) => {
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
    
    if (!row.amount && row.amount !== 0) {
      errors.push({
        row: index + 1,
        field: 'amount',
        message: 'Invoice amount is required',
        value: row.amount
      });
    }
    
    if (!row.status) {
      warnings.push({
        row: index + 1,
        field: 'status',
        message: 'Invoice status is missing, will default to "draft"',
        value: row.status
      });
    } else if (!['draft', 'sent', 'paid', 'overdue', 'void'].includes(row.status)) {
      warnings.push({
        row: index + 1,
        field: 'status',
        message: 'Invoice status should be one of: draft, sent, paid, overdue, void',
        value: row.status
      });
    }
    
    // Check date formats
    if (row.invoice_date && !/^\d{4}-\d{2}-\d{2}$/.test(row.invoice_date)) {
      warnings.push({
        row: index + 1,
        field: 'invoice_date',
        message: 'Invoice date should be in YYYY-MM-DD format',
        value: row.invoice_date
      });
    }
    
    if (row.due_date && !/^\d{4}-\d{2}-\d{2}$/.test(row.due_date)) {
      warnings.push({
        row: index + 1,
        field: 'due_date',
        message: 'Due date should be in YYYY-MM-DD format',
        value: row.due_date
      });
    }
    
    // Add the row to validData if it has all required fields
    if (row.client_id && row.invoice_date && (row.amount !== undefined)) {
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
        message: 'Line item description is required',
        value: row.description
      });
    }
    
    if (row.quantity === undefined || row.quantity === null) {
      warnings.push({
        row: index + 1,
        field: 'quantity',
        message: 'Line item quantity is missing, will default to 1',
        value: row.quantity
      });
    }
    
    if (row.unit_price === undefined || row.unit_price === null) {
      errors.push({
        row: index + 1,
        field: 'unit_price',
        message: 'Line item unit price is required',
        value: row.unit_price
      });
    }
    
    // Add the row to validData if it has all required fields
    if (row.invoice_id && row.description && row.unit_price !== undefined) {
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
