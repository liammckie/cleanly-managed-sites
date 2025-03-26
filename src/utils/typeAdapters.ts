
import { Day, EmployeeLevel, EmploymentType, Frequency, QuoteStatus } from "@/types/common";
import { 
  DbOverheadProfile, 
  OverheadProfile, 
  Quote, 
  QuoteShift, 
  QuoteSubcontractor, 
  SystemUser 
} from "@/types/models";
import { 
  DbQuote, 
  DbQuoteShift, 
  DbQuoteSubcontractor 
} from "@/types/api";

/**
 * Unified Day type with all possible values to avoid TypeScript errors
 */
export type UnifiedDay = Day;

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
export function adaptQuoteShift<T extends Record<string, any>, U extends Record<string, any>>(shift: T): U {
  if (shift && typeof shift === 'object' && 'day' in shift) {
    // Make a copy to avoid modifying the original
    const newShift = { ...shift };
    // Ensure day is a valid Day type
    if (newShift.day) {
      newShift.day = adaptDay(newShift.day as string);
    }
    return newShift as unknown as U;
  }
  return shift as unknown as U;
}

/**
 * Adapter function to convert from DbQuoteShift to QuoteShift
 */
export function dbToQuoteShift(dbShift: DbQuoteShift): QuoteShift {
  return {
    id: dbShift.id,
    quoteId: dbShift.quote_id,
    day: adaptDay(dbShift.day),
    startTime: dbShift.start_time,
    endTime: dbShift.end_time,
    breakDuration: dbShift.break_duration,
    numberOfCleaners: dbShift.number_of_cleaners,
    employmentType: dbShift.employment_type as EmploymentType,
    level: dbShift.level as EmployeeLevel,
    allowances: Array.isArray(dbShift.allowances) ? dbShift.allowances : [],
    estimatedCost: dbShift.estimated_cost,
    location: dbShift.location || '',
    notes: dbShift.notes || ''
  };
}

/**
 * Adapter function to convert from QuoteShift to DbQuoteShift
 */
