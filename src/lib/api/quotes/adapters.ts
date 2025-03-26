
import { Quote, QuoteShift, Subcontractor, QuoteSubcontractor } from '@/lib/types/quotes';

// Database interface definitions
export interface DbQuote {
  id: string;
  name: string;
  client_name: string;
  site_name?: string;
  description?: string;
  status: string;
  overhead_percentage: number;
  margin_percentage: number;
  total_price: number;
  labor_cost: number;
  supplies_cost: number;
  equipment_cost: number;
  subcontractor_cost: number;
  created_at: string;
  updated_at: string;
  quote_number?: string;
  valid_until?: string;
  client_id?: string;
  client_contact?: string;
  client_email?: string;
  client_phone?: string;
  site_address?: string;
  site_id?: string;
  frequency?: string;
  scope?: string;
  terms?: string;
  notes?: string;
  created_by?: string;
  overhead_cost?: number;
  total_cost?: number;
  margin_amount?: number;
  start_date?: string;
  end_date?: string;
  expiry_date?: string;
  contract_length?: number;
  contract_length_unit?: string;
  overhead_profile?: string;
  user_id?: string;
}

export interface DbQuoteShift {
  id: string;
  quote_id: string;
  day: string;
  start_time: string;
  end_time: string;
  break_duration: number;
  number_of_cleaners: number;
  employment_type: string;
  level: number;
  allowances: string[];
  estimated_cost: number;
  location: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface DbSubcontractor {
  id: string;
  quote_id?: string;
  name: string;
  description?: string;
  cost: number;
  frequency: string;
  created_at: string;
  updated_at: string;
  email?: string;
  phone?: string;
  notes?: string;
  service?: string;
}

export interface DbOverheadProfile {
  id: string;
  name: string;
  description?: string;
  labor_percentage: number;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

// Adapter functions to convert database objects to application objects
export function dbToQuote(dbQuote: DbQuote): Quote {
  return {
    // Use snake_case properties directly from DB
    id: dbQuote.id,
    name: dbQuote.name,
    client_name: dbQuote.client_name,
    site_name: dbQuote.site_name,
    status: dbQuote.status as any,
    overhead_percentage: dbQuote.overhead_percentage,
    margin_percentage: dbQuote.margin_percentage,
    total_price: dbQuote.total_price,
    labor_cost: dbQuote.labor_cost,
    supplies_cost: dbQuote.supplies_cost || 0,
    equipment_cost: dbQuote.equipment_cost || 0,
    subcontractor_cost: dbQuote.subcontractor_cost,
    created_at: dbQuote.created_at,
    updated_at: dbQuote.updated_at,
    quote_number: dbQuote.quote_number,
    valid_until: dbQuote.valid_until,
    client_id: dbQuote.client_id,
    site_id: dbQuote.site_id,
    notes: dbQuote.notes,
    created_by: dbQuote.created_by,
    overhead_cost: dbQuote.overhead_cost,
    total_cost: dbQuote.total_cost,
    margin_amount: dbQuote.margin_amount,
    start_date: dbQuote.start_date,
    end_date: dbQuote.end_date,
    expiry_date: dbQuote.expiry_date,
    description: dbQuote.description,
    clientContact: dbQuote.client_contact,
    clientEmail: dbQuote.client_email,
    clientPhone: dbQuote.client_phone,
    siteAddress: dbQuote.site_address,
    frequency: dbQuote.frequency,
    scope: dbQuote.scope,
    terms: dbQuote.terms,

    // Add camelCase aliases for frontend
    title: dbQuote.name,
    clientName: dbQuote.client_name,
    siteName: dbQuote.site_name,
    overheadPercentage: dbQuote.overhead_percentage,
    marginPercentage: dbQuote.margin_percentage,
    totalPrice: dbQuote.total_price,
    laborCost: dbQuote.labor_cost,
    suppliesCost: dbQuote.supplies_cost || 0,
    equipmentCost: dbQuote.equipment_cost || 0,
    subcontractorCost: dbQuote.subcontractor_cost,
    createdAt: dbQuote.created_at,
    updatedAt: dbQuote.updated_at,
    quoteNumber: dbQuote.quote_number,
    validUntil: dbQuote.valid_until,
    clientId: dbQuote.client_id,
    siteId: dbQuote.site_id,
    overheadCost: dbQuote.overhead_cost,
    totalCost: dbQuote.total_cost,
    marginAmount: dbQuote.margin_amount,
    startDate: dbQuote.start_date,
    endDate: dbQuote.end_date,
    expiryDate: dbQuote.expiry_date,
    contractLength: dbQuote.contract_length,
    contractLengthUnit: dbQuote.contract_length_unit as 'days' | 'weeks' | 'months' | 'years',
    overheadProfile: dbQuote.overhead_profile,
    userId: dbQuote.user_id,
    createdBy: dbQuote.created_by
  };
}

// Adapter functions to convert application objects to database objects
export function quoteToDb(quote: Quote): DbQuote {
  return {
    id: quote.id,
    name: quote.name || quote.title || '',
    client_name: quote.client_name || quote.clientName || '',
    site_name: quote.site_name || quote.siteName,
    description: quote.description,
    status: quote.status,
    overhead_percentage: quote.overhead_percentage || quote.overheadPercentage || 0,
    margin_percentage: quote.margin_percentage || quote.marginPercentage || 0,
    total_price: quote.total_price || quote.totalPrice || 0,
    labor_cost: quote.labor_cost || quote.laborCost || 0,
    supplies_cost: quote.supplies_cost || quote.suppliesCost || 0,
    equipment_cost: quote.equipment_cost || quote.equipmentCost || 0,
    subcontractor_cost: quote.subcontractor_cost || quote.subcontractorCost || 0,
    created_at: quote.created_at || quote.createdAt || new Date().toISOString(),
    updated_at: quote.updated_at || quote.updatedAt || new Date().toISOString(),
    quote_number: quote.quote_number || quote.quoteNumber,
    valid_until: quote.valid_until || quote.validUntil,
    client_id: quote.client_id || quote.clientId,
    client_contact: quote.clientContact,
    client_email: quote.clientEmail,
    client_phone: quote.clientPhone,
    site_address: quote.siteAddress,
    site_id: quote.site_id || quote.siteId,
    frequency: quote.frequency,
    scope: quote.scope,
    terms: quote.terms,
    notes: quote.notes,
    created_by: quote.created_by || quote.createdBy,
    overhead_cost: quote.overhead_cost || quote.overheadCost,
    total_cost: quote.total_cost || quote.totalCost,
    margin_amount: quote.margin_amount || quote.marginAmount,
    start_date: quote.start_date || quote.startDate,
    end_date: quote.end_date || quote.endDate,
    expiry_date: quote.expiry_date || quote.expiryDate,
    contract_length: quote.contractLength,
    contract_length_unit: quote.contractLengthUnit || 'months',
    overhead_profile: quote.overheadProfile,
    user_id: quote.userId
  };
}

export function dbToQuoteShift(dbShift: DbQuoteShift): QuoteShift {
  return {
    id: dbShift.id,
    quoteId: dbShift.quote_id,
    day: dbShift.day,
    startTime: dbShift.start_time,
    endTime: dbShift.end_time,
    breakDuration: dbShift.break_duration,
    numberOfCleaners: dbShift.number_of_cleaners,
    employmentType: dbShift.employment_type,
    level: dbShift.level,
    allowances: Array.isArray(dbShift.allowances) ? dbShift.allowances : [],
    estimatedCost: dbShift.estimated_cost,
    location: dbShift.location,
    notes: dbShift.notes
  };
}

export function quoteShiftToDb(shift: QuoteShift): DbQuoteShift {
  return {
    id: shift.id,
    quote_id: shift.quoteId,
    day: shift.day as string,
    start_time: shift.startTime,
    end_time: shift.endTime,
    break_duration: shift.breakDuration,
    number_of_cleaners: shift.numberOfCleaners,
    employment_type: shift.employmentType as string,
    level: shift.level as number,
    allowances: shift.allowances,
    estimated_cost: shift.estimatedCost,
    location: shift.location,
    notes: shift.notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

export function dbToSubcontractor(dbSub: DbSubcontractor): Subcontractor {
  return {
    id: dbSub.id,
    quoteId: dbSub.quote_id || '',
    name: dbSub.name,
    description: dbSub.description,
    cost: dbSub.cost,
    frequency: dbSub.frequency,
    email: dbSub.email,
    phone: dbSub.phone,
    service: dbSub.service,
    notes: dbSub.notes
  };
}

export function subcontractorToDb(sub: Subcontractor): DbSubcontractor {
  return {
    id: sub.id,
    quote_id: sub.quoteId,
    name: sub.name,
    description: sub.description,
    cost: sub.cost || 0,
    frequency: sub.frequency as string || 'monthly',
    email: sub.email,
    phone: sub.phone,
    service: sub.service,
    notes: sub.notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

export function dbToOverheadProfile(dbProfile: DbOverheadProfile) {
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

export const adaptQuoteToApi = (quote: Quote): any => {
  return {
    name: quote.name,
    client_name: quote.client_name || quote.clientName,
    site_name: quote.site_name || quote.siteName,
    status: quote.status,
    margin_percentage: quote.margin_percentage || quote.marginPercentage || 0,
    total_cost: quote.total_cost || quote.totalCost || 0,
    notes: quote.notes,
    overhead_profile: quote.overheadProfile || 'standard', // Default
    labor_cost: quote.labor_cost || quote.laborCost || 0,
    overhead_cost: quote.overhead_cost || quote.overheadCost || 0,
    subcontractor_cost: quote.subcontractor_cost || quote.subcontractorCost || 0,
    margin_amount: quote.margin_amount || quote.marginAmount || 0,
    total_price: quote.total_price || quote.totalPrice || 0,
    start_date: quote.start_date || quote.startDate,
    end_date: quote.end_date || quote.endDate,
    expiry_date: quote.expiry_date || quote.expiryDate,
    contract_length: quote.contractLength,
    contract_length_unit: quote.contractLengthUnit || 'months', // Use fixed value that matches allowed types
    overhead_percentage: quote.overhead_percentage || quote.overheadPercentage || 0,
    // Additional fields
    title: quote.title,
    description: quote.description,
    supplies_cost: quote.supplies_cost || quote.suppliesCost || 0,
    equipment_cost: quote.equipment_cost || quote.equipmentCost || 0,
    quote_number: quote.quote_number || quote.quoteNumber,
    valid_until: quote.valid_until || quote.validUntil,
    client_id: quote.client_id || quote.clientId,
    client_contact: quote.clientContact,
    client_email: quote.clientEmail,
    client_phone: quote.clientPhone,
    site_address: quote.siteAddress,
    site_id: quote.site_id || quote.siteId,
    frequency: quote.frequency,
    scope: quote.scope,
    terms: quote.terms,
    created_by: quote.created_by || quote.createdBy,
    user_id: quote.userId,
  };
};
