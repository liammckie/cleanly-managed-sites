
import { supabase } from '@/lib/supabase';
import { Quote } from '@/types/models';
import { get } from 'lodash';

// Directly adapt the quote to API format without using external functions
export const adaptQuoteToApi = (quoteData: Partial<Quote>) => {
  // Map camelCase properties to snake_case for the API
  return {
    name: quoteData.name,
    client_name: quoteData.clientName,
    site_name: quoteData.siteName,
    status: quoteData.status,
    total_price: quoteData.totalPrice,
    labor_cost: quoteData.laborCost,
    overhead_percentage: quoteData.overheadPercentage,
    margin_percentage: quoteData.marginPercentage,
    subcontractor_cost: quoteData.subcontractorCost,
    overhead_cost: quoteData.overheadCost,
    margin_amount: quoteData.marginAmount,
    total_cost: quoteData.totalCost,
    start_date: quoteData.startDate,
    end_date: quoteData.endDate,
    expiry_date: quoteData.expiryDate,
    notes: quoteData.notes,
    created_by: quoteData.createdBy || get(supabase.auth.getUser(), 'data.user.id'),
    user_id: quoteData.userId,
    overhead_profile: quoteData.overheadProfile,
    contract_length: quoteData.contractLength,
    contract_length_unit: quoteData.contractLengthUnit,
  };
};

/**
 * Converts a database quote to the frontend format
 */
export const adaptQuoteToFrontend = (dbQuote: any): Quote => {
  if (!dbQuote) return {} as Quote;
  
  // Create base quote with DB properties directly mapped
  const quote = {
    id: dbQuote.id,
    name: dbQuote.name,
    clientName: dbQuote.client_name,
    siteName: dbQuote.site_name,
    status: dbQuote.status,
    totalPrice: dbQuote.total_price || 0,
    laborCost: dbQuote.labor_cost || 0,
    overheadPercentage: dbQuote.overhead_percentage || 15,
    marginPercentage: dbQuote.margin_percentage || 20,
    subcontractorCost: dbQuote.subcontractor_cost || 0,
    overheadCost: dbQuote.overhead_cost || 0,
    marginAmount: dbQuote.margin_amount || 0,
    totalCost: dbQuote.total_cost || 0,
    createdBy: dbQuote.created_by,
    createdAt: dbQuote.created_at,
    updatedAt: dbQuote.updated_at,
    startDate: dbQuote.start_date,
    endDate: dbQuote.end_date,
    expiryDate: dbQuote.expiry_date,
    notes: dbQuote.notes,
    overheadProfile: dbQuote.overhead_profile,
    contractLength: dbQuote.contract_length,
    contractLengthUnit: dbQuote.contract_length_unit,
    userId: dbQuote.user_id
  } as Quote;
  
  // Add shifts if they exist
  if (dbQuote.shifts) {
    quote.shifts = dbQuote.shifts.map((shift: any) => ({
      id: shift.id,
      quoteId: shift.quote_id,
      day: shift.day,
      startTime: shift.start_time,
      endTime: shift.end_time,
      breakDuration: shift.break_duration,
      numberOfCleaners: shift.number_of_cleaners,
      employmentType: shift.employment_type,
      level: shift.level,
      allowances: shift.allowances || [],
      estimatedCost: shift.estimated_cost || 0,
      location: shift.location,
      notes: shift.notes,
    }));
  }
  
  // Add subcontractors if they exist
  if (dbQuote.subcontractors) {
    quote.subcontractors = dbQuote.subcontractors.map((sub: any) => ({
      id: sub.id,
      quoteId: sub.quote_id,
      name: sub.name,
      description: sub.description,
      cost: sub.cost || 0,
      frequency: sub.frequency,
      email: sub.email,
      phone: sub.phone,
      notes: sub.notes,
    }));
  }
  
  return quote;
};
