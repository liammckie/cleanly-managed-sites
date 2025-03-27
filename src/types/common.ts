
// Commonly used types across the application

export type SiteStatus = 'active' | 'pending' | 'inactive' | 'lost' | 'on-hold';

export type UserStatus = 'active' | 'pending' | 'inactive';

export type ClientStatus = 'active' | 'inactive' | 'lead' | 'on-hold' | 'cancelled';

export type ContractorStatus = 'active' | 'inactive' | 'on-hold' | 'blacklisted';

export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

export interface JsonObject {
  [key: string]: JsonValue;
}

export type SystemUserStatus = 'active' | 'pending' | 'inactive';

export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'public_holiday' | 'weekday';

export type EmploymentType = 'casual' | 'part_time' | 'full_time' | 'contractor';

export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;

export type Frequency = 
  | 'daily' 
  | 'weekly' 
  | 'fortnightly' 
  | 'monthly' 
  | 'quarterly' 
  | 'yearly' 
  | 'annually'
  | 'once' 
  | 'one-time'
  | 'accepted'
  | 'per_event'
  | 'per-event';

export type Json = 
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];
