
import { 
  Quote, 
  QuoteShift, 
  Subcontractor,
  Json 
} from '@/lib/award/types';

// Type definitions matching the database schema
export type DbQuote = {
  id: string;
  name: string;
  client_name?: string;
  site_name?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  expiry_date?: string;
  contract_length?: number;
  contract_length_unit?: string;
  overhead_profile?: string;
  overhead_percentage?: number;
  margin_percentage?: number;
  notes?: string;
  labor_cost: number;
  overhead_cost: number;
  subcontractor_cost: number;
  total_cost: number;
  margin_amount: number;
  total_price: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  user_id?: string;
  shifts?: DbQuoteShift[];
  subcontractors?: DbQuoteSubcontractor[];
};

export type DbQuoteShift = {
  id: string;
  quote_id: string;
  day: string;
  start_time: string;
  end_time: string;
  break_duration: number;
  level: number;
  employment_type: string;
  number_of_cleaners: number;
  location?: string;
  allowances?: Json;
  estimated_cost: number;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type DbQuoteSubcontractor = {
  id: string;
  quote_id: string;
  name: string;
  service?: string;
  description?: string;
  frequency?: string;
  cost: number;
  notes?: string; // Add notes field to match the Subcontractor type
  created_at: string;
  updated_at: string;
};

export type DbOverheadProfile = {
  id: string;
  name: string;
  description?: string;
  labor_percentage: number;
  user_id?: string;
  created_at: string;
  updated_at: string;
};

// Adapter functions to convert between database and client models
export function dbToQuote(dbQuote: DbQuote): Quote {
  return {
    id: dbQuote.id,
    name: dbQuote.name,
    clientName: dbQuote.client_name || '',
    siteName: dbQuote.site_name || '',
    status: dbQuote.status as any,
    startDate: dbQuote.start_date || '',
    endDate: dbQuote.end_date || '',
    expiryDate: dbQuote.expiry_date || '',
    contractLength: dbQuote.contract_length || 0,
    contractLengthUnit: dbQuote.contract_length_unit as any || 'months',
    overheadProfile: dbQuote.overhead_profile || '',
    overheadPercentage: dbQuote.overhead_percentage || 0,
    marginPercentage: dbQuote.margin_percentage || 0,
    notes: dbQuote.notes || '',
    laborCost: dbQuote.labor_cost,
    overheadCost: dbQuote.overhead_cost,
    subcontractorCost: dbQuote.subcontractor_cost,
    totalCost: dbQuote.total_cost,
    marginAmount: dbQuote.margin_amount,
    totalPrice: dbQuote.total_price,
    createdAt: dbQuote.created_at,
    updatedAt: dbQuote.updated_at,
    createdBy: dbQuote.created_by || '',
    userId: dbQuote.user_id || '',
    shifts: dbQuote.shifts ? dbQuote.shifts.map(dbToQuoteShift) : [],
    subcontractors: dbQuote.subcontractors ? dbQuote.subcontractors.map(dbToSubcontractor) : []
  };
}

export function quoteToDb(quote: Partial<Quote>): Partial<DbQuote> {
  const dbQuote: Partial<DbQuote> = {
    id: quote.id,
    name: quote.name,
    client_name: quote.clientName,
    site_name: quote.siteName,
    status: quote.status,
    start_date: quote.startDate,
    end_date: quote.endDate,
    expiry_date: quote.expiryDate,
    contract_length: quote.contractLength,
    contract_length_unit: quote.contractLengthUnit,
    overhead_profile: quote.overheadProfile,
    overhead_percentage: quote.overheadPercentage,
    margin_percentage: quote.marginPercentage,
    notes: quote.notes,
    labor_cost: quote.laborCost,
    overhead_cost: quote.overheadCost,
    subcontractor_cost: quote.subcontractorCost,
    total_cost: quote.totalCost,
    margin_amount: quote.marginAmount,
    total_price: quote.totalPrice,
    created_by: quote.createdBy,
    user_id: quote.userId
  };

  // Remove undefined properties
  Object.keys(dbQuote).forEach(key => {
    if (dbQuote[key as keyof Partial<DbQuote>] === undefined) {
      delete dbQuote[key as keyof Partial<DbQuote>];
    }
  });

  return dbQuote;
}

export function dbToQuoteShift(dbShift: DbQuoteShift): QuoteShift {
  return {
    id: dbShift.id,
    quoteId: dbShift.quote_id,
    day: dbShift.day as any,
    startTime: dbShift.start_time,
    endTime: dbShift.end_time,
    breakDuration: dbShift.break_duration,
    level: dbShift.level,
    employmentType: dbShift.employment_type as any,
    numberOfCleaners: dbShift.number_of_cleaners,
    location: dbShift.location || '',
    allowances: dbShift.allowances as any[] || [],
    estimatedCost: dbShift.estimated_cost,
    notes: dbShift.notes || ''
  };
}

export function quoteShiftToDb(shift: Partial<QuoteShift>): Partial<DbQuoteShift> {
  const dbShift: Partial<DbQuoteShift> = {
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
    notes: shift.notes
  };

  // Remove undefined properties
  Object.keys(dbShift).forEach(key => {
    if (dbShift[key as keyof Partial<DbQuoteShift>] === undefined) {
      delete dbShift[key as keyof Partial<DbQuoteShift>];
    }
  });

  return dbShift;
}

export function dbToSubcontractor(dbSubcontractor: DbQuoteSubcontractor): Subcontractor {
  return {
    id: dbSubcontractor.id,
    quoteId: dbSubcontractor.quote_id,
    name: dbSubcontractor.name,
    service: dbSubcontractor.service || '',
    description: dbSubcontractor.description || '',
    frequency: dbSubcontractor.frequency as any || 'monthly',
    cost: dbSubcontractor.cost,
    notes: dbSubcontractor.notes || ''
  };
}

export function subcontractorToDb(subcontractor: Partial<Subcontractor>): Partial<DbQuoteSubcontractor> {
  const dbSubcontractor: Partial<DbQuoteSubcontractor> = {
    id: subcontractor.id,
    quote_id: subcontractor.quoteId,
    name: subcontractor.name,
    service: subcontractor.service,
    description: subcontractor.description,
    frequency: subcontractor.frequency,
    cost: subcontractor.cost,
    notes: subcontractor.notes
  };

  // Remove undefined properties
  Object.keys(dbSubcontractor).forEach(key => {
    if (dbSubcontractor[key as keyof Partial<DbQuoteSubcontractor>] === undefined) {
      delete dbSubcontractor[key as keyof Partial<DbQuoteSubcontractor>];
    }
  });

  return dbSubcontractor;
}

export function dbToOverheadProfile(profile: DbOverheadProfile) {
  return {
    id: profile.id,
    name: profile.name,
    description: profile.description || '',
    laborPercentage: profile.labor_percentage
  };
}
