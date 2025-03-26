
import { Day as AwardDay } from '@/lib/award/types';
import { Day as QuoteDay } from '@/lib/types/award/types';
import { Json } from '@/lib/types';
import { QuoteShift as AwardQuoteShift } from '@/lib/award/types';
import { QuoteShift as TypesQuoteShift } from '@/lib/types/award/types';
import { QuoteShift as QuotesQuoteShift } from '@/lib/types/quotes';
import { Quote as AwardQuote } from '@/lib/award/types';
import { Quote as TypesQuote } from '@/lib/types/award/types';
import { Quote as QuotesQuote } from '@/lib/types/quotes';
import { Quote as QuoteTypesQuote } from '@/lib/types/quoteTypes';
import { Frequency } from '@/types/common';

/**
 * Unified Day type with all possible values to avoid TypeScript errors
 */
export type UnifiedDay = 
  | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" 
  | "saturday" | "sunday" | "weekday" | "public_holiday";

/**
 * Unified Frequency type
 */
export type UnifiedFrequency = 
  | "daily" | "weekly" | "fortnightly" | "monthly" | "quarterly" | "yearly" | "once" 
  | "annually"; // Add annually for compatibility

/**
 * Converts a string day to the appropriate Day type
 * This helps us handle inconsistencies between different Day type definitions
 */
export function adaptDay(day: string): UnifiedDay {
  return day as UnifiedDay;
}

/**
 * Adapts a frequency string to ensure compatibility
 */
export function adaptFrequency(frequency: string): UnifiedFrequency {
  return frequency as UnifiedFrequency;
}

/**
 * Type assertion helper to safely cast QuoteShift types between different modules
 */
export function adaptQuoteShift<T, U>(shift: T): U {
  if (shift && typeof shift === 'object' && 'day' in shift) {
    // Make a copy to avoid modifying the original
    const newShift = { ...shift as any };
    // Ensure day is a string
    if (newShift.day) {
      newShift.day = adaptDay(newShift.day as any);
    }
    return newShift as unknown as U;
  }
  return shift as unknown as U;
}

/**
 * Type assertion helper for Quote objects between different modules
 */
export function adaptQuote<T, U>(quote: T): U {
  if (quote && typeof quote === 'object') {
    const newQuote = { ...quote as any };
    
    // If the quote has shifts, adapt each shift
    if ('shifts' in newQuote && Array.isArray(newQuote.shifts)) {
      newQuote.shifts = newQuote.shifts.map((shift: any) => 
        adaptQuoteShift(shift)
      );
    }
    
    // If the quote has subcontractors, adapt each one
    if ('subcontractors' in newQuote && Array.isArray(newQuote.subcontractors)) {
      newQuote.subcontractors = newQuote.subcontractors.map((sub: any) => {
        if (sub.frequency) {
          sub.frequency = adaptFrequency(sub.frequency);
        }
        return sub;
      });
    }
    
    return newQuote as unknown as U;
  }
  return quote as unknown as U;
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
