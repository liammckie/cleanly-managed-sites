
import { BillingDetails, BillingLine } from "@/components/sites/forms/types/billingTypes";
import { UserRole } from "@/types/models";
import { SystemUser } from "@/lib/types/users";

// Adapts permissions from string[] to Record<string, boolean>
export function adaptPermissions(permissions: string[] | Record<string, boolean>): Record<string, boolean> {
  if (Array.isArray(permissions)) {
    return permissions.reduce((acc, permission) => {
      acc[permission] = true;
      return acc;
    }, {} as Record<string, boolean>);
  }
  return permissions;
}

// Converts Record<string, boolean> to string[]
export function permissionsToArray(permissions: Record<string, boolean>): string[] {
  return Object.entries(permissions)
    .filter(([_, value]) => value)
    .map(([key]) => key);
}

// Adapt a user role from API to frontend format
export function adaptUserRole(role: any): UserRole {
  return {
    id: role.id,
    name: role.name,
    description: role.description || '',
    permissions: adaptPermissions(role.permissions || []),
    user_count: role.user_count || 0,
    created_at: role.created_at,
    updated_at: role.updated_at
  };
}

// Adapt a user role from frontend to API format
export function adaptUserRoleToApi(role: UserRole): any {
  return {
    id: role.id,
    name: role.name,
    description: role.description || '',
    permissions: permissionsToArray(role.permissions || {}),
  };
}

// Adapt billing details
export function adaptBillingDetails(billingDetails: any = {}): BillingDetails {
  return {
    billingLines: billingDetails.billingLines || [],
    useClientInfo: billingDetails.useClientInfo || false,
    billingMethod: billingDetails.billingMethod || '',
    paymentTerms: billingDetails.paymentTerms || '',
    billingEmail: billingDetails.billingEmail || '',
    billingAddress: billingDetails.billingAddress || {
      street: '',
      city: '',
      state: '',
      postcode: '',
      country: 'Australia'
    },
    serviceDeliveryType: billingDetails.serviceDeliveryType || 'direct',
    weeklyBudget: billingDetails.weeklyBudget || 0,
    annualDirectCost: billingDetails.annualDirectCost || 0,
    annualContractorCost: billingDetails.annualContractorCost || 0,
    contractorCostFrequency: billingDetails.contractorCostFrequency || '',
    weeklyContractorCost: billingDetails.weeklyContractorCost || 0,
    monthlyContractorCost: billingDetails.monthlyContractorCost || 0,
    contractorInvoiceFrequency: billingDetails.contractorInvoiceFrequency || '',
    serviceType: billingDetails.serviceType || '',
    deliveryMethod: billingDetails.deliveryMethod || '',
    rate: billingDetails.rate || '',
    xeroContactId: billingDetails.xeroContactId || '',
    contacts: billingDetails.contacts || [],
    contactId: billingDetails.contactId || '',
    
    // Include all optional properties
    totalWeeklyAmount: billingDetails.totalWeeklyAmount,
    totalMonthlyAmount: billingDetails.totalMonthlyAmount,
    totalAnnualAmount: billingDetails.totalAnnualAmount,
    billingCity: billingDetails.billingCity,
    billingState: billingDetails.billingState,
    billingPostcode: billingDetails.billingPostcode,
    billingFrequency: billingDetails.billingFrequency,
    invoiceFrequency: billingDetails.invoiceFrequency,
    invoiceDay: billingDetails.invoiceDay,
    invoiceMethod: billingDetails.invoiceMethod,
    invoiceEmail: billingDetails.invoiceEmail,
    invoiceAddressLine1: billingDetails.invoiceAddressLine1,
    invoiceAddressLine2: billingDetails.invoiceAddressLine2,
    invoiceCity: billingDetails.invoiceCity,
    invoiceState: billingDetails.invoiceState,
    invoicePostalCode: billingDetails.invoicePostalCode,
    weeklyRevenue: billingDetails.weeklyRevenue,
    monthlyRevenue: billingDetails.monthlyRevenue,
    accountNumber: billingDetails.accountNumber,
    purchaseOrderRequired: billingDetails.purchaseOrderRequired,
    purchaseOrderNumber: billingDetails.purchaseOrderNumber
  };
}

// Add other missing adapter functions
export function adaptAddress(address: any) {
  return {
    street: address?.street || '',
    city: address?.city || '',
    state: address?.state || '',
    postcode: address?.postcode || '',
    country: address?.country || 'Australia'
  };
}

export function adaptEmploymentType(type: string) {
  return type || 'permanent';
}

export function adaptQuote(quote: any) {
  return {
    ...quote,
    // Add necessary transformations if needed
  };
}

export function adaptQuoteToFrontend(quote: any) {
  return {
    ...quote,
    // Add necessary transformations if needed
  };
}

export function adaptQuoteToApi(quote: any) {
  return {
    ...quote,
    // Add necessary transformations if needed
  };
}
