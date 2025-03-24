
import { QuoteShift, Subcontractor, Quote, OverheadProfile } from '@/lib/award/types';
import { Json } from '@/lib/types';

// Database shape to application shape converters
export interface DbQuoteShift {
  id?: string;
  quote_id?: string;
  day: string;
  start_time: string;
  end_time: string;
  break_duration?: number;
  level: number;
  employment_type: string;
  number_of_cleaners?: number;
  location?: string;
  allowances?: Json;
  estimated_cost?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DbQuoteSubcontractor {
  id?: string;
  quote_id?: string;
  name: string;
  service?: string;
  description?: string;
  frequency?: string;
  cost?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DbQuote {
  id?: string;
  name: string;
  client_id?: string;
  client_name?: string;
  site_address?: string;
  site_name?: string;
  start_date?: string;
  end_date?: string;
  contract_length?: number;
  contract_length_unit?: string;
  expiry_date?: string;
  status?: string;
  overhead_percentage?: number;
  margin_percentage?: number;
  overhead_profile?: string;
  labor_cost?: number;
  overhead_amount?: number;
  overhead_cost?: number;
  margin_amount?: number;
  total_price?: number;
  total_cost?: number;
  subcontractor_cost?: number;
  total_hours?: number;
  notes?: string;
  user_id?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DbOverheadProfile {
  id?: string;
  name: string;
  percentage?: number;
  labor_percentage?: number;
  description?: string;
  is_default?: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Database to application converters
export const dbToQuoteShift = (dbShift: DbQuoteShift): QuoteShift => {
  return {
    id: dbShift.id || '',
    quoteId: dbShift.quote_id || '',
    day: dbShift.day as any,
    startTime: dbShift.start_time,
    endTime: dbShift.end_time,
    breakDuration: dbShift.break_duration || 0,
    level: dbShift.level as any,
    employmentType: dbShift.employment_type as any,
    numberOfCleaners: dbShift.number_of_cleaners || 1,
    location: dbShift.location,
    allowances: Array.isArray(dbShift.allowances) ? dbShift.allowances as string[] : [],
    estimatedCost: dbShift.estimated_cost || 0,
    notes: dbShift.notes,
    createdAt: dbShift.created_at,
    updatedAt: dbShift.updated_at
  };
};

export const quoteShiftToDb = (shift: Partial<QuoteShift>): Partial<DbQuoteShift> => {
  return {
    id: shift.id,
    quote_id: shift.quoteId,
    day: shift.day,
    start_time: shift.startTime,
    end_time: shift.endTime,
    break_duration: shift.breakDuration,
    level: shift.level,
    employment_type: shift.employmentType,
    number_of_cleaners: shift.numberOfCleaners,
    location: shift.location,
    allowances: shift.allowances as Json,
    estimated_cost: shift.estimatedCost,
    notes: shift.notes,
    created_at: shift.createdAt,
    updated_at: shift.updatedAt || new Date().toISOString()
  };
};

export const dbToSubcontractor = (dbSub: DbQuoteSubcontractor): Subcontractor => {
  return {
    id: dbSub.id || '',
    quoteId: dbSub.quote_id || '',
    name: dbSub.name,
    service: dbSub.service,
    description: dbSub.description,
    frequency: dbSub.frequency as any || 'monthly',
    cost: dbSub.cost || 0,
    notes: dbSub.notes,
    createdAt: dbSub.created_at,
    updatedAt: dbSub.updated_at
  };
};

export const subcontractorToDb = (sub: Partial<Subcontractor>): Partial<DbQuoteSubcontractor> => {
  return {
    id: sub.id,
    quote_id: sub.quoteId,
    name: sub.name || '',
    service: sub.service,
    description: sub.description,
    frequency: sub.frequency,
    cost: sub.cost,
    notes: sub.notes,
    created_at: sub.createdAt,
    updated_at: sub.updatedAt || new Date().toISOString()
  };
};

export const dbToQuote = (dbQuote: DbQuote): Quote => {
  return {
    id: dbQuote.id || '',
    name: dbQuote.name || '',
    clientId: dbQuote.client_id,
    clientName: dbQuote.client_name,
    siteAddress: dbQuote.site_address,
    siteName: dbQuote.site_name,
    startDate: dbQuote.start_date,
    endDate: dbQuote.end_date,
    contractLength: dbQuote.contract_length,
    contractLengthUnit: dbQuote.contract_length_unit as any,
    expiryDate: dbQuote.expiry_date,
    status: dbQuote.status as any || 'draft',
    overheadProfile: dbQuote.overhead_profile,
    overheadPercentage: dbQuote.overhead_percentage || 0,
    marginPercentage: dbQuote.margin_percentage || 0,
    laborCost: dbQuote.labor_cost || 0,
    overheadAmount: dbQuote.overhead_amount || 0,
    overheadCost: dbQuote.overhead_cost || 0,
    marginAmount: dbQuote.margin_amount || 0,
    totalPrice: dbQuote.total_price || 0,
    totalCost: dbQuote.total_cost || 0,
    subcontractorCost: dbQuote.subcontractor_cost || 0,
    totalHours: dbQuote.total_hours || 0,
    notes: dbQuote.notes,
    userId: dbQuote.user_id,
    createdBy: dbQuote.created_by,
    createdAt: dbQuote.created_at,
    updatedAt: dbQuote.updated_at,
  };
};

export const quoteToDb = (quote: Partial<Quote>): Partial<DbQuote> => {
  return {
    id: quote.id,
    name: quote.name || '',
    client_id: quote.clientId,
    client_name: quote.clientName,
    site_address: quote.siteAddress,
    site_name: quote.siteName,
    start_date: quote.startDate,
    end_date: quote.endDate,
    contract_length: quote.contractLength,
    contract_length_unit: quote.contractLengthUnit,
    expiry_date: quote.expiryDate,
    status: quote.status,
    overhead_profile: quote.overheadProfile,
    overhead_percentage: quote.overheadPercentage,
    margin_percentage: quote.marginPercentage,
    labor_cost: quote.laborCost,
    overhead_amount: quote.overheadAmount,
    overhead_cost: quote.overheadCost,
    margin_amount: quote.marginAmount,
    total_price: quote.totalPrice,
    total_cost: quote.totalCost,
    subcontractor_cost: quote.subcontractorCost,
    total_hours: quote.totalHours,
    notes: quote.notes,
    user_id: quote.userId,
    created_by: quote.createdBy,
    created_at: quote.createdAt,
    updated_at: quote.updatedAt || new Date().toISOString()
  };
};

export const dbToOverheadProfile = (dbProfile: DbOverheadProfile): OverheadProfile => {
  return {
    id: dbProfile.id || '',
    name: dbProfile.name,
    percentage: dbProfile.percentage || 0,
    laborPercentage: dbProfile.labor_percentage,
    description: dbProfile.description,
    isDefault: dbProfile.is_default,
    userId: dbProfile.user_id,
    createdAt: dbProfile.created_at,
    updatedAt: dbProfile.updated_at
  };
};

export const overheadProfileToDb = (profile: Partial<OverheadProfile>): Partial<DbOverheadProfile> => {
  return {
    id: profile.id,
    name: profile.name || '',
    percentage: profile.percentage,
    labor_percentage: profile.laborPercentage,
    description: profile.description,
    is_default: profile.isDefault,
    user_id: profile.userId,
    created_at: profile.createdAt,
    updated_at: profile.updatedAt || new Date().toISOString()
  };
};
