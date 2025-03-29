
import { z } from 'zod';
import { isValidEmail } from './commonValidation';
import { simplifyValidationErrors, validateRequiredFields, ValidationError } from './commonValidation';

// Schema for site validation
const siteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postcode: z.string().optional().nullable(),
  status: z.enum(['active', 'inactive', 'pending', 'on-hold', 'lost']).optional(),
  client_id: z.string().uuid("Invalid client ID format").optional().nullable(),
  email: z.string().email("Invalid email format").optional().nullable(),
  phone: z.string().optional().nullable(),
  representative: z.string().optional().nullable()
});

/**
 * Validate site data
 */
export function validateSiteData(sites: any[]) {
  const errors: ValidationError[] = [];
  const validSites: any[] = [];
  
  sites.forEach((site, index) => {
    // Required fields check
    const requiredFields = ['name', 'address'];
    const requiredErrors = validateRequiredFields(site, requiredFields);
    
    Object.entries(requiredErrors).forEach(([field, message]) => {
      errors.push({
        field: `${index}.${field}`,
        message
      });
    });
    
    // Email validation if present
    if (site.email && !isValidEmail(site.email)) {
      errors.push({
        field: `${index}.email`,
        message: 'Invalid email format'
      });
    }
    
    // Schema validation
    const result = siteSchema.safeParse(site);
    if (!result.success) {
      const schemaErrors = simplifyValidationErrors(result.error);
      Object.entries(schemaErrors).forEach(([field, message]) => {
        errors.push({
          field: `${index}.${field}`,
          message
        });
      });
    } else {
      validSites.push(site);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    validSites
  };
}
