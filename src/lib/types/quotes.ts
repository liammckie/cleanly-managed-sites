
/**
 * Type definitions for quotes
 */

export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'one-time';

export interface QuoteSubcontractor {
  id: string;
  quoteId: string;
  name: string;
  description: string;
  cost: number;
  frequency: Frequency;
  email?: string;
  phone?: string;
  notes?: string;
  services?: string[];
}

export interface QuoteItem {
  id: string;
  quoteId: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  frequency: Frequency;
  total: number;
  notes?: string;
  category?: string;
}

export interface QuoteDetails {
  id: string;
  clientId: string;
  clientName: string;
  siteId?: string;
  siteName?: string;
  title: string;
  description?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  createdBy: string;
  createdAt: string;
  validUntil?: string;
  totalAmount: number;
  items?: QuoteItem[];
  subcontractors?: QuoteSubcontractor[];
  notes?: string;
}
