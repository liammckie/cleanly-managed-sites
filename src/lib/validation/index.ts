
/**
 * Centralized validation module
 * Exports all validation utilities, schemas and helpers
 */

// Export core validation utilities
export * from './core/validationCore';
export * from './core/formatValidators';
export * from './core/errorFormatters';

// Export schemas
export * from './schemas/userSchema';
export * from './schemas/siteSchema';
export * from './schemas/clientSchema';
export * from './schemas/contactSchema';
export * from './schemas/businessSchema';
export * from './schemas/quoteSchema';
export * from './schemas/contractSchema';

// Core validation utility for Zod schemas
export const validateWithZod = <T>(schema: any, data: any): { 
  success: boolean; 
  data?: T; 
  errors?: Record<string, string>;
} => {
  try {
    const result = schema.parse(data);
    return {
      success: true,
      data: result as T
    };
  } catch (error: any) {
    // Format zod errors into a more usable structure
    const formattedErrors: Record<string, string> = {};
    
    if (error.errors) {
      error.errors.forEach((err: any) => {
        const path = err.path.join('.');
        formattedErrors[path] = err.message;
      });
    }
    
    return {
      success: false,
      errors: formattedErrors
    };
  }
};
