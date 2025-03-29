
import { 
  Contract, 
  Quote, 
  QuoteShift, 
  FrontendQuoteShift, 
  QuoteSubcontractor,
  UserProfileWithRole,
  UserRole,
  UserRoleObject,
  BillingDetails,
  BillingAddress
} from '@/types/models';
import { 
  OverheadProfile 
} from '@/lib/utils/typeAdapters';

// Adapt Quote types
export const adaptQuote = (dbQuote: any): Quote => {
  return {
    id: dbQuote.id,
    name: dbQuote.name || '',
    title: dbQuote.title || '',
    client_name: dbQuote.client_name || '',
    clientName: dbQuote.client_name || '',
    site_name: dbQuote.site_name || '',
    siteName: dbQuote.site_name || '',
    status: dbQuote.status || 'draft',
    overhead_percentage: dbQuote.overhead_percentage || 0,
    overheadPercentage: dbQuote.overhead_percentage || 0,
    margin_percentage: dbQuote.margin_percentage || 0,
    marginPercentage: dbQuote.margin_percentage || 0,
    total_price: dbQuote.total_price || 0,
    totalPrice: dbQuote.total_price || 0,
    labor_cost: dbQuote.labor_cost || 0,
    laborCost: dbQuote.labor_cost || 0,
    supplies_cost: dbQuote.supplies_cost || 0,
    suppliesCost: dbQuote.supplies_cost || 0,
    equipment_cost: dbQuote.equipment_cost || 0,
    equipmentCost: dbQuote.equipment_cost || 0,
    subcontractor_cost: dbQuote.subcontractor_cost || 0,
    subcontractorCost: dbQuote.subcontractor_cost || 0,
    created_at: dbQuote.created_at || new Date().toISOString(),
    createdAt: dbQuote.created_at || new Date().toISOString(),
    updated_at: dbQuote.updated_at || new Date().toISOString(),
    updatedAt: dbQuote.updated_at || new Date().toISOString(),
    quote_number: dbQuote.quote_number || '',
    quoteNumber: dbQuote.quote_number || '',
    valid_until: dbQuote.valid_until || '',
    validUntil: dbQuote.valid_until || '',
    client_id: dbQuote.client_id || '',
    clientId: dbQuote.client_id || '',
    site_id: dbQuote.site_id || '',
    siteId: dbQuote.site_id || '',
    start_date: dbQuote.start_date || '',
    startDate: dbQuote.start_date || '',
    end_date: dbQuote.end_date || '',
    endDate: dbQuote.end_date || '',
    expiry_date: dbQuote.expiry_date || '',
    expiryDate: dbQuote.expiry_date || '',
    contract_length: dbQuote.contract_length || 0,
    contractLength: dbQuote.contract_length || 0,
    contract_length_unit: dbQuote.contract_length_unit || 'months',
    contractLengthUnit: dbQuote.contract_length_unit || 'months',
    overhead_cost: dbQuote.overhead_cost || 0,
    overheadCost: dbQuote.overhead_cost || 0,
    total_cost: dbQuote.total_cost || 0,
    totalCost: dbQuote.total_cost || 0,
    margin_amount: dbQuote.margin_amount || 0,
    marginAmount: dbQuote.margin_amount || 0,
    overhead_profile: dbQuote.overhead_profile || '',
    overheadProfile: dbQuote.overhead_profile || '',
    user_id: dbQuote.user_id || '',
    userId: dbQuote.user_id || '',
    created_by: dbQuote.created_by || '',
    createdBy: dbQuote.created_by || '',
    notes: dbQuote.notes || '',
    frequency: dbQuote.frequency || '',
    scope: dbQuote.scope || '',
    terms: dbQuote.terms || ''
  };
};

