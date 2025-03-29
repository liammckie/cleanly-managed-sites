
// Common type definitions
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type SiteStatus = 'active' | 'inactive' | 'pending' | 'on-hold' | 'lost';
export type ClientStatus = 'active' | 'inactive' | 'prospect' | 'pending';
export type ContractorStatus = 'active' | 'inactive' | 'pending';
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'void';
export type WorkOrderStatus = 'new' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'urgent';
