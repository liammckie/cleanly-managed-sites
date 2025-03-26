
import { DbQuoteShift, DbQuoteSubcontractor, DbQuote } from "@/types/api";
import { Quote, QuoteShift, QuoteSubcontractor, OverheadProfile, DbOverheadProfile } from "@/types/models";
import { Day, EmploymentType, EmployeeLevel, Frequency } from "@/types/common";

// Type adapter to convert database form of a quote to our app model
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
    status: dbQuote.status as any,
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
    quote_number: dbQuote.quote_number,
    quoteNumber: dbQuote.quote_number,
    valid_until: dbQuote.valid_until,
    validUntil: dbQuote.valid_until,
    client_id: dbQuote.client_id,
    clientId: dbQuote.client_id,
    site_id: dbQuote.site_id,
    siteId: dbQuote.site_id,
    notes: dbQuote.notes || '',
    overheadCost: dbQuote.overhead_cost,
    totalCost: dbQuote.total_cost,
    marginAmount: dbQuote.margin_amount,
    startDate: dbQuote.start_date,
    start_date: dbQuote.start_date,
    endDate: dbQuote.end_date,
    end_date: dbQuote.end_date,
    expiryDate: dbQuote.expiry_date,
    expiry_date: dbQuote.expiry_date,
    contractLength: dbQuote.contract_length,
    contractLengthUnit: dbQuote.contract_length_unit as any,
    overheadProfile: dbQuote.overhead_profile,
    userId: dbQuote.user_id,
    createdBy: dbQuote.created_by,
    created_by: dbQuote.created_by,
    shifts: [],
    subcontractors: []
  };
}

// Type adapter to convert app model of a quote to database form
export function quoteToDb(quote: Quote): DbQuote {
  return {
    id: quote.id,
    name: quote.name,
    title: quote.title,
    client_name: quote.clientName || quote.client_name,
    site_name: quote.siteName || quote.site_name,
    description: quote.description,
    status: quote.status,
    overhead_percentage: quote.overheadPercentage || quote.overhead_percentage,
    margin_percentage: quote.marginPercentage || quote.margin_percentage,
    total_price: quote.totalPrice || quote.total_price,
    labor_cost: quote.laborCost || quote.labor_cost,
    supplies_cost: quote.supplies_cost,
    equipment_cost: quote.equipment_cost,
    subcontractor_cost: quote.subcontractorCost || quote.subcontractor_cost,
    overhead_cost: quote.overheadCost,
    total_cost: quote.totalCost,
    margin_amount: quote.marginAmount,
    created_at: quote.createdAt || quote.created_at,
    updated_at: quote.updatedAt || quote.updated_at,
    user_id: quote.userId,
    created_by: quote.createdBy || quote.created_by,
    start_date: quote.startDate || quote.start_date,
    end_date: quote.endDate || quote.end_date,
    expiry_date: quote.expiryDate || quote.expiry_date,
    contract_length: quote.contractLength,
    contract_length_unit: quote.contractLengthUnit,
    overhead_profile: quote.overheadProfile,
    notes: quote.notes,
    quote_number: quote.quoteNumber || quote.quote_number,
    valid_until: quote.validUntil || quote.valid_until,
    client_id: quote.clientId || quote.client_id,
    site_id: quote.siteId || quote.site_id
  };
}

// Convert database quote shift to app model
export function dbToQuoteShift(dbShift: DbQuoteShift): QuoteShift {
  return {
    id: dbShift.id,
    quoteId: dbShift.quote_id,
    day: dbShift.day as Day,
    startTime: dbShift.start_time,
    endTime: dbShift.end_time,
    breakDuration: dbShift.break_duration,
    numberOfCleaners: dbShift.number_of_cleaners,
    employmentType: dbShift.employment_type as EmploymentType,
    level: dbShift.level as EmployeeLevel,
    allowances: dbShift.allowances || [],
    estimatedCost: dbShift.estimated_cost,
    location: dbShift.location || '',
    notes: dbShift.notes || ''
  };
}

// Convert app model quote shift to database form
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
    location: shift.location || '',
    notes: shift.notes || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

// Convert database subcontractor to app model
export function dbToQuoteSubcontractor(dbSub: DbQuoteSubcontractor): QuoteSubcontractor {
  return {
    id: dbSub.id,
    quoteId: dbSub.quote_id || '',
    name: dbSub.name,
    description: dbSub.description,
    cost: dbSub.cost,
    frequency: dbSub.frequency as Frequency,
    email: dbSub.email,
    phone: dbSub.phone,
    service: dbSub.service,
    notes: dbSub.notes,
    services: dbSub.services || []
  };
}

// Convert app model subcontractor to database form
export function quoteSubcontractorToDb(sub: QuoteSubcontractor): DbQuoteSubcontractor {
  return {
    id: sub.id,
    quote_id: sub.quoteId,
    name: sub.name,
    description: sub.description,
    cost: sub.cost,
    frequency: sub.frequency,
    email: sub.email,
    phone: sub.phone,
    service: sub.service,
    notes: sub.notes,
    services: sub.services || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

// Adapter for overhead profiles
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

// Helper to adapt a QuoteShift between different interfaces
export function adaptQuoteShift<T, U>(source: T, template: U): U {
  const result = { ...template };
  
  if (typeof source === 'object' && source !== null) {
    // Copy properties that exist both in source and template
    Object.keys(template).forEach(key => {
      if (key in source) {
        (result as any)[key] = (source as any)[key];
      }
    });
  }
  
  return result;
}
