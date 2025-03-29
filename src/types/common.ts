
// Common type definitions for the application

// Site status options
export type SiteStatus = 'active' | 'inactive' | 'pending' | 'on-hold';

// Employment types
export type EmploymentType = 'full-time' | 'part-time' | 'casual' | 'contract' | 'intern';

// Employee levels (1-5)
export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;

// Common JSON type for flexible contract data
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// Contract status options
export type ContractStatus = 'active' | 'pending' | 'expired' | 'cancelled' | 'draft';

// Billing frequency options
export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually';

// User status options
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

// User role options
export type UserRole = 'admin' | 'manager' | 'staff' | 'client';

// User permission options
export type UserPermission = 
  | 'read:clients'
  | 'write:clients'
  | 'read:sites'
  | 'write:sites'
  | 'read:contracts'
  | 'write:contracts'
  | 'read:users'
  | 'write:users'
  | 'read:workorders'
  | 'write:workorders';

// Basic user profile
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  status?: UserStatus;
}
