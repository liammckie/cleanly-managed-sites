
import { QuoteStatus } from '@/types/common';

export interface Quote {
  id: string;
  name: string;
  client_name?: string;
  site_name?: string;
  status: QuoteStatus;
  total_price: number;
  total_cost: number;
  margin_amount: number;
  margin_percentage: number;
  overhead_cost: number;
  overhead_percentage: number;
  labor_cost: number;
  subcontractor_cost: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  userId?: string;
  overheadProfile?: string;
  start_date?: string;
  end_date?: string;
  expiry_date?: string;
  contract_length?: number;
  contract_length_unit?: string;
}

export const convertToDbQuote = (quote: Partial<Quote>) => {
  return {
    ...(quote.name !== undefined && { name: quote.name }),
    ...(quote.client_name !== undefined && { client_name: quote.client_name }),
    ...(quote.site_name !== undefined && { site_name: quote.site_name }),
    ...(quote.status !== undefined && { status: quote.status }),
    ...(quote.total_price !== undefined && { total_price: quote.total_price }),
    ...(quote.total_cost !== undefined && { total_cost: quote.total_cost }),
    ...(quote.margin_amount !== undefined && { margin_amount: quote.margin_amount }),
    ...(quote.margin_percentage !== undefined && { margin_percentage: quote.margin_percentage }),
    ...(quote.overhead_cost !== undefined && { overhead_cost: quote.overhead_cost }),
    ...(quote.overhead_percentage !== undefined && { overhead_percentage: quote.overhead_percentage }),
    ...(quote.labor_cost !== undefined && { labor_cost: quote.labor_cost }),
    ...(quote.subcontractor_cost !== undefined && { subcontractor_cost: quote.subcontractor_cost }),
    ...(quote.notes !== undefined && { notes: quote.notes }),
    ...(quote.created_by !== undefined && { created_by: quote.created_by }),
    ...(quote.userId !== undefined && { user_id: quote.userId }),
    ...(quote.overheadProfile !== undefined && { overhead_profile: quote.overheadProfile }),
    ...(quote.start_date !== undefined && { start_date: quote.start_date }),
    ...(quote.end_date !== undefined && { end_date: quote.end_date }),
    ...(quote.expiry_date !== undefined && { expiry_date: quote.expiry_date }),
    ...(quote.contract_length !== undefined && { contract_length: quote.contract_length }),
    ...(quote.contract_length_unit !== undefined && { contract_length_unit: quote.contract_length_unit })
  };
};

export const convertDbToQuote = (dbQuote: any): Quote => {
  return {
    id: dbQuote.id,
    name: dbQuote.name,
    client_name: dbQuote.client_name,
    site_name: dbQuote.site_name,
    status: dbQuote.status as QuoteStatus,
    total_price: dbQuote.total_price,
    total_cost: dbQuote.total_cost,
    margin_amount: dbQuote.margin_amount,
    margin_percentage: dbQuote.margin_percentage,
    overhead_cost: dbQuote.overhead_cost,
    overhead_percentage: dbQuote.overhead_percentage,
    labor_cost: dbQuote.labor_cost,
    subcontractor_cost: dbQuote.subcontractor_cost,
    notes: dbQuote.notes,
    created_at: dbQuote.created_at,
    updated_at: dbQuote.updated_at,
    created_by: dbQuote.created_by,
    userId: dbQuote.user_id,
    overheadProfile: dbQuote.overhead_profile,
    start_date: dbQuote.start_date,
    end_date: dbQuote.end_date,
    expiry_date: dbQuote.expiry_date,
    contract_length: dbQuote.contract_length,
    contract_length_unit: dbQuote.contract_length_unit
  };
};
