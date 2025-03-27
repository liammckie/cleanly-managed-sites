
import {
  ContractDetailsDTO,
  BillingDetailsDTO,
  BillingLineDTO,
  SiteDTO,
  UserDTO,
  QuoteDTO,
  ContactDTO
} from '@/types/dto';
import { 
  SiteStatus, 
  UserStatus, 
  QuoteStatus, 
  BillingFrequency,
  ServiceDeliveryType
} from '@/types/common';
import { 
  ContractDetails, 
  BillingDetails, 
  BillingLine 
} from '@/components/sites/forms/types/billingTypes';
import { SiteRecord, UserRecord } from '@/lib/types';

/**
 * Adapts a raw site object from the API to the SiteDTO format
 */
export function adaptSiteToDTO(site: any): SiteDTO {
  return {
    id: site.id,
    name: site.name,
    address: site.address || '',
    city: site.city || '',
    state: site.state || '',
    postcode: site.postcode || '',
    country: site.country || 'Australia',
    client_id: site.client_id,
    client_name: site.client_name || site.clients?.name,
    status: site.status as SiteStatus,
    representative: site.representative || '',
    contract_details: site.contract_details || {},
    billing_details: site.billing_details || {},
    job_specifications: site.job_specifications || {},
    security_details: site.security_details || {},
    monthly_revenue: site.monthly_revenue,
    weekly_revenue: site.weekly_revenue,
    annual_revenue: site.annual_revenue,
    monthly_cost: site.monthly_cost,
    created_at: site.created_at,
    updated_at: site.updated_at,
    user_id: site.user_id,
    custom_id: site.custom_id,
    notes: site.notes || '',
    email: site.email || '',
    phone: site.phone || '',
    contacts: site.contacts || []
  };
}

/**
 * Adapts a raw user object from the API to the UserDTO format
 */
export function adaptUserToDTO(user: any): UserDTO {
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name || '',
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    avatar_url: user.avatar_url,
    title: user.title,
    phone: user.phone,
    custom_id: user.custom_id,
    notes: user.notes,
    territories: user.territories,
    status: user.status as UserStatus,
    role_id: user.role_id,
    created_at: user.created_at,
    updated_at: user.updated_at,
    last_login: user.last_login,
    daily_summary: user.daily_summary
  };
}

/**
 * Adapts a quote object to the QuoteDTO format
 */
export function adaptQuoteToDTO(quote: any): QuoteDTO {
  return {
    id: quote.id,
    name: quote.name,
    title: quote.title,
    description: quote.description,
    clientName: quote.client_name,
    siteName: quote.site_name,
    status: quote.status as QuoteStatus,
    laborCost: quote.labor_cost || 0,
    overheadPercentage: quote.overhead_percentage || 15,
    marginPercentage: quote.margin_percentage || 20,
    marginAmount: quote.margin_amount,
    overheadCost: quote.overhead_cost,
    totalCost: quote.total_cost,
    subcontractorCost: quote.subcontractor_cost || 0,
    totalPrice: quote.total_price || 0,
    startDate: quote.start_date,
    endDate: quote.end_date,
    expiryDate: quote.expiry_date,
    contractLength: quote.contract_length,
    contractLengthUnit: quote.contract_length_unit,
    quoteNumber: quote.quote_number,
    validUntil: quote.valid_until,
    notes: quote.notes,
    createdAt: quote.created_at,
    updatedAt: quote.updated_at
  };
}

/**
 * Adapts a billing line object to the BillingLineDTO format
 */
export function adaptBillingLineToDTO(billingLine: any): BillingLineDTO {
  return {
    id: billingLine.id,
    description: billingLine.description,
    amount: billingLine.amount,
    isRecurring: billingLine.isRecurring,
    onHold: billingLine.onHold,
    frequency: billingLine.frequency as BillingFrequency,
    weeklyAmount: billingLine.weeklyAmount,
    monthlyAmount: billingLine.monthlyAmount,
    annualAmount: billingLine.annualAmount
  };
}

