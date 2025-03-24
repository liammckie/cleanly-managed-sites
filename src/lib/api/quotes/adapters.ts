
import { Quote, QuoteShift, Subcontractor } from '@/lib/award/types';
import { Json } from '@/lib/types';

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
  services?: string[];
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
    id: dbQuote.id,
    title: dbQuote.name,
    name: dbQuote.name,
    clientName: dbQuote.client_name,
    siteName: dbQuote.site_name,
    description: dbQuote.description,
    status: dbQuote.status as any,
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
    clientContact: dbQuote.client_contact,
    clientEmail: dbQuote.client_email,
    clientPhone: dbQuote.client_phone,
    siteAddress: dbQuote.site_address,
    siteId: dbQuote.site_id,
    frequency: dbQuote.frequency,
    scope: dbQuote.scope,
    terms: dbQuote.terms,
    notes: dbQuote.notes,
    created_by: dbQuote.created_by,
    overheadCost: dbQuote.overhead_cost,
    totalCost: dbQuote.total_cost,
    marginAmount: dbQuote.margin_amount,
    startDate: dbQuote.start_date,
    endDate: dbQuote.end_date,
    expiryDate: dbQuote.expiry_date,
    contractLength: dbQuote.contract_length,
    contractLengthUnit: dbQuote.contract_length_unit,
    overheadProfile: dbQuote.overhead_profile,
    userId: dbQuote.user_id
  };
}

// Adapter functions to convert application objects to database objects
export function quoteToDb(quote: Quote): DbQuote {
  return {
    id: quote.id,
    name: quote.name || quote.title,
    client_name: quote.clientName,
    site_name: quote.siteName,
    description: quote.description,
    status: quote.status,
    overhead_percentage: quote.overheadPercentage,
    margin_percentage: quote.marginPercentage,
    total_price: quote.totalPrice,
    labor_cost: quote.laborCost,
    supplies_cost: quote.suppliesCost || 0,
    equipment_cost: quote.equipmentCost || 0,
    subcontractor_cost: quote.subcontractorCost,
    created_at: quote.createdAt,
    updated_at: quote.updatedAt,
    quote_number: quote.quoteNumber,
    valid_until: quote.validUntil,
    client_id: quote.clientId,
    client_contact: quote.clientContact,
    client_email: quote.clientEmail,
    client_phone: quote.clientPhone,
    site_address: quote.siteAddress,
    site_id: quote.siteId,
    frequency: quote.frequency,
    scope: quote.scope,
    terms: quote.terms,
    notes: quote.notes,
    created_by: quote.created_by,
    overhead_cost: quote.overheadCost,
    total_cost: quote.totalCost,
    margin_amount: quote.marginAmount,
    start_date: quote.startDate,
    end_date: quote.endDate,
    expiry_date: quote.expiryDate,
    contract_length: quote.contractLength,
    contract_length_unit: quote.contractLengthUnit,
    overhead_profile: quote.overheadProfile,
    user_id: quote.userId
  };
}

export function dbToQuoteShift(dbShift: DbQuoteShift): QuoteShift {
  return {
    id: dbShift.id,
    quoteId: dbShift.quote_id,
    day: dbShift.day as any,
    startTime: dbShift.start_time,
    endTime: dbShift.end_time,
    breakDuration: dbShift.break_duration,
    numberOfCleaners: dbShift.number_of_cleaners,
    employmentType: dbShift.employment_type as any,
    level: dbShift.level as any,
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
    day: shift.day,
    start_time: shift.startTime,
    end_time: shift.endTime,
    break_duration: shift.breakDuration,
    number_of_cleaners: shift.numberOfCleaners,
    employment_type: shift.employmentType,
    level: shift.level,
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
    name: dbSub.name,
    description: dbSub.description,
    cost: dbSub.cost,
    frequency: dbSub.frequency as any,
    quoteId: dbSub.quote_id,
    email: dbSub.email,
    phone: dbSub.phone,
    services: dbSub.services,
    service: dbSub.service,
    notes: dbSub.notes
  };
}

export function subcontractorToDb(sub: Subcontractor): DbSubcontractor {
  return {
    id: sub.id,
    name: sub.name,
    description: sub.description,
    cost: sub.cost || 0,
    frequency: sub.frequency as string || 'monthly',
    quote_id: sub.quoteId,
    email: sub.email,
    phone: sub.phone,
    services: sub.services,
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
