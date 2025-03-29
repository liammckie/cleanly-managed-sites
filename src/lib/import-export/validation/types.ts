
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
} from '../../types/validationTypes';

export {
  legacyToNewValidationResult,
  newToLegacyValidationResult
} from '../../types/validationTypes';
