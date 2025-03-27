
import { validateClientData } from './validation/clientValidation';
import { 
  LegacyValidationResult, 
  newToLegacyValidationResult, 
  ClientImportItem,
  ValidationResult
} from './types';

export function processClientImport(data: any[]): { 
  validItems: ClientImportItem[], 
  invalidItems: any[],
  messages: string[]
} {
  const validItems: ClientImportItem[] = [];
  const invalidItems: any[] = [];
  const messages: string[] = [];

  for (const item of data) {
    const result = validateClientData(item) as ValidationResult<ClientImportItem>;
    // Convert new validation result to legacy format for compatibility
    const legacyResult = newToLegacyValidationResult(result);
    
    if (legacyResult.isValid && legacyResult.data) {
      validItems.push(legacyResult.data);
    } else {
      invalidItems.push({
        item,
        errors: legacyResult.errors
      });
    }
  }

  return { validItems, invalidItems, messages };
}
