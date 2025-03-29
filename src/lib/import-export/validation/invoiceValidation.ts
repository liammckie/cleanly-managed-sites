
import { z } from 'zod';
import { isValidDateFormat } from './commonValidation';
import { simplifyValidationErrors, validateRequiredFields, ValidationError } from './commonValidation';

// Schema for invoice validation
const invoiceSchema = z.object({
  invoice_number: z.string().min(1, "Invoice number is required"),
  client_id: z.string().uuid("Invalid client ID format"),
  site_id: z.string().uuid("Invalid site ID format").optional().nullable(),
  amount: z.number().min(0, "Amount must be non-negative"),
  invoice_date: z.string().refine(val => isValidDateFormat(val), {
    message: "Invalid invoice date format (use YYYY-MM-DD)"
  }),
  due_date: z.string().refine(val => !val || isValidDateFormat(val), {
    message: "Invalid due date format (use YYYY-MM-DD)"
  }).optional().nullable(),
  status: z.string().min(1, "Status is required"),
  notes: z.string().optional().nullable()
});

/**
 * Validate invoice data
 */
export function validateInvoiceData(invoices: any[]) {
  const errors: ValidationError[] = [];
  const validInvoices: any[] = [];
  
  invoices.forEach((invoice, index) => {
    // Required fields check
    const requiredFields = ['invoice_number', 'client_id', 'amount', 'invoice_date', 'status'];
    const requiredErrors = validateRequiredFields(invoice, requiredFields);
    
    Object.entries(requiredErrors).forEach(([field, message]) => {
      errors.push({
        field: `${index}.${field}`,
        message
      });
    });
    
    // Date validation
    if (invoice.invoice_date && !isValidDateFormat(invoice.invoice_date)) {
      errors.push({
        field: `${index}.invoice_date`,
        message: 'Invalid invoice date format (use YYYY-MM-DD)'
      });
    }
    
    if (invoice.due_date && !isValidDateFormat(invoice.due_date)) {
      errors.push({
        field: `${index}.due_date`,
        message: 'Invalid due date format (use YYYY-MM-DD)'
      });
    }
    
    // Schema validation
    const result = invoiceSchema.safeParse(invoice);
    if (!result.success) {
      const schemaErrors = simplifyValidationErrors(result.error);
      Object.entries(schemaErrors).forEach(([field, message]) => {
        errors.push({
          field: `${index}.${field}`,
          message
        });
      });
    } else {
      validInvoices.push(invoice);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    validInvoices
  };
}