/**
 * Adapts a billing details object to the BillingDetailsDTO format
 */
export function adaptBillingDetailsToDTO(billingDetails: any): BillingDetailsDTO {
  if (!billingDetails) return {} as BillingDetailsDTO;
  
  return {
    useClientInfo: billingDetails.useClientInfo,
    billingMethod: billingDetails.billingMethod,
    paymentTerms: billingDetails.paymentTerms,
    billingEmail: billingDetails.billingEmail,
    billingAddress: billingDetails.billingAddress,
    serviceDeliveryType: (billingDetails.serviceDeliveryType === 'direct' || 
                        billingDetails.serviceDeliveryType === 'contractor') 
                        ? billingDetails.serviceDeliveryType as ServiceDeliveryType 
                        : 'direct',
    billingLines: billingDetails.billingLines?.map(adaptBillingLineToDTO) || [],
    contacts: billingDetails.contacts,
    weeklyBudget: billingDetails.weeklyBudget,
    rate: billingDetails.rate,
    xeroContactId: billingDetails.xeroContactId,
    billingFrequency: billingDetails.billingFrequency,
    invoiceFrequency: billingDetails.invoiceFrequency,
    invoiceDay: billingDetails.invoiceDay,
    weeklyContractorCost: billingDetails.weeklyContractorCost,
    monthlyContractorCost: billingDetails.monthlyContractorCost,
    annualContractorCost: billingDetails.annualContractorCost,
    contractorCostFrequency: billingDetails.contractorCostFrequency,
    contractorInvoiceFrequency: billingDetails.contractorInvoiceFrequency,
    totalWeeklyAmount: billingDetails.totalWeeklyAmount,
    totalMonthlyAmount: billingDetails.totalMonthlyAmount,
    totalAnnualAmount: billingDetails.totalAnnualAmount,
    deliveryMethod: billingDetails.deliveryMethod
  };
}

/**
 * Adapts a contract details object to the ContractDetailsDTO format
 */
export function adaptContractDetailsToDTO(contractDetails: any): ContractDetailsDTO {
  if (!contractDetails) return {} as ContractDetailsDTO;
  
  return {
    id: contractDetails.id,
    contractNumber: contractDetails.contractNumber,
    startDate: contractDetails.startDate,
    endDate: contractDetails.endDate,
    autoRenewal: contractDetails.autoRenewal,
    contractLength: contractDetails.contractLength,
    contractLengthUnit: contractDetails.contractLengthUnit,
    contractType: contractDetails.contractType,
    renewalPeriod: contractDetails.renewalPeriod?.toString(),
    renewalNoticeDays: contractDetails.renewalNoticeDays,
    noticeUnit: contractDetails.noticeUnit,
    serviceFrequency: contractDetails.serviceFrequency,
    serviceDeliveryMethod: contractDetails.serviceDeliveryMethod,
    renewalTerms: contractDetails.renewalTerms,
    terminationPeriod: contractDetails.terminationPeriod,
    value: contractDetails.value,
    billingCycle: contractDetails.billingCycle,
    notes: contractDetails.notes
  };
}

/**
 * Adapts a contact object to the ContactDTO format
 */
export function adaptContactToDTO(contact: any): ContactDTO {
  return {
    id: contact.id,
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    role: contact.role,
    department: contact.department,
    notes: contact.notes,
    is_primary: contact.is_primary || contact.isPrimary
  };
}

/**
 * Converts a SiteRecord to a SiteDTO
 */
export function siteRecordToDTO(site: SiteRecord): SiteDTO {
  return adaptSiteToDTO(site);
}

/**
 * Converts a UserRecord to a UserDTO
 */
export function userRecordToDTO(user: UserRecord): UserDTO {
  return adaptUserToDTO(user);
}
