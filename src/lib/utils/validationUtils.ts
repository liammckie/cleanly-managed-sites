
/**
 * Legacy validation utilities file - most functionality has been moved to /lib/validation/*
 * This file is maintained for backward compatibility
 */

import { ValidationError, ValidationResult } from '@/lib/types/validationTypes';
import {
  isValidEmail as checkValidEmail,
  isValidDateFormat as checkValidDateFormat
} from '@/lib/validation/core/formatValidators';
import {
  validateRequiredFields as checkRequiredFields,
  mergeValidationResults as combinedResults
} from '@/lib/validation/core/validationCore';
import {
  simplifyValidationErrors as simplifyErrors
} from '@/lib/validation/core/errorFormatters';

// Re-export for backward compatibility
export const simplifyValidationErrors = simplifyErrors;
export const isValidEmail = checkValidEmail;
export const isValidDateFormat = checkValidDateFormat;
export const validateRequiredFields = checkRequiredFields;
export const mergeValidationResults = combinedResults;
