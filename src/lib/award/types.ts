
// Add this file if it doesn't exist yet
import { Json } from "@/lib/supabase";

export type Quote = {
  id: string;
  name: string;
  clientName: string;
  siteName: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  startDate: string;
  endDate: string;
  expiryDate: string;
  contractLength: number;
  contractLengthUnit: 'days' | 'weeks' | 'months' | 'years';
  overheadProfile: string;
  overheadPercentage: number;
  marginPercentage: number;
  notes: string;
  laborCost: number;
  overheadCost: number;
  subcontractorCost: number;
  totalCost: number;
  marginAmount: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  userId: string;
  shifts: QuoteShift[];
  subcontractors: Subcontractor[];
};

export type QuoteShift = {
  id: string;
  quoteId: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'public-holiday';
  startTime: string;
  endTime: string;
  breakDuration: number;
  level: number;
  employmentType: 'full-time' | 'part-time' | 'casual';
  numberOfCleaners: number;
  location: string;
  allowances: any[];
  estimatedCost: number;
  notes: string;
};

export type Subcontractor = {
  id: string;
  quoteId: string;
  name: string;
  service: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'once-off';
  cost: number;
};

export type OverheadProfile = {
  id: string;
  name: string;
  description: string;
  laborPercentage: number;
};

export type Allowance = {
  id: string;
  name: string;
  unit: string;
  amount: number;
  description?: string;
};

// Additional types needed for the quote system
export type ShiftTemplate = {
  id: string;
  name: string;
  description?: string;
  day: QuoteShift['day'];
  startTime: string;
  endTime: string;
  breakDuration: number;
  level: number;
  employmentType: QuoteShift['employmentType'];
  numberOfCleaners: number;
  allowances: any[];
};
