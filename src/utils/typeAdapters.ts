import { QuoteStatus, Day, Frequency } from '@/types/common';

// Type definitions
export interface OverheadProfile {
  id: string;
  name: string;
  laborPercentage: number;
  description?: string;
}

interface RawOverheadProfile {
  id: string;
  name: string;
  labor_percentage: number;
  description?: string;
}

export interface QuoteShift {
  id: string;
  quoteId: string;
  day: Day;
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: string;
  level: number;
  allowances: string[];
  estimatedCost: number;
  location?: string;
  notes?: string;
}

export interface ApiQuote {
  id: string;
  name: string;
  client_name: string;
  site_name?: string;
  status: string;
  overhead_percentage: number;
  margin_percentage: number;
  total_price: number;
  labor_cost: number;
  supplies_cost?: number;
  equipment_cost?: number;
  subcontractor_cost: number;
  created_at: string;
  updated_at: string;
  // Other properties...
}

export interface FrontendQuote {
  id: string;
  name: string;
  clientName: string;
  siteName?: string;
  status: QuoteStatus;
  overheadPercentage: number;
  marginPercentage: number;
  totalPrice: number;
  laborCost: number;
  suppliesCost?: number;
  equipmentCost?: number;
  subcontractorCost: number;
  createdAt: string;
  updatedAt: string;
  // Other properties...
}

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
}

export interface ApiUserRole {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
}

// Adapter functions
export const adaptOverheadProfile = (profile: RawOverheadProfile): OverheadProfile => {
  return {
    id: profile.id,
    name: profile.name,
    laborPercentage: profile.labor_percentage,
    description: profile.description
  };
};

export const adaptQuote = (apiQuote: ApiQuote): FrontendQuote => {
  return {
    id: apiQuote.id,
    name: apiQuote.name,
    clientName: apiQuote.client_name,
    siteName: apiQuote.site_name,
    status: apiQuote.status as QuoteStatus,
    overheadPercentage: apiQuote.overhead_percentage,
    marginPercentage: apiQuote.margin_percentage,
    totalPrice: apiQuote.total_price,
    laborCost: apiQuote.labor_cost,
    suppliesCost: apiQuote.supplies_cost,
    equipmentCost: apiQuote.equipment_cost,
    subcontractorCost: apiQuote.subcontractor_cost,
    createdAt: apiQuote.created_at,
    updatedAt: apiQuote.updated_at
  };
};

export const adaptQuoteToFrontend = adaptQuote;

export const adaptQuoteToApi = (frontendQuote: FrontendQuote): ApiQuote => {
  return {
    id: frontendQuote.id,
    name: frontendQuote.name,
    client_name: frontendQuote.clientName,
    site_name: frontendQuote.siteName,
    status: frontendQuote.status,
    overhead_percentage: frontendQuote.overheadPercentage,
    margin_percentage: frontendQuote.marginPercentage,
    total_price: frontendQuote.totalPrice,
    labor_cost: frontendQuote.laborCost,
    supplies_cost: frontendQuote.suppliesCost,
    equipment_cost: frontendQuote.equipmentCost,
    subcontractor_cost: frontendQuote.subcontractorCost,
    created_at: frontendQuote.createdAt,
    updated_at: frontendQuote.updatedAt
  };
};

export const adaptUserRole = (apiRole: ApiUserRole): UserRole => {
  return {
    id: apiRole.id,
    name: apiRole.name,
    description: apiRole.description,
    permissions: apiRole.permissions
  };
};

export const adaptUserRoleToApi = (role: UserRole): ApiUserRole => {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    permissions: role.permissions
  };
};

export const adaptQuoteShift = (shift: any): QuoteShift => {
  return {
    id: shift.id,
    quoteId: shift.quoteId || shift.quote_id,
    day: shift.day as Day,
    startTime: shift.startTime || shift.start_time,
    endTime: shift.endTime || shift.end_time,
    breakDuration: shift.breakDuration || shift.break_duration,
    numberOfCleaners: shift.numberOfCleaners || shift.number_of_cleaners,
    employmentType: shift.employmentType || shift.employment_type,
    level: shift.level,
    allowances: shift.allowances || [],
    estimatedCost: shift.estimatedCost || shift.estimated_cost,
    location: shift.location,
    notes: shift.notes
  };
};

export const adaptSystemUser = (user: any) => {
  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    firstName: user.first_name,
    lastName: user.last_name,
    avatarUrl: user.avatar_url,
    role: user.role,
    status: user.status,
    territories: user.territories || [],
    title: user.title,
    phone: user.phone,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    lastLogin: user.last_login,
    customId: user.custom_id,
    permissions: user.permissions || {}
  };
};
