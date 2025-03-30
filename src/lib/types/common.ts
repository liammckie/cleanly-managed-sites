
/**
 * Common type definitions used across the application
 */

// User status enum
export type UserStatus = 'active' | 'pending' | 'inactive';

// Generic JSON type for flexible data storage
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Date formats
export type DateFormat = 'iso' | 'short' | 'long' | 'relative';

// Common status types
export type Status = 'active' | 'inactive' | 'pending' | 'archived' | 'draft';

// Pagination params
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// Sort direction
export type SortDirection = 'asc' | 'desc';

// Sort params
export interface SortParams {
  field: string;
  direction: SortDirection;
}
