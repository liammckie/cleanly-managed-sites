
import { 
  Quote, 
  QuoteShift, 
  QuoteSubcontractor, 
  Contract, 
  UserProfile, 
  UserRole,
  BillingLine
} from '@/types/models';

// Adapt from database (snake_case) to frontend (camelCase)
export function adaptQuote(dbQuote: Quote): Quote {
  return {
    ...dbQuote,
    clientName: dbQuote.client_name,
    siteName: dbQuote.site_name,
    overheadPercentage: dbQuote.overhead_percentage,
    marginPercentage: dbQuote.margin_percentage,
    totalPrice: dbQuote.total_price,
    laborCost: dbQuote.labor_cost,
    subcontractorCost: dbQuote.subcontractor_cost,
    quoteNumber: dbQuote.quote_number,
    validUntil: dbQuote.valid_until,
    createdAt: dbQuote.created_at,
    updatedAt: dbQuote.updated_at,
    startDate: dbQuote.start_date,
    endDate: dbQuote.end_date,
    expiryDate: dbQuote.expiry_date,
    contractLength: dbQuote.contract_length,
    contractLengthUnit: dbQuote.contract_length_unit,
    overheadCost: dbQuote.overhead_cost,
    totalCost: dbQuote.total_cost,
    marginAmount: dbQuote.margin_amount,
    // Adapt shifts and subcontractors if they exist
    shifts: dbQuote.shifts?.map(adaptQuoteShift),
    subcontractors: dbQuote.subcontractors?.map(adaptQuoteSubcontractor)
  };
}

// Adapt from frontend (camelCase) to database (snake_case)
export function adaptQuoteToDb(frontendQuote: Quote): Quote {
  return {
    ...frontendQuote,
    client_name: frontendQuote.clientName || frontendQuote.client_name,
    site_name: frontendQuote.siteName || frontendQuote.site_name,
    overhead_percentage: frontendQuote.overheadPercentage || frontendQuote.overhead_percentage,
    margin_percentage: frontendQuote.marginPercentage || frontendQuote.margin_percentage,
    total_price: frontendQuote.totalPrice || frontendQuote.total_price,
    labor_cost: frontendQuote.laborCost || frontendQuote.labor_cost,
    subcontractor_cost: frontendQuote.subcontractorCost || frontendQuote.subcontractor_cost,
    quote_number: frontendQuote.quoteNumber || frontendQuote.quote_number,
    valid_until: frontendQuote.validUntil || frontendQuote.valid_until,
    created_at: frontendQuote.createdAt || frontendQuote.created_at,
    updated_at: frontendQuote.updatedAt || frontendQuote.updated_at,
    start_date: frontendQuote.startDate || frontendQuote.start_date,
    end_date: frontendQuote.endDate || frontendQuote.end_date,
    expiry_date: frontendQuote.expiryDate || frontendQuote.expiry_date,
    contract_length: frontendQuote.contractLength || frontendQuote.contract_length,
    contract_length_unit: frontendQuote.contractLengthUnit || frontendQuote.contract_length_unit,
    overhead_cost: frontendQuote.overheadCost || frontendQuote.overhead_cost,
    total_cost: frontendQuote.totalCost || frontendQuote.total_cost,
    margin_amount: frontendQuote.marginAmount || frontendQuote.margin_amount,
    // Adapt shifts and subcontractors if they exist
    shifts: frontendQuote.shifts?.map(adaptQuoteShiftToDb),
    subcontractors: frontendQuote.subcontractors?.map(adaptQuoteSubcontractorToDb)
  };
}

// Adapt QuoteShift from database to frontend
export function adaptQuoteShift(dbShift: QuoteShift): QuoteShift {
  return {
    ...dbShift,
    quoteId: dbShift.quote_id,
    startTime: dbShift.start_time,
    endTime: dbShift.end_time,
    breakDuration: dbShift.break_duration,
    numberOfCleaners: dbShift.number_of_cleaners,
    employmentType: dbShift.employment_type,
    estimatedCost: dbShift.estimated_cost
  };
}