export function quoteShiftToDb(shift: QuoteShift): DbQuoteShift {
  return {
    id: shift.id,
    quote_id: shift.quoteId,
    day: shift.day,
    start_time: shift.startTime,
    end_time: shift.endTime,
    break_duration: shift.breakDuration,
    number_of_cleaners: shift.numberOfCleaners,
    employment_type: shift.employmentType,
    level: shift.level,
    allowances: shift.allowances || [],
    estimated_cost: shift.estimatedCost,
    location: shift.location,
    notes: shift.notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

/**
 * Adapter function to convert from DbQuoteSubcontractor to QuoteSubcontractor
 */
export function dbToQuoteSubcontractor(dbSub: DbQuoteSubcontractor): QuoteSubcontractor {
  return {
    id: dbSub.id,
    quoteId: dbSub.quote_id || '',
    name: dbSub.name,
    description: dbSub.description || '',
    cost: dbSub.cost,
    frequency: dbSub.frequency as Frequency,
    email: dbSub.email || '',
    phone: dbSub.phone || '',
    service: dbSub.service || '',
    notes: dbSub.notes || '',
    services: dbSub.services || [],
    customServices: '',
    monthlyCost: 0,
    isFlatRate: true
  };
}

/**
 * Adapter function to convert from QuoteSubcontractor to DbQuoteSubcontractor
 */
export function quoteSubcontractorToDb(sub: QuoteSubcontractor): DbQuoteSubcontractor {
  return {
    id: sub.id,
    quote_id: sub.quoteId,
    name: sub.name,
    description: sub.description || '',
    cost: sub.cost,
    frequency: sub.frequency,
    email: sub.email || '',
    phone: sub.phone || '',
    service: sub.service || '',
    notes: sub.notes || '',
    services: sub.services || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

/**
 * Adapter function to convert from DbQuote to Quote
 */
export function dbToQuote(dbQuote: DbQuote): Quote {
  return {
    id: dbQuote.id,
    name: dbQuote.name,
    title: dbQuote.title,
    client_name: dbQuote.client_name,
    clientName: dbQuote.client_name,
    site_name: dbQuote.site_name,
    siteName: dbQuote.site_name || '',
    description: dbQuote.description,
    status: dbQuote.status as QuoteStatus,
    overhead_percentage: dbQuote.overhead_percentage,
    overheadPercentage: dbQuote.overhead_percentage,
    margin_percentage: dbQuote.margin_percentage,
    marginPercentage: dbQuote.margin_percentage,
    total_price: dbQuote.total_price,
    totalPrice: dbQuote.total_price,
    labor_cost: dbQuote.labor_cost,
    laborCost: dbQuote.labor_cost,
    supplies_cost: dbQuote.supplies_cost,
    equipment_cost: dbQuote.equipment_cost,
    subcontractor_cost: dbQuote.subcontractor_cost,
    subcontractorCost: dbQuote.subcontractor_cost,
    created_at: dbQuote.created_at,
    createdAt: dbQuote.created_at,
    updated_at: dbQuote.updated_at,
    updatedAt: dbQuote.updated_at,
    overheadCost: dbQuote.overhead_cost || 0,
    totalCost: dbQuote.total_cost || 0,
    marginAmount: dbQuote.margin_amount || 0,
    start_date: dbQuote.start_date,
    startDate: dbQuote.start_date,
    end_date: dbQuote.end_date,
    endDate: dbQuote.end_date,
    expiry_date: dbQuote.expiry_date,
    expiryDate: dbQuote.expiry_date,
    contractLength: dbQuote.contract_length,
    contractLengthUnit: dbQuote.contract_length_unit as any,
    overheadProfile: dbQuote.overhead_profile,
    userId: dbQuote.user_id,
    createdBy: dbQuote.created_by,
    notes: dbQuote.notes || '',
    quote_number: dbQuote.quote_number,
    quoteNumber: dbQuote.quote_number,
    valid_until: dbQuote.valid_until,
    validUntil: dbQuote.valid_until,
    client_id: dbQuote.client_id,
    clientId: dbQuote.client_id,
    site_id: dbQuote.site_id,
    siteId: dbQuote.site_id,
    // Fields will be populated separately if needed
    shifts: [],
    subcontractors: []
  };
}

/**
 * Adapter function to convert from Quote to DbQuote
 */
export function quoteToDb(quote: Quote): DbQuote {
  return {
    id: quote.id,
    name: quote.name,
    title: quote.title,
    client_name: quote.client_name || quote.clientName,
    site_name: quote.site_name || quote.siteName,
    description: quote.description,
    status: quote.status,
    overhead_percentage: quote.overhead_percentage || quote.overheadPercentage,
    margin_percentage: quote.margin_percentage || quote.marginPercentage,
    total_price: quote.total_price || quote.totalPrice,
    labor_cost: quote.labor_cost || quote.laborCost,
    supplies_cost: quote.supplies_cost,
    equipment_cost: quote.equipment_cost,
    subcontractor_cost: quote.subcontractor_cost || quote.subcontractorCost,
    overhead_cost: quote.overheadCost,
    total_cost: quote.totalCost,
    margin_amount: quote.marginAmount,
    created_at: quote.created_at || quote.createdAt,
    updated_at: quote.updated_at || quote.updatedAt,
    user_id: quote.userId,
    created_by: quote.createdBy,
    start_date: quote.start_date || quote.startDate,
    end_date: quote.end_date || quote.endDate,
    expiry_date: quote.expiry_date || quote.expiryDate,
    contract_length: quote.contractLength,
    contract_length_unit: quote.contractLengthUnit,
    overhead_profile: quote.overheadProfile,
    notes: quote.notes,
    quote_number: quote.quote_number || quote.quoteNumber,
    valid_until: quote.valid_until || quote.validUntil,
    client_id: quote.client_id || quote.clientId,
    site_id: quote.site_id || quote.siteId
  };
}

/**
 * Adapter function to convert DB overhead profile to application model
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
 * Adapter function to convert from system user DB format to application model
 */
export function adaptSystemUser(user: any): SystemUser {
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    full_name: user.full_name,
    avatar_url: user.avatar_url,
    role_id: user.role_id,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
    title: user.title,
    phone: user.phone,
    status: user.status,
    last_login: user.last_login,
    custom_id: user.custom_id,
    notes: user.notes || user.note, // Handle both property names
    territories: user.territories || [],
    permissions: user.permissions || []
  };
}
