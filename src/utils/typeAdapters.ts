
import { SiteStatus, QuoteStatus } from '@/types/common';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';
import { BillingDetails } from '@/components/sites/forms/types/billingTypes';

// Adapter for job specifications
export function adaptJobSpecifications(jobSpecifications: any = {}) {
  return {
    daysPerWeek: jobSpecifications.daysPerWeek || 0,
    hoursPerDay: jobSpecifications.hoursPerDay || 0,
    directEmployees: jobSpecifications.directEmployees || 0,
    notes: jobSpecifications.notes || '',
    cleaningFrequency: jobSpecifications.cleaningFrequency || '',
    customFrequency: jobSpecifications.customFrequency || '',
    serviceDays: jobSpecifications.serviceDays || '',
    serviceTime: jobSpecifications.serviceTime || '',
    estimatedHours: jobSpecifications.estimatedHours || '',
    equipmentRequired: jobSpecifications.equipmentRequired || '',
    scopeNotes: jobSpecifications.scopeNotes || '',
    weeklyContractorCost: jobSpecifications.weeklyContractorCost || 0,
    monthlyContractorCost: jobSpecifications.monthlyContractorCost || 0,
    annualContractorCost: jobSpecifications.annualContractorCost || 0,
  };
}

// Create an adapter function for quotes
export function adaptQuote(quote: any = {}) {
  return {
    id: quote.id || '',
    name: quote.name || '',
    clientName: quote.client_name || quote.clientName || '',
    status: (quote.status || 'draft') as QuoteStatus,
    totalPrice: quote.total_price || quote.totalPrice || 0,
    createdAt: quote.created_at || quote.createdAt || new Date().toISOString(),
    expiryDate: quote.expiry_date || quote.expiryDate || '',
    suppliesCost: quote.supplies_cost || quote.suppliesCost || 0,
    equipmentCost: quote.equipment_cost || quote.equipmentCost || 0,
    quoteNumber: quote.quote_number || quote.quoteNumber || '',
    validUntil: quote.valid_until || quote.validUntil || '',
    clientId: quote.client_id || quote.clientId || '',
    siteId: quote.site_id || quote.siteId || '',
    overheadCost: quote.overhead_cost || quote.overheadCost || 0,
    totalCost: quote.total_cost || quote.totalCost || 0,
    marginAmount: quote.margin_amount || quote.marginAmount || 0,
    startDate: quote.start_date || quote.startDate || '',
    endDate: quote.end_date || quote.endDate || ''
  };
}

// Create adapter for billing details
export function adaptBillingDetails(billingDetails: any = {}): BillingDetails {
  return {
    billingAddress: billingDetails.billingAddress || {},
    useClientInfo: billingDetails.useClientInfo || false,
    billingMethod: billingDetails.billingMethod || 'email',
    paymentTerms: billingDetails.paymentTerms || 'net30',
    billingEmail: billingDetails.billingEmail || '',
    billingLines: billingDetails.billingLines || [],
    contacts: billingDetails.contacts || [],
    notes: billingDetails.notes || ''
  };
}

// Create adapter for contract details
export function adaptContractDetails(contractDetails: any = {}): ContractDetails {
  return {
    id: contractDetails.id,
    startDate: contractDetails.startDate || '',
    endDate: contractDetails.endDate || '',
    contractLength: contractDetails.contractLength || 0,
    contractLengthUnit: contractDetails.contractLengthUnit || 'months',
    autoRenewal: contractDetails.autoRenewal || false,
    renewalPeriod: contractDetails.renewalPeriod || 0,
    renewalNotice: contractDetails.renewalNotice || 0,
    noticeUnit: contractDetails.noticeUnit || 'days',
    serviceFrequency: contractDetails.serviceFrequency || '',
    serviceDeliveryMethod: contractDetails.serviceDeliveryMethod || '',
    contractNumber: contractDetails.contractNumber || '',
    renewalTerms: contractDetails.renewalTerms || '',
    terminationPeriod: contractDetails.terminationPeriod || '',
    contractType: contractDetails.contractType || 'cleaning',
    value: contractDetails.value || 0,
    billingCycle: contractDetails.billingCycle || 'monthly',
    notes: contractDetails.notes || '',
    terms: contractDetails.terms || []
  };
}

// Overhead profile adapter
export function dbToOverheadProfile(profile: any) {
  return {
    id: profile.id || '',
    name: profile.name || '',
    description: profile.description || '',
    basePercentage: profile.base_percentage || profile.basePercentage || 0,
    additionalFees: profile.additional_fees?.map((fee: any) => ({
      id: fee.id || crypto.randomUUID(),
      name: fee.name || '',
      percentage: fee.percentage || 0,
      isEnabled: fee.is_enabled !== undefined ? fee.is_enabled : true
    })) || []
  };
}
