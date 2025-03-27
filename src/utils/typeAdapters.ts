
import { BillingDetails, BillingAddress, BillingLine } from '@/components/sites/forms/types/billingTypes';
import { Quote } from '@/types/models';

// Default BillingAddress for when it's missing or incomplete
const defaultBillingAddress: BillingAddress = {
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'Australia'
};

// Adapter for BillingDetails to ensure it has all required properties
export function adaptBillingDetails(data: any = {}): BillingDetails {
  return {
    billingAddress: data.billingAddress || defaultBillingAddress,
    useClientInfo: !!data.useClientInfo,
    billingMethod: data.billingMethod || 'fixed',
    paymentTerms: data.paymentTerms || '30days',
    billingEmail: data.billingEmail || '',
    contacts: Array.isArray(data.contacts) ? data.contacts : [],
    billingLines: Array.isArray(data.billingLines) ? data.billingLines : [],
    // Copy any other properties that might exist
    ...data,
  };
}

// Adapter for JobSpecifications
export function adaptJobSpecifications(data: any = {}): any {
  return {
    daysPerWeek: data.daysPerWeek || 5,
    hoursPerDay: data.hoursPerDay || 8,
    directEmployees: data.directEmployees || 0,
    notes: data.notes || '',
    cleaningFrequency: data.cleaningFrequency || 'daily',
    customFrequency: data.customFrequency || '',
    serviceDays: data.serviceDays || '',
    serviceTime: data.serviceTime || '',
    estimatedHours: data.estimatedHours || '',
    equipmentRequired: data.equipmentRequired || '',
    scopeNotes: data.scopeNotes || '',
    weeklyContractorCost: data.weeklyContractorCost || 0,
    monthlyContractorCost: data.monthlyContractorCost || 0,
    annualContractorCost: data.annualContractorCost || 0,
    // Copy any other properties
    ...data
  };
}

// Adapter for Periodicals
export function adaptPeriodicals(data: any = {}): any {
  return {
    items: Array.isArray(data.items) ? data.items : [],
    notes: data.notes || '',
    // Copy any other properties
    ...data
  };
}

// Adapter for Quote to handle camelCase/snake_case conversion
export function adaptQuote(quote: any = {}): Quote {
  const result: Partial<Quote> = {
    id: quote.id || '',
    name: quote.name || '',
    clientName: quote.clientName || quote.client_name || '',
    siteName: quote.siteName || quote.site_name || '',
    status: quote.status || 'draft',
    totalPrice: quote.totalPrice || quote.total_price || 0,
    laborCost: quote.laborCost || quote.labor_cost || 0,
    overheadPercentage: quote.overheadPercentage || quote.overhead_percentage || 15,
    marginPercentage: quote.marginPercentage || quote.margin_percentage || 20,
    subcontractorCost: quote.subcontractorCost || quote.subcontractor_cost || 0,
    createdAt: quote.createdAt || quote.created_at || new Date().toISOString(),
    updatedAt: quote.updatedAt || quote.updated_at || new Date().toISOString(),
    
    // Additional properties
    title: quote.title || '',
    description: quote.description || '',
    
    // Handle costs with various naming patterns
    suppliesCost: quote.suppliesCost || quote.supplies_cost || 0,
    equipmentCost: quote.equipmentCost || quote.equipment_cost || 0,
    
    // Handle other properties
    quoteNumber: quote.quoteNumber || quote.quote_number || '',
    validUntil: quote.validUntil || quote.valid_until || '',
    
    // Client and site IDs
    clientId: quote.clientId || quote.client_id || '',
    siteId: quote.siteId || quote.site_id || '',
    
    // Cost calculations
    overheadCost: quote.overheadCost || quote.overhead_cost || 0,
    totalCost: quote.totalCost || quote.total_cost || 0,
    marginAmount: quote.marginAmount || quote.margin_amount || 0,
    
    // Dates
    startDate: quote.startDate || quote.start_date || '',
    endDate: quote.endDate || quote.end_date || '',
    expiryDate: quote.expiryDate || quote.expiry_date || '',
    
    // Notes and contract details
    notes: quote.notes || '',
    contractLength: quote.contractLength || quote.contract_length || 0,
    contractLengthUnit: quote.contractLengthUnit || quote.contract_length_unit || 'months',
  };
  
  return result as Quote;
}

// Function to adapt day values between different formats 
// (needed for ShiftScheduler component)
export function adaptDay(day: string): string {
  const dayMap: Record<string, string> = {
    // Map various day formats to a common format
    'weekday': 'monday', // Default mapping for "weekday"
    'monday': 'monday',
    'tuesday': 'tuesday',
    'wednesday': 'wednesday',
    'thursday': 'thursday',
    'friday': 'friday',
    'saturday': 'saturday',
    'sunday': 'sunday',
    'mon': 'monday',
    'tue': 'tuesday',
    'wed': 'wednesday',
    'thu': 'thursday',
    'fri': 'friday',
    'sat': 'saturday',
    'sun': 'sunday',
  };
  
  return dayMap[day.toLowerCase()] || day;
}

// Create default billing details
export function getDefaultBillingDetails(): BillingDetails {
  return {
    billingAddress: defaultBillingAddress,
    useClientInfo: false,
    billingMethod: 'fixed',
    paymentTerms: '30days',
    billingEmail: '',
    contacts: [],
    billingLines: []
  };
}

// Ensure that billing details exist on an object
export function ensureBillingDetails(data: any): any {
  if (!data.billingDetails) {
    return {
      ...data,
      billingDetails: getDefaultBillingDetails()
    };
  }
  return data;
}

// Create a contract term adapter to handle different shapes
export function adaptContractTerm(term: any): any {
  // Return a contract term with all required fields
  return {
    id: term.id || crypto.randomUUID(),
    title: term.title || term.name || '',
    content: term.content || term.description || '',
    startDate: term.startDate || '',
    endDate: term.endDate || '',
    renewalTerms: term.renewalTerms || '',
    terminationPeriod: term.terminationPeriod || '',
    autoRenew: term.autoRenew || false,
    // Include any additional fields
    ...term
  };
}
