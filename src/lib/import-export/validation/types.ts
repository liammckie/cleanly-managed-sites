
/**
 * Re-export validation types for easier access
 * This file is maintained for backward compatibility
 */
export type { 
  ValidationError,
  ValidationMessage,
  ValidationResult,
  ValidationOptions,
  LegacyValidationResult,
  ZodValidationResult
} from '@/lib/types';

export {
  legacyToNewValidationResult,
  newToLegacyValidationResult
} from '@/lib/types/validationTypes';
