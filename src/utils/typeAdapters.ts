
import { Day, JsonValue, JsonObject } from '@/types/common';
import { QuoteShift, QuoteSubcontractor, Quote } from '@/types/models';

/**
 * Unified Day type with all possible values to avoid TypeScript errors
 */
export type UnifiedDay = 
  | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" 
  | "saturday" | "sunday" | "weekday" | "public_holiday";

/**
 * Converts a string day to the appropriate Day type
 * This helps us handle inconsistencies between different Day type definitions
 */
export function adaptDay(day: string): UnifiedDay {
  return day as UnifiedDay;
}

/**
 * Type assertion helper to safely cast QuoteShift types between different modules
 */
export function adaptQuoteShift<T>(shift: T): QuoteShift {
  if (shift && typeof shift === 'object' && 'day' in shift) {
    // Make a copy to avoid modifying the original
    const newShift = { ...shift as any };
    // Ensure day is a string
    if (newShift.day) {
      newShift.day = adaptDay(newShift.day as any);
    }
    
    // Map DB snake_case to camelCase if needed
    if ('quote_id' in newShift && !('quoteId' in newShift)) {
      newShift.quoteId = newShift.quote_id;
    }
    
    if ('start_time' in newShift && !('startTime' in newShift)) {
      newShift.startTime = newShift.start_time;
    }
    
    if ('end_time' in newShift && !('endTime' in newShift)) {
      newShift.endTime = newShift.end_time;
    }
    
    if ('break_duration' in newShift && !('breakDuration' in newShift)) {
      newShift.breakDuration = newShift.break_duration;
    }
    
    if ('number_of_cleaners' in newShift && !('numberOfCleaners' in newShift)) {
      newShift.numberOfCleaners = newShift.number_of_cleaners;
    }
    
    if ('employment_type' in newShift && !('employmentType' in newShift)) {
      newShift.employmentType = newShift.employment_type;
    }
    
    if ('estimated_cost' in newShift && !('estimatedCost' in newShift)) {
      newShift.estimatedCost = newShift.estimated_cost;
    }
    
    return newShift as unknown as QuoteShift;
  }
  return shift as unknown as QuoteShift;
}

/**
 * Type assertion helper for Quote objects between different modules
 */
export function adaptQuote<T>(quote: T): Quote {
  if (quote && typeof quote === 'object') {
    const newQuote = { ...quote as any };
    
    // Map DB snake_case to camelCase if needed
    if ('client_name' in newQuote && !('clientName' in newQuote)) {
      newQuote.clientName = newQuote.client_name;
    }
    
    if ('site_name' in newQuote && !('siteName' in newQuote)) {
      newQuote.siteName = newQuote.site_name;
    }
    
    if ('overhead_percentage' in newQuote && !('overheadPercentage' in newQuote)) {
      newQuote.overheadPercentage = newQuote.overhead_percentage;
    }
    
    if ('margin_percentage' in newQuote && !('marginPercentage' in newQuote)) {
      newQuote.marginPercentage = newQuote.margin_percentage;
    }
    
    if ('total_price' in newQuote && !('totalPrice' in newQuote)) {
      newQuote.totalPrice = newQuote.total_price;
    }
    
    if ('labor_cost' in newQuote && !('laborCost' in newQuote)) {
      newQuote.laborCost = newQuote.labor_cost;
    }
    
    if ('subcontractor_cost' in newQuote && !('subcontractorCost' in newQuote)) {
      newQuote.subcontractorCost = newQuote.subcontractor_cost;
    }
    
    // If the quote has shifts, adapt each shift
    if ('shifts' in newQuote && Array.isArray(newQuote.shifts)) {
      newQuote.shifts = newQuote.shifts.map((shift: any) => 
        adaptQuoteShift(shift)
      );
    }
    
    // If the quote has subcontractors, adapt each subcontractor
    if ('subcontractors' in newQuote && Array.isArray(newQuote.subcontractors)) {
      newQuote.subcontractors = newQuote.subcontractors.map((sub: any) => 
        adaptQuoteSubcontractor(sub)
      );
    }
    
    return newQuote as unknown as Quote;
  }
  return quote as unknown as Quote;
}

/**
 * Type assertion helper for SystemUser objects between different modules
 */
export function adaptSystemUser<T, U>(user: T): U {
  return user as unknown as U;
}

/**
 * Helper to convert from DB overhead profile to application model
 */
