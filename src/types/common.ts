
// Basic types used across the application

export type SiteStatus = 'active' | 'pending' | 'inactive' | 'lost' | 'on-hold';

export type EmploymentType = 'full-time' | 'part-time' | 'casual' | 'contract' | 'intern';

export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;

export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// Extended day type that also includes special values
export type UnifiedDay = Day | 'weekday' | 'public_holiday';

export type QuoteStatus = 'draft' | 'submitted' | 'pending' | 'approved' | 'declined' | 'expired' | 'accepted' | 'sent' | 'rejected';

export type ServiceDeliveryType = 'direct' | 'contractor';

// Core entity common fields
export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

// JSON helper type
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
