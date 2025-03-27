import { BillingAddress, BillingDetails } from "@/components/sites/forms/types/billingTypes";
import { ContractDetails } from "@/components/sites/forms/types/contractTypes";
import { Day, EmploymentType, Frequency, QuoteStatus } from "@/types/common";
import { Quote, QuoteShift, QuoteSubcontractor } from "@/types/models";
import { DbOverheadProfile, OverheadProfile } from "@/lib/utils/typeAdapters";

// Day adapters
export const adaptDay = (day: string): Day => {
  const normalizedDay = day.toLowerCase().trim();
  
  if (
    normalizedDay === 'monday' ||
    normalizedDay === 'tuesday' ||
    normalizedDay === 'wednesday' ||
    normalizedDay === 'thursday' ||
    normalizedDay === 'friday' ||
    normalizedDay === 'saturday' ||
    normalizedDay === 'sunday' ||
    normalizedDay === 'weekday' ||
    normalizedDay === 'public_holiday'
  ) {
    return normalizedDay as Day;
  }
  
  // Default fallback
  return 'monday';
};

// Employment type adapters
export const adaptEmploymentType = (type: string): EmploymentType => {
  const normalizedType = type.toLowerCase().trim().replace('_', '-');
  
  if (normalizedType === 'casual' || normalizedType === 'part-time' || normalizedType === 'full-time') {
    return normalizedType as EmploymentType;
  }
  
  // Default fallback
  return 'casual';
};

// Quote adapters
export const adaptQuote = (data: any): Quote => {
  if (!data) return {} as Quote;
  
  return {
    id: data.id,
    name: data.name || '',
    clientName: data.client_name || '',
    status: (data.status || 'draft') as QuoteStatus,
    totalPrice: data.total_price || 0,
    laborCost: data.labor_cost || 0,
    overheadPercentage: data.overhead_percentage || 15,
    marginPercentage: data.margin_percentage || 20,
    subcontractorCost: data.subcontractor_cost || 0,
    createdAt: data.created_at || '',
    updatedAt: data.updated_at || '',
    
    // Optional fields with their aliases
    title: data.title,
    description: data.description,
    suppliesCost: data.supplies_cost || 0,
    equipmentCost: data.equipment_cost || 0,
    quoteNumber: data.quote_number || '',
    validUntil: data.valid_until || '',
    clientId: data.client_id,
    siteId: data.site_id,
    overheadCost: data.overhead_cost || 0,
    totalCost: data.total_cost || 0,
    marginAmount: data.margin_amount || 0,
    startDate: data.start_date || '',
    endDate: data.end_date || '',
    expiryDate: data.expiry_date || '',
    contractLength: data.contract_length,
    contractLengthUnit: data.contract_length_unit,
    
    // Include shifts and subcontractors if available
    shifts: data.shifts ? data.shifts.map(adaptShift) : [],
    subcontractors: data.subcontractors ? data.subcontractors.map(adaptSubcontractor) : []
  };
};

export const adaptShift = (data: any): QuoteShift => {
  return {
    id: data.id,
    quote_id: data.quote_id,
    day: adaptDay(data.day),
    start_time: data.start_time,
    end_time: data.end_time,
    break_duration: data.break_duration || 0,
    number_of_cleaners: data.number_of_cleaners || 1,
    employment_type: adaptEmploymentType(data.employment_type),
    level: data.level || 1,
    allowances: data.allowances || [],
    estimated_cost: data.estimated_cost || 0,
    location: data.location || '',
    notes: data.notes || '',
    
    // Add camelCase aliases
    quoteId: data.quote_id,
    startTime: data.start_time,
    endTime: data.end_time,
    breakDuration: data.break_duration || 0,
    numberOfCleaners: data.number_of_cleaners || 1,
    employmentType: adaptEmploymentType(data.employment_type),
    estimatedCost: data.estimated_cost || 0
  };
};

export const adaptSubcontractor = (data: any): QuoteSubcontractor => {
  return {
    id: data.id,
    quote_id: data.quote_id,
    name: data.name || '',
    description: data.description || '',
    cost: data.cost || 0,
    frequency: (data.frequency || 'monthly') as Frequency,
    email: data.email || '',
    phone: data.phone || '',
    notes: data.notes || '',
    
    // Additional fields used in the UI
    service: data.service || '',
    services: data.services || [],
    customServices: data.custom_services || '',
    monthlyCost: data.monthly_cost || 0,
    isFlatRate: data.is_flat_rate !== false,
    
    // Camel case alias
    quoteId: data.quote_id
  };
};

export const adaptModelsToQuotes = (models: any[]): Quote[] => {
  return models.map(adaptQuote);
};

