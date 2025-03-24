
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

export function adaptQuoteFromDatabase(data: any): Quote {
  return {
    id: data.id || '',
    title: data.name || '',
    name: data.name || '',
    clientName: data.client_name || '',
    siteName: data.site_name || '',
    description: data.description || '',
    status: data.status || 'draft',
    overheadPercentage: data.overhead_percentage || 0,
    marginPercentage: data.margin_percentage || 0,
    totalPrice: data.total_price || 0,
    laborCost: data.labor_cost || 0,
    suppliesCost: data.supplies_cost || 0,
    equipmentCost: data.equipment_cost || 0,
    subcontractorCost: data.subcontractor_cost || 0,
    createdAt: data.created_at || '',
    updatedAt: data.updated_at || '',
    quoteNumber: data.quote_number || '',
    validUntil: data.valid_until || '',
    clientId: data.client_id || '',
    clientContact: data.client_contact || '',
    clientEmail: data.client_email || '',
    clientPhone: data.client_phone || '',
    siteAddress: data.site_address || '',
    siteId: data.site_id || '',
    frequency: data.frequency || '',
    scope: data.scope || '',
    terms: data.terms || '',
    notes: data.notes || '',
    created_by: data.created_by || '',
    overheadCost: data.overhead_cost || 0,
    totalCost: data.total_cost || 0,
    marginAmount: data.margin_amount || 0,
    startDate: data.start_date || null,
    endDate: data.end_date || null,
    expiryDate: data.expiry_date || null,
    contractLength: data.contract_length || null,
    contractLengthUnit: data.contract_length_unit || null,
    overheadProfile: data.overhead_profile || 'standard',
  };
}

export function adaptQuoteForDatabase(quote: Quote): any {
  return {
    id: quote.id,
    name: quote.title || quote.name,
    client_name: quote.clientName,
    site_name: quote.siteName,
    description: quote.description,
    status: quote.status,
    overhead_percentage: quote.overheadPercentage,
    margin_percentage: quote.marginPercentage,
    total_price: quote.totalPrice,
    labor_cost: quote.laborCost,
    supplies_cost: quote.suppliesCost,
    equipment_cost: quote.equipmentCost,
    subcontractor_cost: quote.subcontractorCost,
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
  };
}

export function adaptShiftFromDatabase(data: any): QuoteShift {
  return {
    id: data.id || '',
    quoteId: data.quote_id || '',
    day: data.day || 'monday',
    startTime: data.start_time || '09:00',
    endTime: data.end_time || '17:00',
    breakDuration: data.break_duration || 30,
    numberOfCleaners: data.number_of_cleaners || 1,
    employmentType: data.employment_type || 'full_time',
    level: data.level || 1,
    allowances: data.allowances || [],
    estimatedCost: data.estimated_cost || 0,
    location: data.location || '',
    notes: data.notes || '',
  };
}

export function adaptShiftForDatabase(shift: QuoteShift): any {
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
  };
}

export function dbToQuoteShift(data: any): QuoteShift {
  return adaptShiftFromDatabase(data);
}

export function quoteShiftToDb(shift: QuoteShift): any {
  return adaptShiftForDatabase(shift);
}

export function adaptSubcontractorFromDatabase(data: any): Subcontractor {
  return {
    id: data.id || '',
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    services: data.services || [],
    service: Array.isArray(data.services) && data.services.length > 0 ? data.services[0] : '',
    rate: data.rate || 0,
    frequency: data.frequency || 'weekly',
    notes: data.notes || '',
    description: data.description || '',
    cost: data.cost || 0,
  };
}

export function adaptSubcontractorForDatabase(subcontractor: Subcontractor): any {
  return {
    id: subcontractor.id,
    name: subcontractor.name,
    email: subcontractor.email || '',
    phone: subcontractor.phone || '',
    services: subcontractor.services || (subcontractor.service ? [subcontractor.service] : []),
    rate: subcontractor.rate || 0,
    frequency: subcontractor.frequency || 'weekly',
    notes: subcontractor.notes || '',
    description: subcontractor.description || '',
    cost: subcontractor.cost || 0,
  };
}

export function dbToSubcontractor(data: any): Subcontractor {
  return adaptSubcontractorFromDatabase(data);
}

export function subcontractorToDb(subcontractor: Subcontractor): any {
  return adaptSubcontractorForDatabase(subcontractor);
}

export function dbToQuote(data: any): Quote {
  return adaptQuoteFromDatabase(data);
}

export function quoteToDb(quote: Quote): any {
  return adaptQuoteForDatabase(quote);
}

export function dbToOverheadProfile(data: any): any {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    laborPercentage: data.labor_percentage,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    userId: data.user_id,
  };
}
