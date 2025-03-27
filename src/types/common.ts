
// Add or update this file with the QuoteStatus type
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'weekday' | 'public_holiday';
export type EmploymentType = 'casual' | 'part_time' | 'full_time';
export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;
export type SiteStatus = 'active' | 'pending' | 'inactive' | 'lost' | 'on-hold';
export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'pending' | 'accepted';
export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'yearly';
export type Frequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'yearly' | 'once';

// General JSON types
export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];
export type JsonObject = { [key: string]: JsonValue };
export type Json = JsonValue;

// Payment conditions type
export type PayCondition = 'standard' | 'saturday' | 'sunday' | 'public_holiday' | 'overtime_1_5' | 'overtime_2';
