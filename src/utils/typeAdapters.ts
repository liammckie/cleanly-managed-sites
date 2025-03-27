
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

// Helper function to adapt billing details from API to frontend format
export function adaptBillingDetails(billingDetailsFromApi: any) {
  if (!billingDetailsFromApi) {
    return {
      billingAddress: {
        street: '',
        city: '',
        state: '',
        postcode: '',
        country: ''
      },
      useClientInfo: false,
      billingMethod: '',
      paymentTerms: '',
      billingEmail: '',
      contacts: [],
      billingLines: [],
      serviceType: '',
      deliveryMethod: '',
      contractorCostFrequency: 'weekly',
      weeklyContractorCost: 0,
      monthlyContractorCost: 0,
      contractorInvoiceFrequency: 'monthly',
      serviceDeliveryType: 'direct'
    };
  }

  return {
    billingAddress: billingDetailsFromApi.billingAddress || {
      street: '',
      city: '',
      state: '',
      postcode: '',
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
    billingLines: billingDetailsFromApi.billingLines || [],
    serviceType: billingDetailsFromApi.serviceType || '',
    deliveryMethod: billingDetailsFromApi.deliveryMethod || '',
    contractorCostFrequency: billingDetailsFromApi.contractorCostFrequency || 'weekly',
    weeklyContractorCost: billingDetailsFromApi.weeklyContractorCost || 0,
    monthlyContractorCost: billingDetailsFromApi.monthlyContractorCost || 0,
    annualContractorCost: billingDetailsFromApi.annualContractorCost || 0,
    contractorInvoiceFrequency: billingDetailsFromApi.contractorInvoiceFrequency || 'monthly',
    serviceDeliveryType: billingDetailsFromApi.serviceDeliveryType || 'direct',
    weeklyBudget: billingDetailsFromApi.weeklyBudget || 0,
    xeroContactId: billingDetailsFromApi.xeroContactId || null,
    rate: billingDetailsFromApi.rate || ''
  };
}

// Add missing function to adapt address (needed by useClientData)
export function adaptAddress(address: any): any {
  return {
    street: address?.street || address?.address_line1 || '',
    city: address?.city || '',
    state: address?.state || '',
    postalCode: address?.postal_code || address?.postalCode || '',
    country: address?.country || 'Australia',
  };
}

// Alias dbToOverheadProfile to adaptOverheadProfile for backwards compatibility
export const adaptOverheadProfile = dbToOverheadProfile;

// Add the missing adaptEmploymentType function
export function adaptEmploymentType(type: string) {
  const validTypes = ['fullTime', 'partTime', 'casual', 'contractor'];
  return validTypes.includes(type) ? type : 'casual';
}

// Add adaptQuote function for backward compatibility with existing code
export function adaptQuote(quote: any) {
  return quote;
}

// Add adaptQuoteToFrontend and adaptQuoteToApi functions
export function adaptQuoteToFrontend(quote: any) {
  return quote;
}

export function adaptQuoteToApi(quote: any) {
  return quote;
}
