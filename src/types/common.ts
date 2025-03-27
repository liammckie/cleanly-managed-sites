
// Add or update this file with the QuoteStatus type
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type EmploymentType = 'casual' | 'part_time' | 'full_time';
export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;
export type SiteStatus = 'active' | 'pending' | 'inactive' | 'lost' | 'on-hold';
export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'pending' | 'accepted';
export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'yearly';

// General JSON type
export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];
