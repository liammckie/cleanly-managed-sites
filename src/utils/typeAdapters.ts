
import { ContractDetails } from '@/types/contracts';
import { Quote } from '@/types/models';
import { UserRole } from '@/lib/types/users';

/**
 * Adapts raw contract details to frontend contract details format
 * @param details The raw contract details from API/DB
 * @returns A properly formatted ContractDetails object
 */
export const adaptContractDetailsToApi = (details: ContractDetails): any => {
  if (!details) return null;
  
  // Ensure renewal period is a string
  return {
    ...details,
    renewalPeriod: String(details.renewalPeriod || ''),
  };
};

/**
 * Adapts billing details to DTO format for API calls
 * @param billingDetails The billing details from form
 * @returns Billing details formatted for API
 */
export const adaptBillingDetailsToDTO = (billingDetails: any): any => {
  if (!billingDetails) return null;
  
  return {
    ...billingDetails,
    serviceDeliveryType: billingDetails.serviceDeliveryType || 'direct',
    billingLines: billingDetails.billingLines || []
  };
};

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

export function adaptOverheadProfile(dbProfile: DbOverheadProfile): OverheadProfile {
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

export function adaptOverheadProfileToDb(profile: OverheadProfile): DbOverheadProfile {
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

/**
 * Adapts Quote data for frontend use
 * @param apiQuote Quote data from API
 * @returns Formatted Quote for frontend
 */
export function adaptQuote(apiQuote: any): Quote {
  return {
    id: apiQuote.id,
    name: apiQuote.name || '',
    clientName: apiQuote.client_name || apiQuote.clientName || '',
    siteName: apiQuote.site_name || apiQuote.siteName || '',
    status: apiQuote.status || 'draft',
    totalPrice: apiQuote.total_price || apiQuote.totalPrice || 0,
    laborCost: apiQuote.labor_cost || apiQuote.laborCost || 0,
    overheadPercentage: apiQuote.overhead_percentage || apiQuote.overheadPercentage || 15,
    marginPercentage: apiQuote.margin_percentage || apiQuote.marginPercentage || 20,
    subcontractorCost: apiQuote.subcontractor_cost || apiQuote.subcontractorCost || 0,
    createdAt: apiQuote.created_at || apiQuote.createdAt || '',
    updatedAt: apiQuote.updated_at || apiQuote.updatedAt || '',
    shifts: apiQuote.shifts || [],
    subcontractors: apiQuote.subcontractors || [],
    title: apiQuote.title || apiQuote.name || '',
    description: apiQuote.description || '',
    marginAmount: apiQuote.margin_amount || apiQuote.marginAmount || 0,
    overheadCost: apiQuote.overhead_cost || apiQuote.overheadCost || 0,
    totalCost: apiQuote.total_cost || apiQuote.totalCost || 0,
    startDate: apiQuote.start_date || apiQuote.startDate || '',
    endDate: apiQuote.end_date || apiQuote.endDate || '',
    expiryDate: apiQuote.expiry_date || apiQuote.expiryDate || '',
    notes: apiQuote.notes || '',
    quoteNumber: apiQuote.quote_number || apiQuote.quoteNumber || '',
    validUntil: apiQuote.valid_until || apiQuote.validUntil || '',
    contractLength: apiQuote.contract_length || apiQuote.contractLength || 0,
    contractLengthUnit: apiQuote.contract_length_unit || apiQuote.contractLengthUnit || 'months',
  };
}

/**
 * Adapts frontend Quote to API format
 * @param quote Frontend Quote object
 * @returns Quote formatted for API
 */
export function adaptQuoteToApi(quote: Quote): any {
  return {
    id: quote.id,
    name: quote.name,
    client_name: quote.clientName,
    site_name: quote.siteName,
    status: quote.status,
    total_price: quote.totalPrice,
    labor_cost: quote.laborCost,
    overhead_percentage: quote.overheadPercentage,
    margin_percentage: quote.marginPercentage,
    subcontractor_cost: quote.subcontractorCost,
    margin_amount: quote.marginAmount,
    overhead_cost: quote.overheadCost,
    total_cost: quote.totalCost,
    start_date: quote.startDate,
    end_date: quote.endDate,
    expiry_date: quote.expiryDate,
    notes: quote.notes,
    contract_length: quote.contractLength,
    contract_length_unit: quote.contractLengthUnit,
    shifts: quote.shifts,
    subcontractors: quote.subcontractors,
  };
}

/**
 * Transforms Quote from API for frontend display
 * @param apiQuote Quote from API
 * @returns Formatted Quote for frontend display
 */
export function adaptQuoteToFrontend(apiQuote: any): Quote {
  return adaptQuote(apiQuote);
}

/**
 * Maps address object from API to a formatted string
 * @param address Address object
 * @returns Formatted address string
 */
export function adaptAddress(address: any): string {
  if (!address) return '';
  
  const parts = [
    address.street,
    address.city,
    address.state,
    address.postcode || address.postalCode,
    address.country
  ].filter(Boolean);
  
  return parts.join(', ');
}

/**
 * Adapts UserRole for API
 * @param role UserRole object
 * @returns Role formatted for API
 */
export function adaptUserRoleToApi(role: UserRole): any {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    permissions: role.permissions
  };
}

/**
 * Adapts UserRole from API
 * @param apiRole Role from API
 * @returns Formatted UserRole
 */
export function adaptUserRole(apiRole: any): UserRole {
  return {
    id: apiRole.id,
    name: apiRole.name,
    description: apiRole.description,
    permissions: apiRole.permissions as Record<string, boolean>,
    created_at: apiRole.created_at,
    updated_at: apiRole.updated_at,
    user_count: apiRole.user_count
  };
}
