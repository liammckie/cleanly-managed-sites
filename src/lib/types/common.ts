
/**
 * Common Type Definitions
 * Shared types and enums used throughout the application
 */

// Define JSON type
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Status enums
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';
export type ClientStatus = 'active' | 'inactive' | 'lead' | 'former';
export type SiteStatus = 'active' | 'pending' | 'inactive' | 'lost' | 'on-hold';
export type ContractStatus = 'active' | 'pending' | 'expired' | 'terminated' | 'on-hold';
export type WorkOrderStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold';
export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';

// Common entity fields
export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// Basic result interface
export interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination metadata
export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Paginated result
export interface PaginatedResult<T> extends Result<T[]> {
  pagination?: PaginationMeta;
}

// Filter options for queries
export interface FilterOptions {
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  clientId?: string;
  siteId?: string;
  userId?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

// Location interface
export interface Location {
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}
