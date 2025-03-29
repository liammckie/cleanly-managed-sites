
import { ContractData, ContractDetails } from '@/types/contracts';
import { Contract } from '@/types/db';
import { EmploymentType } from '@/types/common';
import { mapToDb, mapFromDb } from '@/lib/utils/mappers';

// Define interface for overhead profiles
export interface RawOverheadProfile {
  id: string;
  name: string;
  labor_percentage: number;
  created_at?: string;
  updated_at?: string;
}

export interface OverheadProfile {
  id: string;
  name: string;
  laborPercentage: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiQuote {
  id: string;
  name: string;
  client_id?: string;
  site_id?: string;
  client_name: string;
  site_name?: string;
  start_date?: string;
  end_date?: string;
  expiry_date?: string;
  overhead_percentage: number;
  margin_percentage: number;
  status: string;
  total_price: number;
  labor_cost: number;
  subcontractor_cost: number;
  margin_amount: number;
  created_at: string;
  updated_at: string;
}

export interface FrontendQuote {
  id: string;
  name: string;
  clientId?: string;
  siteId?: string;
  clientName: string;
  siteName?: string;
  startDate?: string;
  endDate?: string;
  expiryDate?: string;
  overheadPercentage: number;
  marginPercentage: number;
  status: string;
  totalPrice: number;
  laborCost: number;
  subcontractorCost: number;
  marginAmount: number;
  createdAt: string;
  updatedAt: string;
}

export type QuoteDTO = Partial<FrontendQuote>;

export interface ApiUserRole {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
  user_count?: number;
}

// Contract adapters
export function adaptContractToFrontend(contract: Contract): ContractData {
  return {
    id: contract.id,
    site_id: contract.site_id,
    client_id: contract.client_id,
    contract_number: contract.contract_number,
    start_date: contract.start_date,
    end_date: contract.end_date,
    value: contract.value,
    auto_renewal: contract.auto_renewal,
    renewal_period: contract.renewal_period,
    renewal_notice_days: contract.renewal_notice_days,
    termination_period: contract.termination_period,
    billing_cycle: contract.billing_cycle,
    contract_type: contract.contract_type,
    service_frequency: contract.service_frequency,
    service_delivery_method: contract.service_delivery_method,
    created_at: contract.created_at,
    updated_at: contract.updated_at,
    notes: contract.notes,
    status: contract.status
  };
}

export function adaptContractToApi(details: ContractDetails): Contract {
  return {
    id: details.id || '',
    site_id: '',  // This must be populated when using this function
    contract_number: details.contractNumber,
    start_date: details.startDate,
    end_date: details.endDate,
    auto_renewal: details.autoRenewal,
    renewal_period: details.renewalPeriod,
    renewal_notice_days: details.renewalNoticeDays,
    termination_period: details.terminationPeriod,
    billing_cycle: details.billingCycle,
    service_frequency: details.serviceFrequency,
    service_delivery_method: details.serviceDeliveryMethod,
    value: details.value,
    notes: details.notes,
    created_at: '',  // Will be set by the database
    updated_at: '',  // Will be set by the database
    status: details.status,
    contract_type: details.contractType
  };
}

// Overhead profile adapters
export function adaptOverheadProfile(profile: RawOverheadProfile): OverheadProfile {
  return {
    id: profile.id,
    name: profile.name,
    laborPercentage: profile.labor_percentage,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at
  };
}

// Employment type adapter
export function adaptEmploymentType(type: string): EmploymentType {
  switch(type) {
    case 'full_time':
      return 'full-time';
    case 'part_time':
      return 'part-time';
    case 'casual':
      return 'casual';
    default:
      return 'full-time';
  }
}

// Quote adapters
export function adaptQuoteToFrontend(quote: ApiQuote): FrontendQuote {
  return {
    id: quote.id,
    name: quote.name,
    clientId: quote.client_id,
    siteId: quote.site_id,
    clientName: quote.client_name,
    siteName: quote.site_name,
    startDate: quote.start_date,
    endDate: quote.end_date,
    expiryDate: quote.expiry_date,
    overheadPercentage: quote.overhead_percentage,
    marginPercentage: quote.margin_percentage,
    status: quote.status,
    totalPrice: quote.total_price,
    laborCost: quote.labor_cost,
    subcontractorCost: quote.subcontractor_cost,
    marginAmount: quote.margin_amount,
    createdAt: quote.created_at,
    updatedAt: quote.updated_at
  };
}

export function adaptQuoteToApi(quote: FrontendQuote): ApiQuote {
  return {
    id: quote.id,
    name: quote.name,
    client_id: quote.clientId,
    site_id: quote.siteId,
    client_name: quote.clientName,
    site_name: quote.siteName,
    start_date: quote.startDate,
    end_date: quote.endDate,
    expiry_date: quote.expiryDate,
    overhead_percentage: quote.overheadPercentage,
    margin_percentage: quote.marginPercentage,
    status: quote.status,
    total_price: quote.totalPrice,
    labor_cost: quote.laborCost,
    subcontractor_cost: quote.subcontractorCost,
    margin_amount: quote.marginAmount,
    created_at: quote.createdAt,
    updated_at: quote.updatedAt
  };
}

// Helper function to handle address conversions
export function stringToAddressObject(addressString: string) {
  if (!addressString) return { street: '', city: '', state: '', postcode: '', country: 'Australia' };
  
  // Simple split by commas or attempt to parse the address
  const parts = addressString.split(',').map(part => part.trim());
  
  return {
    street: parts[0] || '',
    city: parts[1] || '',
    state: parts[2] || '',
    postcode: parts[3] || '',
    country: parts[4] || 'Australia'
  };
}

// User adapter functions
export function adaptUserRole(role: any): ApiUserRole {
  // Parse permissions from JSON if needed
  let permissions: Record<string, boolean> = {};
  if (typeof role.permissions === 'string') {
    try {
      permissions = JSON.parse(role.permissions);
    } catch (e) {
      permissions = {};
    }
  } else if (role.permissions && typeof role.permissions === 'object') {
    permissions = role.permissions;
  }

  return {
    id: role.id,
    name: role.name,
    description: role.description || '',
    permissions,
    created_at: role.created_at,
    updated_at: role.updated_at,
    user_count: role.user_count
  };
}

export function adaptUserRoleToApi(role: ApiUserRole) {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    permissions: role.permissions,
    created_at: role.created_at,
    updated_at: role.updated_at
  };
}

export function adaptSystemUser(user: any) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    fullName: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
    avatarUrl: user.avatar_url,
    roleId: user.role_id,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    title: user.title || '',
    phone: user.phone || '',
    status: user.status || 'active',
    lastLogin: user.last_login,
    customId: user.custom_id || '',
    note: user.note || '',
    territories: user.territories || [],
    permissions: user.permissions || {}
  };
}
