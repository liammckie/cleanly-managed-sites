
import { Quote, QuoteShift, Subcontractor, QuoteSubcontractor } from '@/lib/types/quotes';
import { Json } from '@/lib/types';

// Database interface definitions
export interface DbQuote {
  id: string;
  name: string;
  title?: string;
  client_name: string;
  site_name?: string;
  description?: string;
  status: string;
  overhead_percentage: number;
  margin_percentage: number;
  total_price: number;
  labor_cost: number;
  supplies_cost?: number;
  equipment_cost?: number;
  subcontractor_cost: number;
  overhead_cost?: number;
  total_cost?: number;
  margin_amount?: number;
  created_at: string;
  updated_at: string;
  user_id?: string;
  created_by?: string;
  start_date?: string;
  end_date?: string;
  expiry_date?: string;
  contract_length?: number;
  contract_length_unit?: string;
  overhead_profile?: string;
  notes?: string;
  quote_number?: string;
  valid_until?: string;
  client_id?: string;
  site_id?: string;
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
  service?: string;
  notes?: string;
  services?: string[];
}

// Convert database quote to application quote
export const dbToQuote = (dbQuote: DbQuote): Quote => {
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
};

// Convert application quote to database quote
export const quoteToDb = (quote: Quote): DbQuote => {
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
};

// Convert database shift to application shift
export const dbToQuoteShift = (dbShift: any): QuoteShift => {
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
    location: dbShift.location || '',
    notes: dbShift.notes || ''
  };
};

// Convert application shift to database shift
export const quoteShiftToDb = (shift: QuoteShift): any => {
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
    notes: shift.notes
  };
};

// Convert database subcontractor to application subcontractor
export const dbToSubcontractor = (dbSub: any): QuoteSubcontractor => {
  return {
    id: dbSub.id,
    quoteId: dbSub.quote_id,
    name: dbSub.name,
    description: dbSub.description,
    cost: dbSub.cost,
    frequency: dbSub.frequency,
    email: dbSub.email || '',
    phone: dbSub.phone || '',
    service: dbSub.service || '',
    notes: dbSub.notes || '',
    services: dbSub.services || [],
    customServices: '',
    monthlyCost: 0,
    isFlatRate: true
  };
};

// Convert application subcontractor to database subcontractor
export const subcontractorToDb = (sub: QuoteSubcontractor): any => {
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
    services: sub.services || []
  };
};
