
import { Day, EmployeeLevel, EmploymentType, Frequency, QuoteStatus } from '@/types/common';

export interface DbQuote {
  id: string;
  name: string;
  title?: string;
  client_name: string;
  site_name?: string;
  status: string;
  overhead_percentage: number;
  margin_percentage: number;
  total_price: number;
  labor_cost: number;
  supplies_cost?: number;
  equipment_cost?: number;
  subcontractor_cost: number;
  overhead_cost?: number;
  margin_amount?: number;
  total_cost?: number;
  created_at: string;
  updated_at: string;
  quote_number?: string;
  valid_until?: string;
  client_id?: string;
  site_id?: string;
  user_id?: string;
  created_by?: string;
  start_date?: string;
  end_date?: string;
  expiry_date?: string;
  contract_length?: number;
  contract_length_unit?: string;
  overhead_profile?: string;
  notes?: string;
  frequency?: string;
  scope?: string;
  terms?: string;
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
  allowances: any[];
  estimated_cost: number;
  location?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DbQuoteSubcontractor {
  id: string;
  quote_id: string;
  name: string;
  description?: string;
  cost: number;
  frequency: string;
  email?: string;
  phone?: string;
  service?: string;
  notes?: string;
  services?: string[];
  custom_services?: string;
  monthly_cost?: number;
  is_flat_rate?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Quote {
  id: string;
  name: string;
  title?: string;
  clientName: string;
  siteName: string;
  status: QuoteStatus;
  overheadPercentage: number;
  marginPercentage: number;
  totalPrice: number;
  laborCost: number;
  suppliesCost?: number;
  equipmentCost?: number;
  subcontractorCost: number;
  overheadCost?: number;
  marginAmount?: number;
  totalCost?: number;
  createdAt: string;
  updatedAt: string;
  quoteNumber?: string;
  validUntil?: string;
  clientId?: string;
  siteId?: string;
  userId?: string;
  createdBy?: string;
  startDate?: string;
  endDate?: string;
  expiryDate?: string;
  contractLength?: number;
  contractLengthUnit?: string;
  overheadProfile?: string;
  notes?: string;
  frequency?: string;
  scope?: string;
  terms?: string;
  shifts?: QuoteShift[];
  subcontractors?: QuoteSubcontractor[];
}

export interface QuoteShift {
  id: string;
  quoteId: string;
  day: Day;
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: EmploymentType;
  level: EmployeeLevel;
  allowances: any[];
  estimatedCost: number;
  location?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuoteSubcontractor {
  id: string;
  quoteId: string;
  name: string;
  description?: string;
  cost: number;
  frequency: Frequency;
  email?: string;
  phone?: string;
  service?: string;
  notes?: string;
  services?: string[];
  customServices?: string;
  monthlyCost?: number;
  isFlatRate?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function dbToQuote(dbQuote: DbQuote): Quote {
  return {
    id: dbQuote.id,
    name: dbQuote.name,
    title: dbQuote.title,
    clientName: dbQuote.client_name,
    siteName: dbQuote.site_name || '',
    status: dbQuote.status as QuoteStatus,
    overheadPercentage: dbQuote.overhead_percentage,
    marginPercentage: dbQuote.margin_percentage,
    totalPrice: dbQuote.total_price,
    laborCost: dbQuote.labor_cost,
    suppliesCost: dbQuote.supplies_cost,
    equipmentCost: dbQuote.equipment_cost,
    subcontractorCost: dbQuote.subcontractor_cost,
    overheadCost: dbQuote.overhead_cost,
    marginAmount: dbQuote.margin_amount,
    totalCost: dbQuote.total_cost,
    createdAt: dbQuote.created_at,
    updatedAt: dbQuote.updated_at,
    quoteNumber: dbQuote.quote_number,
    validUntil: dbQuote.valid_until,
    clientId: dbQuote.client_id,
    siteId: dbQuote.site_id,
    userId: dbQuote.user_id,
    createdBy: dbQuote.created_by,
    startDate: dbQuote.start_date,
    endDate: dbQuote.end_date,
    expiryDate: dbQuote.expiry_date,
    contractLength: dbQuote.contract_length,
    contractLengthUnit: dbQuote.contract_length_unit,
    overheadProfile: dbQuote.overhead_profile,
    notes: dbQuote.notes,
    frequency: dbQuote.frequency,
    scope: dbQuote.scope,
    terms: dbQuote.terms,
    // shifts and subcontractors will be populated separately
  };
}

export function quoteToDb(quote: Quote): DbQuote {
  return {
    id: quote.id,
    name: quote.name,
    title: quote.title,
    client_name: quote.clientName,
    site_name: quote.siteName,
    status: quote.status,
    overhead_percentage: quote.overheadPercentage,
    margin_percentage: quote.marginPercentage,
    total_price: quote.totalPrice,
    labor_cost: quote.laborCost,
    supplies_cost: quote.suppliesCost,
    equipment_cost: quote.equipmentCost,
    subcontractor_cost: quote.subcontractorCost,
    overhead_cost: quote.overheadCost,
    margin_amount: quote.marginAmount,
    total_cost: quote.totalCost,
    created_at: quote.createdAt,
    updated_at: quote.updatedAt,
    quote_number: quote.quoteNumber,
    valid_until: quote.validUntil,
    client_id: quote.clientId,
    site_id: quote.siteId,
    user_id: quote.userId,
    created_by: quote.createdBy,
    start_date: quote.startDate,
    end_date: quote.endDate,
    expiry_date: quote.expiryDate,
    contract_length: quote.contractLength,
    contract_length_unit: quote.contractLengthUnit,
    overhead_profile: quote.overheadProfile,
    notes: quote.notes,
    frequency: quote.frequency,
    scope: quote.scope,
    terms: quote.terms
  };
}

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
    location: dbShift.location,
    notes: dbShift.notes,
    createdAt: dbShift.created_at,
    updatedAt: dbShift.updated_at
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
    allowances: shift.allowances || [],
    estimated_cost: shift.estimatedCost,
    location: shift.location,
    notes: shift.notes,
    created_at: shift.createdAt,
    updated_at: shift.updatedAt
  };
}

export function dbToSubcontractor(dbSubcontractor: DbQuoteSubcontractor): QuoteSubcontractor {
  return {
    id: dbSubcontractor.id,
    quoteId: dbSubcontractor.quote_id,
    name: dbSubcontractor.name,
    description: dbSubcontractor.description || '',
    cost: dbSubcontractor.cost,
    frequency: dbSubcontractor.frequency as Frequency,
    email: dbSubcontractor.email,
    phone: dbSubcontractor.phone,
    service: dbSubcontractor.service,
    notes: dbSubcontractor.notes,
    services: dbSubcontractor.services || [],
    customServices: dbSubcontractor.custom_services,
    monthlyCost: dbSubcontractor.monthly_cost,
    isFlatRate: dbSubcontractor.is_flat_rate,
    createdAt: dbSubcontractor.created_at,
    updatedAt: dbSubcontractor.updated_at
  };
}

export function subcontractorToDb(subcontractor: QuoteSubcontractor): DbQuoteSubcontractor {
  return {
    id: subcontractor.id,
    quote_id: subcontractor.quoteId,
    name: subcontractor.name,
    description: subcontractor.description,
    cost: subcontractor.cost,
    frequency: subcontractor.frequency,
    email: subcontractor.email,
    phone: subcontractor.phone,
    service: subcontractor.service,
    notes: subcontractor.notes,
    services: subcontractor.services,
    custom_services: subcontractor.customServices,
    monthly_cost: subcontractor.monthlyCost,
    is_flat_rate: subcontractor.isFlatRate,
    created_at: subcontractor.createdAt,
    updated_at: subcontractor.updatedAt
  };
}