export const adaptQuoteToDb = (quote: Partial<Quote>): any => {
  return {
    ...(quote.name !== undefined && { name: quote.name }),
    ...(quote.client_name !== undefined && { client_name: quote.client_name || quote.clientName }),
    ...(quote.site_name !== undefined && { site_name: quote.site_name || quote.siteName }),
    ...(quote.status !== undefined && { status: quote.status }),
    ...(quote.overhead_percentage !== undefined && { overhead_percentage: quote.overhead_percentage || quote.overheadPercentage }),
    ...(quote.margin_percentage !== undefined && { margin_percentage: quote.margin_percentage || quote.marginPercentage }),
    ...(quote.total_price !== undefined && { total_price: quote.total_price || quote.totalPrice }),
    ...(quote.labor_cost !== undefined && { labor_cost: quote.labor_cost || quote.laborCost }),
    ...(quote.supplies_cost !== undefined && { supplies_cost: quote.supplies_cost || quote.suppliesCost }),
    ...(quote.equipment_cost !== undefined && { equipment_cost: quote.equipment_cost || quote.equipmentCost }),
    ...(quote.subcontractor_cost !== undefined && { subcontractor_cost: quote.subcontractor_cost || quote.subcontractorCost }),
    ...(quote.notes !== undefined && { notes: quote.notes }),
    ...(quote.created_by !== undefined && { created_by: quote.created_by || quote.createdBy }),
    ...(quote.user_id !== undefined && { user_id: quote.user_id || quote.userId }),
    ...(quote.overhead_profile !== undefined && { overhead_profile: quote.overhead_profile || quote.overheadProfile }),
    ...(quote.start_date !== undefined && { start_date: quote.start_date || quote.startDate }),
    ...(quote.end_date !== undefined && { end_date: quote.end_date || quote.endDate }),
    ...(quote.expiry_date !== undefined && { expiry_date: quote.expiry_date || quote.expiryDate }),
    ...(quote.contract_length !== undefined && { contract_length: quote.contract_length || quote.contractLength }),
    ...(quote.contract_length_unit !== undefined && { contract_length_unit: quote.contract_length_unit || quote.contractLengthUnit }),
    ...(quote.quote_number !== undefined && { quote_number: quote.quote_number || quote.quoteNumber }),
    ...(quote.valid_until !== undefined && { valid_until: quote.valid_until || quote.validUntil }),
    ...(quote.client_id !== undefined && { client_id: quote.client_id || quote.clientId }),
    ...(quote.site_id !== undefined && { site_id: quote.site_id || quote.siteId }),
    ...(quote.overhead_cost !== undefined && { overhead_cost: quote.overhead_cost || quote.overheadCost }),
    ...(quote.total_cost !== undefined && { total_cost: quote.total_cost || quote.totalCost }),
    ...(quote.margin_amount !== undefined && { margin_amount: quote.margin_amount || quote.marginAmount }),
  };
};

// For API conversions
export const adaptQuoteToApi = adaptQuoteToDb;

// Quote shift adapters
export const adaptQuoteShiftToDb = (shift: QuoteShift | FrontendQuoteShift): any => {
  if (!shift) return null;
  
  return {
    id: shift.id,
    quote_id: 'quote_id' in shift ? shift.quote_id : shift.quoteId,
    day: shift.day,
    start_time: 'start_time' in shift ? shift.start_time : shift.startTime,
    end_time: 'end_time' in shift ? shift.end_time : shift.endTime,
    break_duration: 'break_duration' in shift ? shift.break_duration : shift.breakDuration,
    number_of_cleaners: 'number_of_cleaners' in shift ? shift.number_of_cleaners : shift.numberOfCleaners,
    employment_type: 'employment_type' in shift ? shift.employment_type : shift.employmentType,
    level: shift.level,
    allowances: shift.allowances,
    estimated_cost: 'estimated_cost' in shift ? shift.estimated_cost : shift.estimatedCost,
    location: shift.location,
    notes: shift.notes || ''
  };
};

export const adaptQuoteShiftFromDb = (dbShift: any): QuoteShift => {
  return {
    id: dbShift.id,
    quote_id: dbShift.quote_id,
    quoteId: dbShift.quote_id,
    day: dbShift.day,
    start_time: dbShift.start_time,
    startTime: dbShift.start_time, 
    end_time: dbShift.end_time,
    endTime: dbShift.end_time,
    break_duration: dbShift.break_duration,
    breakDuration: dbShift.break_duration,
    number_of_cleaners: dbShift.number_of_cleaners,
    numberOfCleaners: dbShift.number_of_cleaners,
    employment_type: dbShift.employment_type,
    employmentType: dbShift.employment_type,
    level: dbShift.level,
    allowances: dbShift.allowances || [],
    estimated_cost: dbShift.estimated_cost,
    estimatedCost: dbShift.estimated_cost,
    location: dbShift.location || '',
    notes: dbShift.notes || ''
  };
};

// Transform employment type 
export const adaptEmploymentType = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'casual': return 'casual';
    case 'permanent': return 'permanent';
    case 'part-time': return 'part-time';
    case 'contractor': return 'contractor';
    default: return 'casual';
  }
};

// Contract adapters
export const adaptContractToDb = (contract: Contract): any => {
  return {
    id: contract.id,
    site_id: contract.site_id || contract.siteId,
    client_id: contract.client_id || contract.clientId,
    status: contract.status,
    contract_number: contract.contract_number || contract.contractNumber,
    start_date: contract.start_date || contract.startDate,
    end_date: contract.end_date || contract.endDate,
    value: contract.value,
    monthly_revenue: contract.monthly_revenue || contract.monthlyRevenue,
    contract_details: contract.contract_details || contract.contractDetails,
    auto_renewal: contract.auto_renewal || contract.autoRenewal,
    renewal_period: contract.renewal_period || contract.renewalPeriod,
    renewal_notice_days: contract.renewal_notice_days || contract.renewalNoticeDays,
    termination_period: contract.termination_period || contract.terminationPeriod,
    billing_cycle: contract.billing_cycle || contract.billingCycle,
    service_frequency: contract.service_frequency || contract.serviceFrequency,
    service_delivery_method: contract.service_delivery_method || contract.serviceDeliveryMethod,
    is_primary: contract.is_primary || contract.isPrimary,
    created_at: contract.created_at || contract.createdAt,
    updated_at: contract.updated_at || contract.updatedAt,
    contract_type: contract.contract_type || contract.contractType || contract.type
  };
};

