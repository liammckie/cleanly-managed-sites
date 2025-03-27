
import { validateClientData } from './validation/clientValidation';
import { LegacyValidationResult } from './types';
import { ClientImportItem } from '@/types/import-export';

export function processClientImport(data: any[]): { 
  validItems: ClientImportItem[], 
  invalidItems: any[],
  messages: string[]
} {
  const validItems: ClientImportItem[] = [];
  const invalidItems: any[] = [];
  const messages: string[] = [];

  for (const item of data) {
    const result = validateClientData(item) as LegacyValidationResult<ClientImportItem>;
    if (result.isValid && result.data) {
      validItems.push(result.data);
    } else {
      invalidItems.push({
        item,
        errors: result.errors
      });
    }
  }

  return { validItems, invalidItems, messages };
}
