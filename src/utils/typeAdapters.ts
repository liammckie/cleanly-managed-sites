
import { Day, Frequency, QuoteStatus } from '@/types/common';

// Adapter for overhead profiles
export function adaptOverheadProfile(profile: any) {
  return {
    id: profile.id || '',
    name: profile.name || '',
    laborPercentage: profile.labor_percentage || 15,
    description: profile.description || ''
  };
}

// Adapter for quotes
export function adaptQuote(quote: any) {
  return {
    id: quote.id,
    name: quote.name,
    clientName: quote.client_name || quote.clientName,
    siteName: quote.site_name || quote.siteName,
    status: quote.status,
    startDate: quote.start_date || quote.startDate,
    endDate: quote.end_date || quote.endDate,
    expiryDate: quote.expiry_date || quote.expiryDate,
    totalPrice: quote.total_price || quote.totalPrice || 0,
    createdAt: quote.created_at || quote.createdAt,
    updatedAt: quote.updated_at || quote.updatedAt
  };
}

// Quote adapters for API
export function adaptQuoteToApi(quote: any) {
  return {
    id: quote.id,
    name: quote.name,
    client_name: quote.clientName,
    site_name: quote.siteName,
    status: quote.status,
    start_date: quote.startDate,
    end_date: quote.endDate,
    expiry_date: quote.expiryDate,
    total_price: quote.totalPrice,
    created_at: quote.createdAt,
    updated_at: quote.updatedAt
  };
}

export function adaptQuoteToFrontend(quote: any) {
  return adaptQuote(quote);
}

// User role adapters
export function adaptUserRole(role: any) {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    permissions: typeof role.permissions === 'string' 
      ? JSON.parse(role.permissions) 
      : role.permissions,
    createdAt: role.created_at,
    updatedAt: role.updated_at,
    userCount: role.user_count || 0
  };
}

export function adaptUserRoleToApi(role: any) {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    permissions: typeof role.permissions === 'object' 
      ? JSON.stringify(role.permissions) 
      : role.permissions,
    created_at: role.createdAt,
    updated_at: role.updatedAt
  };
}

// Helper for fixing the Shift adapters
export function adaptQuoteShift(shift: any) {
  // Handle both camelCase and snake_case
  return {
    id: shift.id,
    day: shift.day as Day,
    startTime: shift.startTime || shift.start_time,
    endTime: shift.endTime || shift.end_time,
    breakDuration: shift.breakDuration || shift.break_duration || 30,
    numberOfCleaners: shift.numberOfCleaners || shift.number_of_cleaners || 1,
    employmentType: shift.employmentType || shift.employment_type,
    level: shift.level,
    location: shift.location,
    notes: shift.notes,
    estimatedCost: shift.estimatedCost || shift.estimated_cost || 0,
    quoteId: shift.quoteId || shift.quote_id
  };
}

// Define the DB and frontend types for OverheadProfile
export interface DbOverheadProfile {
  id: string;
  name: string;
  description?: string;
  labor_percentage: number;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface OverheadProfile {
  id: string;
  name: string;
  description?: string;
  laborPercentage: number;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export function dbToOverheadProfile(dbProfile: DbOverheadProfile): OverheadProfile {
  return {
    id: dbProfile.id,
    name: dbProfile.name,
    description: dbProfile.description,
    laborPercentage: dbProfile.labor_percentage,
    createdAt: dbProfile.created_at,
    updatedAt: dbProfile.updated_at,
    userId: dbProfile.user_id
  };
}

export function overheadProfileToDb(profile: OverheadProfile): DbOverheadProfile {
  return {
    id: profile.id,
    name: profile.name,
    description: profile.description,
    labor_percentage: profile.laborPercentage,
    created_at: profile.createdAt,
    updated_at: profile.updatedAt,
    user_id: profile.userId
  };
}
