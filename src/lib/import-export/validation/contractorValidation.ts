
import { z } from 'zod';
import { isValidEmail } from './commonValidation';
import { simplifyValidationErrors, validateRequiredFields, ValidationError } from './commonValidation';

// Schema for contractor validation
const contractorSchema = z.object({
  business_name: z.string().min(1, "Business name is required"),
  contact_name: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email format").optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postcode: z.string().optional().nullable(),
  status: z.enum(['active', 'inactive', 'pending']).optional(),
  contractor_type: z.string().min(1, "Contractor type is required"),
  abn: z.string().optional().nullable(),
  specialty: z.array(z.string()).optional().nullable(),
  notes: z.string().optional().nullable()
});

/**
 * Validate contractor data
 */
export function validateContractorData(contractors: any[]) {
  const errors: ValidationError[] = [];
  const validContractors: any[] = [];
  
  contractors.forEach((contractor, index) => {
    // Required fields check
    const requiredFields = ['business_name', 'contact_name', 'contractor_type'];
    const requiredErrors = validateRequiredFields(contractor, requiredFields);
    
    Object.entries(requiredErrors).forEach(([field, message]) => {
      errors.push({
        field: `${index}.${field}`,
        message
      });
    });
    
    // Email validation if present
    if (contractor.email && !isValidEmail(contractor.email)) {
      errors.push({
        field: `${index}.email`,
        message: 'Invalid email format'
      });
    }
    
    // Schema validation
    const result = contractorSchema.safeParse(contractor);
    if (!result.success) {
      const schemaErrors = simplifyValidationErrors(result.error);
      Object.entries(schemaErrors).forEach(([field, message]) => {
        errors.push({
          field: `${index}.${field}`,
          message
        });
      });
    } else {
      validContractors.push(contractor);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    validContractors
  };
}
