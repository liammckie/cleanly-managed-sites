
import { Day, JsonValue, JsonObject } from '@/types/common';
import { QuoteShift, QuoteSubcontractor } from '@/types/models';

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
export function adaptQuoteShift<T>(shift: T): T {
  if (shift && typeof shift === 'object' && 'day' in shift) {
    // Make a copy to avoid modifying the original
    const newShift = { ...shift as any };
    // Ensure day is a string
    if (newShift.day) {
      newShift.day = adaptDay(newShift.day as any);
    }
    return newShift as unknown as T;
  }
  return shift;
}

/**
 * Type assertion helper for Quote objects between different modules
 */
export function adaptQuote<T>(quote: T): T {
  if (quote && typeof quote === 'object') {
    const newQuote = { ...quote as any };
    
    // If the quote has shifts, adapt each shift
    if ('shifts' in newQuote && Array.isArray(newQuote.shifts)) {
      newQuote.shifts = newQuote.shifts.map((shift: any) => 
        adaptQuoteShift(shift)
      );
    }
    
    return newQuote as unknown as T;
  }
  return quote;
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
  frequency: string;
  email?: string;
  phone?: string;
  services?: string[];
  service?: string;
  notes?: string;
  customServices?: string;
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
 * Functions to convert between DB and app model for QuoteSubcontractors
 */
export function dbToQuoteSubcontractor(dbSubcontractor: any): QuoteSubcontractor {
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

export function quoteSubcontractorToDb(subcontractor: QuoteSubcontractor): any {
  return {
    id: subcontractor.id,
    quote_id: subcontractor.quoteId,
    name: subcontractor.name,
    description: subcontractor.description || '',
    cost: subcontractor.cost || 0,
    frequency: subcontractor.frequency || 'monthly',
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
