
import { BillingDetails } from '@/components/sites/forms/types/billingTypes';

export interface DbOverheadProfile {
  id: string;
  name: string;
  labor_percentage: number;
  description?: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface OverheadProfile {
  id: string;
  name: string;
  laborPercentage: number;
  description?: string;
}

export function adaptOverheadProfile(dbProfile: DbOverheadProfile): OverheadProfile {
  return {
    id: dbProfile.id,
    name: dbProfile.name,
    laborPercentage: dbProfile.labor_percentage,
    description: dbProfile.description
  };
}

export function adaptEmploymentType(type: string): string {
  switch (type) {
    case 'casual':
      return 'Casual';
    case 'part_time':
      return 'Part Time';
    case 'full_time':
      return 'Full Time';
    default:
      return type;
  }
}

export function adaptBillingDetails(details: any): BillingDetails {
  if (!details) {
    return {
      billingLines: [],
      useClientInfo: false,
      billingMethod: '',
      paymentTerms: '',
      billingEmail: '',
      billingAddress: {
        street: '',
        city: '',
        state: '',
        postcode: '',
        country: 'Australia'
      }
    };
  }

  // Ensure all required fields exist
  return {
    billingLines: details.billingLines || [],
    useClientInfo: details.useClientInfo || false,
    billingMethod: details.billingMethod || '',
    paymentTerms: details.paymentTerms || '',
    billingEmail: details.billingEmail || '',
    billingAddress: details.billingAddress || {
      street: '',
      city: '',
      state: '',
      postcode: '',
      country: 'Australia'
    },
    serviceDeliveryType: (details.serviceDeliveryType as 'direct' | 'contractor') || 'direct',
    weeklyBudget: details.weeklyBudget,
    annualDirectCost: details.annualDirectCost,
    annualContractorCost: details.annualContractorCost,
    weeklyContractorCost: details.weeklyContractorCost,
    monthlyContractorCost: details.monthlyContractorCost,
    contractorCostFrequency: details.contractorCostFrequency,
    contractorInvoiceFrequency: details.contractorInvoiceFrequency,
    serviceType: details.serviceType,
    deliveryMethod: details.deliveryMethod,
    rate: details.rate,
    xeroContactId: details.xeroContactId,
    // Include all other fields from the original object
    ...details
  };
}

export function adaptQuote(dbQuote: any): any {
  if (!dbQuote) return null;
  
  return {
    id: dbQuote.id,
    name: dbQuote.name,
    clientName: dbQuote.client_name || dbQuote.clientName,
    siteName: dbQuote.site_name || dbQuote.siteName,
    status: dbQuote.status,
    laborCost: dbQuote.labor_cost || dbQuote.laborCost || 0,
    overheadCost: dbQuote.overhead_cost || dbQuote.overheadCost || 0,
    subcontractorCost: dbQuote.subcontractor_cost || dbQuote.subcontractorCost || 0,
    totalCost: dbQuote.total_cost || dbQuote.totalCost || 0,
    marginAmount: dbQuote.margin_amount || dbQuote.marginAmount || 0,
    totalPrice: dbQuote.total_price || dbQuote.totalPrice || 0,
    marginPercentage: dbQuote.margin_percentage || dbQuote.marginPercentage || 20,
    overheadPercentage: dbQuote.overhead_percentage || dbQuote.overheadPercentage || 15,
    startDate: dbQuote.start_date || dbQuote.startDate,
    endDate: dbQuote.end_date || dbQuote.endDate,
    expiryDate: dbQuote.expiry_date || dbQuote.expiryDate,
    createdAt: dbQuote.created_at || dbQuote.createdAt,
    updatedAt: dbQuote.updated_at || dbQuote.updatedAt,
    ...dbQuote
  };
}

export function adaptQuoteToFrontend(dbQuote: any): any {
  return adaptQuote(dbQuote);
}

export function adaptQuoteToApi(frontendQuote: any): any {
  if (!frontendQuote) return null;
  
  return {
    id: frontendQuote.id,
    name: frontendQuote.name,
    client_name: frontendQuote.clientName,
    site_name: frontendQuote.siteName,
    status: frontendQuote.status,
    labor_cost: frontendQuote.laborCost,
    overhead_cost: frontendQuote.overheadCost,
    subcontractor_cost: frontendQuote.subcontractorCost,
    total_cost: frontendQuote.totalCost,
    margin_amount: frontendQuote.marginAmount,
    total_price: frontendQuote.totalPrice,
    margin_percentage: frontendQuote.marginPercentage,
    overhead_percentage: frontendQuote.overheadPercentage,
    start_date: frontendQuote.startDate,
    end_date: frontendQuote.endDate,
    expiry_date: frontendQuote.expiryDate,
    ...frontendQuote
  };
}
