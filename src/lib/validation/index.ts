
// Export all validation schemas for easy imports
export * from './userSchema';
export * from './siteSchema';
export * from './clientSchema';
export * from './contactSchema';
export * from './businessSchema';
export * from './quoteSchema';

// Validation utilities
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