export interface DbOverheadProfile {
  id: string;
  name: string;
  description?: string;
  labor_percentage: number;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

/**
 * Application model for overhead profiles
 */
export interface OverheadProfile {
  id: string;
  name: string;
  description?: string;
  laborPercentage: number;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

/**
 * Convert DB overhead profile to application model
 */
export function dbToOverheadProfile(dbProfile: DbOverheadProfile): OverheadProfile {
  return {
    id: dbProfile.id,
    name: dbProfile.name,
    description: dbProfile.description,
    laborPercentage: dbProfile.labor_percentage,
    createdAt: dbProfile.created_at,
    updatedAt: dbProfile.updated_at,
    userId: dbProfile.user_id
  };
}

/**
 * Unified type for Subcontractor
 */
export interface UnifiedSubcontractor {
  id: string;
  quoteId?: string;
  quote_id?: string;
  name: string;
  description?: string;
  cost: number;
  frequency: string | any; // Make more flexible to avoid type errors
  email?: string;
  phone?: string;
  services?: string[];
  service?: string;
  notes?: string;
  customServices?: string;
  custom_services?: string;
  monthlyCost?: number;
  monthly_cost?: number;
  isFlatRate?: boolean;
  is_flat_rate?: boolean;
  business_name?: string;
  contact_name?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Database representation of a quote subcontractor
 */
export interface DbQuoteSubcontractor {
  id: string;
  quote_id: string;
  name: string;
  description?: string;
  cost: number;
  frequency: string;
  email?: string;
  phone?: string;
  service?: string;
  notes?: string;
  services?: string[];
  custom_services?: string;
  monthly_cost?: number;
  is_flat_rate?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Convert DB quote subcontractor to application model
 */
export function dbToQuoteSubcontractor(dbSubcontractor: DbQuoteSubcontractor): QuoteSubcontractor {
  return {
    id: dbSubcontractor.id,
    quoteId: dbSubcontractor.quote_id,
    name: dbSubcontractor.name,
    description: dbSubcontractor.description || '',
    cost: dbSubcontractor.cost || 0,
    frequency: dbSubcontractor.frequency || 'monthly',
    email: dbSubcontractor.email || '',
    phone: dbSubcontractor.phone || '',
    service: dbSubcontractor.service || '',
    notes: dbSubcontractor.notes || '',
    services: dbSubcontractor.services || [],
    customServices: dbSubcontractor.custom_services || '',
    monthlyCost: dbSubcontractor.monthly_cost || 0,
    isFlatRate: dbSubcontractor.is_flat_rate || false
  };
}

/**
 * Adapt any subcontractor object to QuoteSubcontractor type
 */
export function adaptQuoteSubcontractor(sub: any): QuoteSubcontractor {
  const result: QuoteSubcontractor = {
    id: sub.id || '',
    quoteId: sub.quoteId || sub.quote_id || '',
    name: sub.name || '',
    description: sub.description || '',
    cost: sub.cost || 0,
    frequency: sub.frequency || 'monthly',
    email: sub.email || '',
    phone: sub.phone || '',
    service: sub.service || '',
    notes: sub.notes || '',
    services: sub.services || [],
    customServices: sub.customServices || sub.custom_services || '',
    monthlyCost: sub.monthlyCost || sub.monthly_cost || 0,
    isFlatRate: sub.isFlatRate || sub.is_flat_rate || false
  };
  
  return result;
}

/**
 * Convert application model to DB quote subcontractor
 */
export function quoteSubcontractorToDb(subcontractor: QuoteSubcontractor): DbQuoteSubcontractor {
  return {
    id: subcontractor.id,
    quote_id: subcontractor.quoteId,
    name: subcontractor.name,
    description: subcontractor.description || '',
    cost: subcontractor.cost || 0,
    frequency: subcontractor.frequency?.toString() || 'monthly',
    email: subcontractor.email || '',
    phone: subcontractor.phone || '',
    service: subcontractor.service || '',
    notes: subcontractor.notes || '',
    services: subcontractor.services || [],
    custom_services: subcontractor.customServices || '',
    monthly_cost: subcontractor.monthlyCost || 0,
    is_flat_rate: subcontractor.isFlatRate || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

/**
 * Functions to convert between DB and app model for QuoteSubcontractors
 */
export function dbToQuoteSubcontractorArray(dbSubcontractors: any[]): QuoteSubcontractor[] {
  return (dbSubcontractors || []).map(sub => dbToQuoteSubcontractor(sub));
}
