
import { z } from 'zod';
import { isValidDateFormat } from './commonValidation';
import { simplifyValidationErrors, validateRequiredFields, ValidationError } from './commonValidation';

// Schema for contract validation
const contractSchema = z.object({
  site_id: z.string().uuid("Invalid site ID format"),
  contract_number: z.string().optional().nullable(),
  start_date: z.string().refine(val => !val || isValidDateFormat(val), {
    message: "Invalid start date format (use YYYY-MM-DD)"
  }),
  end_date: z.string().refine(val => !val || isValidDateFormat(val), {
    message: "Invalid end date format (use YYYY-MM-DD)"
  }),
  value: z.number().optional().nullable(),
  auto_renewal: z.boolean().optional(),
  renewal_period: z.union([z.string(), z.number()]).optional().nullable(),
  renewal_notice_days: z.number().optional().nullable(),
  termination_period: z.string().optional().nullable(),
  billing_cycle: z.string().optional().nullable(),
  contract_type: z.string().optional().nullable(),
  service_frequency: z.string().optional().nullable(),
  service_delivery_method: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.string().optional().nullable()
});

/**
 * Validate contract data
 */
export function validateContractData(contracts: any[]) {
  const errors: ValidationError[] = [];
  const validContracts: any[] = [];
  
  contracts.forEach((contract, index) => {
    // Required fields check
    const requiredFields = ['site_id'];
    const requiredErrors = validateRequiredFields(contract, requiredFields);
    
    Object.entries(requiredErrors).forEach(([field, message]) => {
      errors.push({
        field: `${index}.${field}`,
        message
      });
    });
    
    // Date validation
    if (contract.start_date && !isValidDateFormat(contract.start_date)) {
      errors.push({
        field: `${index}.start_date`,
        message: 'Invalid start date format (use YYYY-MM-DD)'
      });
    }
    
    if (contract.end_date && !isValidDateFormat(contract.end_date)) {
      errors.push({
        field: `${index}.end_date`,
        message: 'Invalid end date format (use YYYY-MM-DD)'
      });
    }
    
    // Schema validation
    const result = contractSchema.safeParse(contract);
    if (!result.success) {
      const schemaErrors = simplifyValidationErrors(result.error);
      Object.entries(schemaErrors).forEach(([field, message]) => {
        errors.push({
          field: `${index}.${field}`,
          message
        });
      });
    } else {
      validContracts.push(contract);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    validContracts
  };
}
