import { 
  UserDTO, 
  UserRoleDTO, 
  BillingDetailsDTO, 
  ContractDetailsDTO,
  SiteDTO,
  QuoteDTO,
  OverheadProfileDTO
} from '@/types/dto';

// User Adapters
export function adaptUser(dbUser: any): UserDTO {
  return {
    id: dbUser.id,
    email: dbUser.email,
    full_name: dbUser.full_name,
    first_name: dbUser.first_name,
    last_name: dbUser.last_name,
    avatar_url: dbUser.avatar_url,
    title: dbUser.title,
    phone: dbUser.phone,
    custom_id: dbUser.custom_id,
    notes: dbUser.notes,
    territories: dbUser.territories,
    status: (dbUser.status as "active" | "pending" | "inactive") || "active",
    role_id: dbUser.role_id,
    created_at: dbUser.created_at,
    updated_at: dbUser.updated_at,
    last_login: dbUser.last_login,
    daily_summary: dbUser.daily_summary
  };
}

export function adaptUserToDb(user: Partial<UserDTO>): any {
  return {
    ...user,
    // Map any camelCase to snake_case if needed
  };
}

// User Role Adapters
export function adaptUserRole(dbRole: any): UserRoleDTO {
  // Convert permissions array to Record<string, boolean>
  let permissionsRecord: Record<string, boolean> = {};
  
  if (Array.isArray(dbRole.permissions)) {
    dbRole.permissions.forEach((perm: string) => {
      permissionsRecord[perm] = true;
    });
  } else if (typeof dbRole.permissions === 'object') {
    permissionsRecord = dbRole.permissions;
  }
  
  return {
    id: dbRole.id,
    name: dbRole.name,
    description: dbRole.description,
    permissions: permissionsRecord,
    created_at: dbRole.created_at,
    updated_at: dbRole.updated_at,
    user_count: dbRole.user_count
  };
}

export function adaptUserRoleToDb(role: UserRoleDTO): any {
  // Convert permissions Record<string, boolean> to array
  const permissionsArray = Object.entries(role.permissions)
    .filter(([_, value]) => value === true)
    .map(([key, _]) => key);
  
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    permissions: permissionsArray,
    created_at: role.created_at,
    updated_at: role.updated_at
  };
}

// Contract Details Adapters
export function adaptContractDetails(dbContract: any): ContractDetailsDTO {
  if (!dbContract) return {};
  
  return {
    id: dbContract.id,
    contractNumber: dbContract.contract_number,
    startDate: dbContract.start_date,
    endDate: dbContract.end_date,
    autoRenewal: dbContract.auto_renew,
    contractLength: dbContract.contract_length,
    contractLengthUnit: dbContract.contract_length_unit,
    contractType: dbContract.contract_type,
    renewalPeriod: dbContract.renewal_period,
    renewalNoticeDays: dbContract.renewal_notice,
    noticeUnit: dbContract.notice_unit,
    serviceFrequency: dbContract.service_frequency,
    serviceDeliveryMethod: dbContract.service_delivery_method,
    renewalTerms: dbContract.renewal_terms,
    terminationPeriod: dbContract.termination_period,
    value: dbContract.value,
    billingCycle: dbContract.billing_cycle,
    notes: dbContract.notes,
  };
}

export function adaptContractDetailsToDb(contractDetails: ContractDetailsDTO): any {
  return {
    id: contractDetails.id,
    contract_number: contractDetails.contractNumber,
    start_date: contractDetails.startDate,
    end_date: contractDetails.endDate,
    auto_renew: contractDetails.autoRenewal,
    contract_length: contractDetails.contractLength,
    contract_length_unit: contractDetails.contractLengthUnit,
    contract_type: contractDetails.contractType,
    renewal_period: contractDetails.renewalPeriod,
    renewal_notice: contractDetails.renewalNoticeDays,
    notice_unit: contractDetails.noticeUnit,
    service_frequency: contractDetails.serviceFrequency,
    service_delivery_method: contractDetails.serviceDeliveryMethod,
    renewal_terms: contractDetails.renewalTerms,
    termination_period: contractDetails.terminationPeriod,
    value: contractDetails.value,
    billing_cycle: contractDetails.billingCycle,
    notes: contractDetails.notes,
  };
}

// Billing Details Adapters
export function adaptBillingDetails(dbBilling: any): BillingDetailsDTO {
  if (!dbBilling) {
    return {
      useClientInfo: false,
      billingMethod: '',
      paymentTerms: '',
      billingEmail: '',
      billingLines: []
    };
  }
  
  return {
    billingAddress: dbBilling.billingAddress || {
      street: '',
      city: '',
      state: '',
      postcode: '',
      country: 'Australia'
    },
    useClientInfo: dbBilling.useClientInfo || false,
    billingMethod: dbBilling.billingMethod || '',
    paymentTerms: dbBilling.paymentTerms || '',
    billingEmail: dbBilling.billingEmail || '',
    billingLines: dbBilling.billingLines || [],
    serviceType: dbBilling.serviceType || '',
    deliveryMethod: dbBilling.deliveryMethod || '',
    serviceDeliveryType: dbBilling.serviceDeliveryType || 'direct',
    contractorCostFrequency: dbBilling.contractorCostFrequency || '',
    weeklyContractorCost: dbBilling.weeklyContractorCost || 0,
    monthlyContractorCost: dbBilling.monthlyContractorCost || 0,
    annualContractorCost: dbBilling.annualContractorCost || 0,
    contractorInvoiceFrequency: dbBilling.contractorInvoiceFrequency || '',
    weeklyBudget: dbBilling.weeklyBudget || 0,
    rate: dbBilling.rate || '',
    xeroContactId: dbBilling.xeroContactId || ''
  };
}

