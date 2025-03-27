
import { Quote, QuoteShift } from '@/lib/award/types';

/**
 * Adapts a quote from database format to application format
 */
export function adaptQuote(dbQuote: any): Quote {
  return {
    id: dbQuote.id,
    name: dbQuote.name,
    client_name: dbQuote.client_name || dbQuote.clientName || '',
    site_name: dbQuote.site_name || dbQuote.siteName || '',
    status: dbQuote.status,
    overhead_percentage: dbQuote.overhead_percentage || dbQuote.overheadPercentage || 15,
    margin_percentage: dbQuote.margin_percentage || dbQuote.marginPercentage || 20,
    total_price: dbQuote.total_price || dbQuote.totalPrice || 0,
    labor_cost: dbQuote.labor_cost || dbQuote.laborCost || 0,
    supplies_cost: dbQuote.supplies_cost || dbQuote.suppliesCost || 0,
    equipment_cost: dbQuote.equipment_cost || dbQuote.equipmentCost || 0,
    subcontractor_cost: dbQuote.subcontractor_cost || dbQuote.subcontractorCost || 0,
    created_at: dbQuote.created_at || dbQuote.createdAt || new Date().toISOString(),
    updated_at: dbQuote.updated_at || dbQuote.updatedAt || new Date().toISOString(),
  };
}

/**
 * Adapts a list of quotes from database format to application format
 */
export function adaptModelsToQuotes(dbQuotes: any[]): Quote[] {
  return dbQuotes.map(adaptQuote);
}

/**
 * Adapts a quote shift from database format to application format
 */
export function adaptQuoteShift(dbShift: any): QuoteShift {
  return {
    id: dbShift.id,
    quoteId: dbShift.quote_id || dbShift.quoteId,
    day: dbShift.day,
    startTime: dbShift.start_time || dbShift.startTime,
    endTime: dbShift.end_time || dbShift.endTime,
    breakDuration: dbShift.break_duration || dbShift.breakDuration || 0,
    numberOfCleaners: dbShift.number_of_cleaners || dbShift.numberOfCleaners || 1,
    employmentType: dbShift.employment_type || dbShift.employmentType || 'casual',
    level: dbShift.level || 1,
    allowances: dbShift.allowances || [],
    estimatedCost: dbShift.estimated_cost || dbShift.estimatedCost || 0,
    location: dbShift.location || '',
    notes: dbShift.notes || '',
  };
}

/**
 * Convert camelCase to snake_case
 */
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Convert snake_case to camelCase
 */
export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Adapts an object's keys from camelCase to snake_case
 */
export function adaptObjectToSnakeCase(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const snakeKey = toSnakeCase(key);
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[snakeKey] = adaptObjectToSnakeCase(value);
      } else {
        result[snakeKey] = value;
      }
    }
  }
  
  return result;
}

/**
 * Adapts an object's keys from snake_case to camelCase
 */
export function adaptObjectToCamelCase(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const camelKey = toCamelCase(key);
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[camelKey] = adaptObjectToCamelCase(value);
      } else {
        result[camelKey] = value;
      }
    }
  }
  
  return result;
}
