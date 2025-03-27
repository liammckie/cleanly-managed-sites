
import { SiteStatus, ServiceDeliveryType, BillingFrequency } from '@/types/common';
import { BillingDetails, BillingLine } from '@/components/sites/forms/types/billingTypes';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';

// DB and frontend types for OverheadProfile
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

// Adapt billing details to DTO format
export function adaptBillingDetailsToDTO(billingDetails: BillingDetails) {
  if (!billingDetails) return null;
  
  return {
    ...billingDetails,
    serviceDeliveryType: billingDetails.serviceDeliveryType === 'contractor' 
      ? 'contractor' as ServiceDeliveryType 
      : 'direct' as ServiceDeliveryType,
    billingLines: billingDetails.billingLines || []
  };
}

// Adapt contract details for API
export function adaptContractDetailsToApi(contractDetails: ContractDetails) {
  if (!contractDetails) return null;
  
  return {
    ...contractDetails,
    renewalPeriod: contractDetails.renewalPeriod?.toString() || '',
  };
}

// Adapt quote to API format
export function adaptQuoteToApi(quote: any) {
  return {
    id: quote.id,
    title: quote.title,
    description: quote.description,
    client_id: quote.clientId,
    site_id: quote.siteId,
    total_amount: quote.totalAmount,
    status: quote.status,
    valid_until: quote.validUntil,
    scope_of_work: quote.scopeOfWork,
    notes: quote.notes,
    created_by: quote.createdBy,
    created_at: quote.createdAt,
    updated_at: quote.updatedAt,
    overhead_profile: quote.overheadProfile,
    line_items: quote.lineItems?.map((item: any) => ({
      id: item.id,
      quote_id: item.quoteId,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total: item.total,
      type: item.type,
      category: item.category
    }))
  };
}