// Adapt QuoteShift from frontend to database
export function adaptQuoteShiftToDb(frontendShift: QuoteShift): QuoteShift {
  return {
    ...frontendShift,
    quote_id: frontendShift.quoteId || frontendShift.quote_id,
    start_time: frontendShift.startTime || frontendShift.start_time,
    end_time: frontendShift.endTime || frontendShift.end_time,
    break_duration: frontendShift.breakDuration || frontendShift.break_duration,
    number_of_cleaners: frontendShift.numberOfCleaners || frontendShift.number_of_cleaners,
    employment_type: frontendShift.employmentType || frontendShift.employment_type,
    estimated_cost: frontendShift.estimatedCost || frontendShift.estimated_cost
  };
}

// Adapt QuoteSubcontractor from database to frontend
export function adaptQuoteSubcontractor(dbSubcontractor: QuoteSubcontractor): QuoteSubcontractor {
  return {
    ...dbSubcontractor,
    quoteId: dbSubcontractor.quote_id
  };
}

// Adapt QuoteSubcontractor from frontend to database
export function adaptQuoteSubcontractorToDb(frontendSubcontractor: QuoteSubcontractor): QuoteSubcontractor {
  return {
    ...frontendSubcontractor,
    quote_id: frontendSubcontractor.quoteId || frontendSubcontractor.quote_id
  };
}

// Adapt Contract from database to frontend
export function adaptContract(dbContract: Contract): Contract {
  return {
    ...dbContract,
    siteId: dbContract.site_id,
    clientId: dbContract.client_id,
    contractNumber: dbContract.contract_number,
    startDate: dbContract.start_date,
    endDate: dbContract.end_date,
    autoRenewal: dbContract.auto_renewal,
    renewalPeriod: dbContract.renewal_period,
    renewalNoticeDays: dbContract.renewal_notice_days,
    terminationPeriod: dbContract.termination_period,
    billingCycle: dbContract.billing_cycle,
    serviceFrequency: dbContract.service_frequency,
    serviceDeliveryMethod: dbContract.service_delivery_method,
    createdAt: dbContract.created_at,
    updatedAt: dbContract.updated_at
  };
}

// Adapt Contract from frontend to database
export function adaptContractToDb(frontendContract: Contract): Contract {
  return {
    ...frontendContract,
    site_id: frontendContract.siteId || frontendContract.site_id,
    client_id: frontendContract.clientId || frontendContract.client_id,
    contract_number: frontendContract.contractNumber || frontendContract.contract_number,
    start_date: frontendContract.startDate || frontendContract.start_date,
    end_date: frontendContract.endDate || frontendContract.end_date,
    auto_renewal: frontendContract.autoRenewal || frontendContract.auto_renewal,
    renewal_period: frontendContract.renewalPeriod || frontendContract.renewal_period,
    renewal_notice_days: frontendContract.renewalNoticeDays || frontendContract.renewal_notice_days,
    termination_period: frontendContract.terminationPeriod || frontendContract.termination_period,
    billing_cycle: frontendContract.billingCycle || frontendContract.billing_cycle,
    service_frequency: frontendContract.serviceFrequency || frontendContract.service_frequency,
    service_delivery_method: frontendContract.serviceDeliveryMethod || frontendContract.service_delivery_method,
    created_at: frontendContract.createdAt || frontendContract.created_at,
    updated_at: frontendContract.updatedAt || frontendContract.updated_at
  };
}

// Adapt UserProfile from database to frontend
export function adaptUserProfile(dbProfile: UserProfile): UserProfile {
  return {
    ...dbProfile,
    fullName: dbProfile.full_name,
    roleId: dbProfile.role_id,
    createdAt: dbProfile.created_at,
    updatedAt: dbProfile.updated_at
  };
}

// Adapt overhead profile interface
export function adaptOverheadProfile(profile: any) {
  return {
    id: profile.id,
    name: profile.name,
    laborPercentage: profile.labor_percentage
  };
}

// Adapt BillingLine from database to frontend
export function adaptBillingLine(dbBillingLine: BillingLine): BillingLine {
  return {
    ...dbBillingLine,
    siteId: dbBillingLine.site_id,
    isRecurring: dbBillingLine.is_recurring,
    onHold: dbBillingLine.on_hold,
    weeklyAmount: dbBillingLine.weekly_amount,
    monthlyAmount: dbBillingLine.monthly_amount,
    annualAmount: dbBillingLine.annual_amount
  };
}

// Fix for the DatePicker component
export interface DatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}
