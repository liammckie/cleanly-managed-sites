
import { QuoteShift, Subcontractor } from '@/lib/award/types';
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
  start_date?: string;
  end_date?: string;
  contract_length?: number;
  contract_length_unit?: string;
  expiry_date?: string;
  status?: string;
  overhead_percentage?: number;
  margin_percentage?: number;
  labor_cost?: number;
  overhead_amount?: number;
  margin_amount?: number;
  total_price?: number;
  total_hours?: number;
  notes?: string;
  user_id?: string;
  created_by?: string;
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
