
import { Quote } from '@/types/models';

// Utility function to adapt API quote data to frontend format
export function adaptQuoteToFrontend(apiQuote: any): Quote {
  return {
    id: apiQuote.id || '',
    clientName: apiQuote.client_name || '',
    siteName: apiQuote.site_name || '',
    status: apiQuote.status || 'draft',
    totalPrice: apiQuote.total_price || 0,
    laborCost: apiQuote.labor_cost || 0,
    overheadPercentage: apiQuote.overhead_percentage || 15,
    marginPercentage: apiQuote.margin_percentage || 20,
    subcontractorCost: apiQuote.subcontractor_cost || 0,
    createdAt: apiQuote.created_at || new Date().toISOString(),
    updatedAt: apiQuote.updated_at || new Date().toISOString(),
    title: apiQuote.name || '',
    description: apiQuote.description || '',
    
    // Convert additional fields
    marginAmount: apiQuote.margin_amount || 0,
    overheadCost: apiQuote.overhead_cost || 0,
    totalCost: apiQuote.total_cost || 0,
    startDate: apiQuote.start_date || '',
    endDate: apiQuote.end_date || '',
    expiryDate: apiQuote.expiry_date || '',
    notes: apiQuote.notes || '',
    quoteNumber: apiQuote.quote_number || '',
    contractLength: apiQuote.contract_length || 0,
    contractLengthUnit: apiQuote.contract_length_unit || '',
    
    // Include any shifts or subcontractors
    shifts: apiQuote.shifts || [],
    subcontractors: apiQuote.subcontractors || []
  };
}

// Utility function to adapt frontend quote data to API format
export function adaptQuoteToApi(frontendQuote: Partial<Quote>): any {
  return {
    name: frontendQuote.title || '',
    client_name: frontendQuote.clientName || '',
    site_name: frontendQuote.siteName || '',
    status: frontendQuote.status || 'draft',
    total_price: frontendQuote.totalPrice || 0,
    labor_cost: frontendQuote.laborCost || 0,
    overhead_percentage: frontendQuote.overheadPercentage || 15,
    margin_percentage: frontendQuote.marginPercentage || 20,
    subcontractor_cost: frontendQuote.subcontractorCost || 0,
    
    // Convert additional fields
    margin_amount: frontendQuote.marginAmount || 0,
    overhead_cost: frontendQuote.overheadCost || 0,
    total_cost: frontendQuote.totalCost || 0,
    start_date: frontendQuote.startDate || null,
    end_date: frontendQuote.endDate || null,
    expiry_date: frontendQuote.expiryDate || null,
    notes: frontendQuote.notes || '',
    contract_length: frontendQuote.contractLength || null,
    contract_length_unit: frontendQuote.contractLengthUnit || null
  };
}

// Adapt a database overhead profile to frontend format
export function adaptOverheadProfile(dbProfile: any) {
  return {
    id: dbProfile.id,
    name: dbProfile.name,
    description: dbProfile.description || '',
    labor_percentage: dbProfile.labor_percentage,
    laborPercentage: dbProfile.labor_percentage, // Add camelCase alias
    created_at: dbProfile.created_at,
    updated_at: dbProfile.updated_at,
    user_id: dbProfile.user_id
  };
}

// Helper function to adapt billing details from API to frontend format
export function adaptBillingDetails(billingDetailsFromApi: any) {
  if (!billingDetailsFromApi) {
    return {
      billingAddress: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      },
      useClientInfo: false,
      billingMethod: '',
      paymentTerms: '',
      billingEmail: '',
      contacts: []
    };
  }

  return {
    billingAddress: billingDetailsFromApi.billingAddress || {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    useClientInfo: billingDetailsFromApi.useClientInfo || false,
    billingMethod: billingDetailsFromApi.billingMethod || '',
    paymentTerms: billingDetailsFromApi.paymentTerms || '',
    billingEmail: billingDetailsFromApi.billingEmail || '',
    contacts: billingDetailsFromApi.contacts || [],
    billingCity: billingDetailsFromApi.billingCity || '',
    billingState: billingDetailsFromApi.billingState || '',
    billingPostcode: billingDetailsFromApi.billingPostcode || '',
    billingFrequency: billingDetailsFromApi.billingFrequency || '',
    invoiceFrequency: billingDetailsFromApi.invoiceFrequency || '',
    invoiceDay: billingDetailsFromApi.invoiceDay || '',
    invoiceMethod: billingDetailsFromApi.invoiceMethod || '',
    invoiceEmail: billingDetailsFromApi.invoiceEmail || '',
    invoiceAddressLine1: billingDetailsFromApi.invoiceAddressLine1 || '',
    invoiceAddressLine2: billingDetailsFromApi.invoiceAddressLine2 || '',
    invoiceCity: billingDetailsFromApi.invoiceCity || '',
    invoiceState: billingDetailsFromApi.invoiceState || '',
    invoicePostalCode: billingDetailsFromApi.invoicePostalCode || '',
    weeklyRevenue: billingDetailsFromApi.weeklyRevenue || 0,
    monthlyRevenue: billingDetailsFromApi.monthlyRevenue || 0,
    accountNumber: billingDetailsFromApi.accountNumber || '',
    purchaseOrderRequired: billingDetailsFromApi.purchaseOrderRequired || false,
    purchaseOrderNumber: billingDetailsFromApi.purchaseOrderNumber || '',
    rate: billingDetailsFromApi.rate || '',
    serviceType: billingDetailsFromApi.serviceType || '',
    deliveryMethod: billingDetailsFromApi.deliveryMethod || '',
    contractorCostFrequency: billingDetailsFromApi.contractorCostFrequency || '',
    weeklyContractorCost: billingDetailsFromApi.weeklyContractorCost || 0,
    monthlyContractorCost: billingDetailsFromApi.monthlyContractorCost || 0,
    annualContractorCost: billingDetailsFromApi.annualContractorCost || 0,
    contractorInvoiceFrequency: billingDetailsFromApi.contractorInvoiceFrequency || '',
    serviceDeliveryType: billingDetailsFromApi.serviceDeliveryType || '',
    weeklyBudget: billingDetailsFromApi.weeklyBudget || 0,
    billingLines: billingDetailsFromApi.billingLines || [],
    xeroContactId: billingDetailsFromApi.xeroContactId || ''
  };
}