export const adaptJobSpecifications = (data: any): any => {
  if (!data) return {};
  
  return {
    daysPerWeek: data.daysPerWeek || data.days_per_week || 5,
    hoursPerDay: data.hoursPerDay || data.hours_per_day || 8,
    directEmployees: data.directEmployees || data.direct_employees || 0,
    notes: data.notes || '',
    cleaningFrequency: data.cleaningFrequency || data.cleaning_frequency || 'daily',
    customFrequency: data.customFrequency || data.custom_frequency || '',
    serviceDays: data.serviceDays || data.service_days || '',
    serviceTime: data.serviceTime || data.service_time || '',
    estimatedHours: data.estimatedHours || data.estimated_hours || '',
    equipmentRequired: data.equipmentRequired || data.equipment_required || '',
    scopeNotes: data.scopeNotes || data.scope_notes || '',
    weeklyContractorCost: data.weeklyContractorCost || data.weekly_contractor_cost || 0,
    monthlyContractorCost: data.monthlyContractorCost || data.monthly_contractor_cost || 0,
    annualContractorCost: data.annualContractorCost || data.annual_contractor_cost || 0
  };
};

export const dbToOverheadProfile = (data: any): DbOverheadProfile => {
  return {
    id: data.id,
    name: data.name || 'Default Profile',
    description: data.description || '',
    labor_percentage: data.labor_percentage || 15,
    laborPercentage: data.labor_percentage || 15,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    user_id: data.user_id
  };
};

// Address adaptation
export const adaptAddress = (address: string | BillingAddress): BillingAddress => {
  if (typeof address === 'string') {
    return {
      street: address,
      city: '',
      state: '',
      postcode: '',
      country: ''
    };
  }
  return address || { street: '', city: '', state: '', postcode: '', country: '' };
};

// BillingDetails adaptation to ensure required fields
export const adaptBillingDetails = (details: Partial<BillingDetails> = {}): BillingDetails => {
  return {
    // Base properties with defaults
    billingAddress: adaptAddress(details.billingAddress || {}),
    useClientInfo: details.useClientInfo || false,
    billingMethod: details.billingMethod || '',
    paymentTerms: details.paymentTerms || '',
    billingEmail: details.billingEmail || '',
    contacts: details.contacts || [],
    notes: details.notes || '',
    
    // Revenue properties
    billingLines: details.billingLines || [],
    totalWeeklyAmount: details.totalWeeklyAmount || 0,
    totalMonthlyAmount: details.totalMonthlyAmount || 0,
    totalAnnualAmount: details.totalAnnualAmount || 0,
    weeklyRevenue: details.weeklyRevenue || 0,
    monthlyRevenue: details.monthlyRevenue || 0,
    
    // Invoice and address properties
    billingCity: details.billingCity || '',
    billingState: details.billingState || '',
    billingPostcode: details.billingPostcode || '',
    billingFrequency: details.billingFrequency || '',
    invoiceFrequency: details.invoiceFrequency || '',
    invoiceDay: details.invoiceDay || '',
    invoiceMethod: details.invoiceMethod || '',
    invoiceEmail: details.invoiceEmail || '',
    invoiceAddressLine1: details.invoiceAddressLine1 || '',
    invoiceAddressLine2: details.invoiceAddressLine2 || '',
    invoiceCity: details.invoiceCity || '',
    invoiceState: details.invoiceState || '',
    invoicePostalCode: details.invoicePostalCode || '',
    
    // Payment properties
    accountNumber: details.accountNumber || '',
    purchaseOrderRequired: details.purchaseOrderRequired || false,
    purchaseOrderNumber: details.purchaseOrderNumber || '',
    rate: details.rate || '',
    xeroContactId: details.xeroContactId || '',
    
    // Service delivery properties
    serviceType: details.serviceType || '',
    deliveryMethod: details.deliveryMethod || '',
    contractorCostFrequency: details.contractorCostFrequency || '',
    weeklyContractorCost: details.weeklyContractorCost || 0,
    monthlyContractorCost: details.monthlyContractorCost || 0,
    annualContractorCost: details.annualContractorCost || 0,
    contractorInvoiceFrequency: details.contractorInvoiceFrequency || '',
    serviceDeliveryType: details.serviceDeliveryType || '',
    weeklyBudget: details.weeklyBudget || 0
  };
};

// ContractDetails adaptation to ensure required fields
export const adaptContractDetails = (details: ContractDetails): ContractDetails => {
  return {
    startDate: details.startDate || '',
    endDate: details.endDate || '',
    ...details,
    // Ensure the terms array exists
    terms: details.terms || []
  };
};