export const adaptContractFromDb = (dbContract: any): Contract => {
  return {
    id: dbContract.id,
    site_id: dbContract.site_id,
    siteId: dbContract.site_id,
    client_id: dbContract.client_id,
    clientId: dbContract.client_id,
    siteName: dbContract.site_name,
    clientName: dbContract.client_name,
    contract_number: dbContract.contract_number,
    contractNumber: dbContract.contract_number,
    start_date: dbContract.start_date,
    startDate: dbContract.start_date,
    end_date: dbContract.end_date,
    endDate: dbContract.end_date,
    value: dbContract.value,
    monthly_revenue: dbContract.monthly_revenue,
    monthlyRevenue: dbContract.monthly_revenue,
    contract_details: dbContract.contract_details,
    contractDetails: dbContract.contract_details,
    auto_renewal: dbContract.auto_renewal,
    autoRenewal: dbContract.auto_renewal,
    renewal_period: dbContract.renewal_period,
    renewalPeriod: dbContract.renewal_period,
    renewal_notice_days: dbContract.renewal_notice_days,
    renewalNoticeDays: dbContract.renewal_notice_days,
    termination_period: dbContract.termination_period,
    terminationPeriod: dbContract.termination_period,
    billing_cycle: dbContract.billing_cycle,
    billingCycle: dbContract.billing_cycle,
    service_frequency: dbContract.service_frequency,
    serviceFrequency: dbContract.service_frequency,
    service_delivery_method: dbContract.service_delivery_method,
    serviceDeliveryMethod: dbContract.service_delivery_method,
    is_primary: dbContract.is_primary,
    isPrimary: dbContract.is_primary,
    created_at: dbContract.created_at,
    createdAt: dbContract.created_at,
    updated_at: dbContract.updated_at,
    updatedAt: dbContract.updated_at,
    contract_type: dbContract.contract_type,
    contractType: dbContract.contract_type,
    type: dbContract.contract_type,
    status: dbContract.status
  };
};

// Overhead profile adapters
export const adaptOverheadProfile = (dbProfile: any): OverheadProfile => {
  return {
    id: dbProfile.id,
    name: dbProfile.name,
    description: dbProfile.description,
    laborPercentage: dbProfile.labor_percentage,
    createdAt: dbProfile.created_at,
    updatedAt: dbProfile.updated_at,
    userId: dbProfile.user_id
  };
};

// User adapters
export const dbUserToSystemUser = (dbUser: any): any => {
  return {
    id: dbUser.id,
    email: dbUser.email,
    first_name: dbUser.first_name,
    firstName: dbUser.first_name,
    last_name: dbUser.last_name,
    lastName: dbUser.last_name,
    full_name: dbUser.full_name,
    fullName: dbUser.full_name,
    avatar_url: dbUser.avatar_url,
    avatarUrl: dbUser.avatar_url,
    title: dbUser.title,
    phone: dbUser.phone,
    custom_id: dbUser.custom_id,
    customId: dbUser.custom_id,
    notes: dbUser.notes,
    territories: dbUser.territories || [],
    status: dbUser.status || 'active',
    role_id: dbUser.role_id,
    role: dbUser.role,
    created_at: dbUser.created_at,
    createdAt: dbUser.created_at,
    updated_at: dbUser.updated_at,
    updatedAt: dbUser.updated_at,
    last_login: dbUser.last_login,
    lastLogin: dbUser.last_login,
    daily_summary: dbUser.daily_summary
  };
};

export const adaptUserProfile = (userData: UserProfileWithRole): any => {
  return {
    id: userData.id,
    email: userData.email,
    full_name: userData.full_name,
    first_name: userData.first_name,
    last_name: userData.last_name,
    avatar_url: userData.avatar_url,
    role_id: userData.role_id,
    created_at: userData.created_at,
    updated_at: userData.updated_at,
    title: userData.title,
    phone: userData.phone,
    status: userData.status,
    last_login: userData.last_login,
    custom_id: userData.custom_id,
    notes: userData.notes,
    territories: userData.territories
  };
};

// Address utility
export const stringToAddressObject = (addressString: string): BillingAddress => {
  // Basic parsing logic - would be enhanced in a real app
  return {
    line1: addressString || '',
    city: '',
    state: '',
    postcode: '',
    postalCode: ''
  };
};