export function adaptBillingDetailsToDb(billingDetails: BillingDetailsDTO): any {
  // Return as-is for storing in jsonb column
  return billingDetails;
}

// Quote Adapters
export function adaptQuote(dbQuote: any): QuoteDTO {
  return {
    id: dbQuote.id,
    name: dbQuote.name,
    title: dbQuote.title || dbQuote.name,
    description: dbQuote.description,
    clientName: dbQuote.client_name,
    siteName: dbQuote.site_name,
    status: dbQuote.status,
    laborCost: dbQuote.labor_cost || 0,
    overheadPercentage: dbQuote.overhead_percentage || 0,
    marginPercentage: dbQuote.margin_percentage || 0,
    marginAmount: dbQuote.margin_amount,
    overheadCost: dbQuote.overhead_cost,
    totalCost: dbQuote.total_cost,
    subcontractorCost: dbQuote.subcontractor_cost || 0,
    totalPrice: dbQuote.total_price || 0,
    startDate: dbQuote.start_date,
    endDate: dbQuote.end_date,
    expiryDate: dbQuote.expiry_date,
    contractLength: dbQuote.contract_length,
    contractLengthUnit: dbQuote.contract_length_unit,
    quoteNumber: dbQuote.quote_number,
    validUntil: dbQuote.valid_until,
    notes: dbQuote.notes,
    createdAt: dbQuote.created_at,
    updatedAt: dbQuote.updated_at
  };
}

export function adaptQuoteToApi(quote: QuoteDTO): any {
  return {
    id: quote.id,
    name: quote.name,
    description: quote.description,
    client_name: quote.clientName,
    site_name: quote.siteName,
    status: quote.status,
    labor_cost: quote.laborCost,
    overhead_percentage: quote.overheadPercentage,
    margin_percentage: quote.marginPercentage,
    margin_amount: quote.marginAmount,
    overhead_cost: quote.overheadCost,
    total_cost: quote.totalCost,
    subcontractor_cost: quote.subcontractorCost,
    total_price: quote.totalPrice,
    start_date: quote.startDate,
    end_date: quote.endDate,
    expiry_date: quote.expiryDate,
    contract_length: quote.contractLength,
    contract_length_unit: quote.contractLengthUnit,
    quote_number: quote.quoteNumber,
    valid_until: quote.validUntil,
    notes: quote.notes
  };
}

export function adaptQuoteToFrontend(quote: any): QuoteDTO {
  return adaptQuote(quote);
}

// Overhead Profile Adapters
export function adaptOverheadProfile(dbProfile: any): OverheadProfileDTO {
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

export function adaptOverheadProfileToDb(profile: OverheadProfileDTO): any {
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

// Other adapters
export function adaptEmploymentType(type: string): string {
  const typeMap: Record<string, string> = {
    'full_time': 'Full-Time',
    'part_time': 'Part-Time',
    'casual': 'Casual'
  };
  
  return typeMap[type] || type;
}

// Site adapter
export function adaptSite(dbSite: any): SiteDTO {
  return {
    id: dbSite.id,
    name: dbSite.name,
    address: dbSite.address || '',
    city: dbSite.city || '',
    state: dbSite.state || '',
    postcode: dbSite.postcode || '',
    country: dbSite.country || 'Australia',
    client_id: dbSite.client_id,
    client_name: dbSite.client_name,
    status: dbSite.status || 'active',
    representative: dbSite.representative,
    contract_details: dbSite.contract_details ? adaptContractDetails(dbSite.contract_details) : undefined,
    billing_details: dbSite.billing_details ? adaptBillingDetails(dbSite.billing_details) : undefined,
    job_specifications: dbSite.job_specifications,
    security_details: dbSite.security_details,
    monthly_revenue: dbSite.monthly_revenue,
    weekly_revenue: dbSite.weekly_revenue,
    annual_revenue: dbSite.annual_revenue,
    monthly_cost: dbSite.monthly_cost,
    created_at: dbSite.created_at,
    updated_at: dbSite.updated_at,
    user_id: dbSite.user_id,
    custom_id: dbSite.custom_id,
    notes: dbSite.notes,
    email: dbSite.email,
    phone: dbSite.phone
  };
}

export function adaptSiteToDb(site: SiteDTO): any {
  return {
    id: site.id,
    name: site.name,
    address: site.address,
    city: site.city,
    state: site.state,
    postcode: site.postcode,
    country: site.country,
    client_id: site.client_id,
    status: site.status,
    representative: site.representative,
    contract_details: site.contract_details,
    billing_details: site.billing_details,
    job_specifications: site.job_specifications,
    security_details: site.security_details,
    monthly_revenue: site.monthly_revenue,
    weekly_revenue: site.weekly_revenue, 
    annual_revenue: site.annual_revenue,
    monthly_cost: site.monthly_cost,
    custom_id: site.custom_id,
    notes: site.notes,
    email: site.email,
    phone: site.phone
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
