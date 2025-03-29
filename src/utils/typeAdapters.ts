
// Add missing adapter functions
import { Contract } from '@/types/models';

export function adaptEmploymentType(type: string): string {
  const typeMap: Record<string, string> = {
    'full-time': 'Full Time',
    'part-time': 'Part Time',
    'casual': 'Casual',
    'contractor': 'Contractor',
    'subcontractor': 'Subcontractor'
  };
  
  return typeMap[type] || type;
}

export function stringToAddressObject(addressString: string): { line1: string, line2?: string } {
  if (!addressString) return { line1: '' };
  
  const parts = addressString.split(',');
  if (parts.length === 1) {
    return { line1: parts[0].trim() };
  }
  
  return {
    line1: parts[0].trim(),
    line2: parts.slice(1).join(',').trim()
  };
}

export function adaptQuoteToFrontend(quote: any): any {
  return {
    ...quote,
    clientName: quote.client_name,
    siteName: quote.site_name,
    overheadPercentage: quote.overhead_percentage,
    marginPercentage: quote.margin_percentage,
    totalPrice: quote.total_price,
    laborCost: quote.labor_cost,
    subcontractorCost: quote.subcontractor_cost,
    quoteNumber: quote.quote_number,
    validUntil: quote.valid_until,
    createdAt: quote.created_at,
    updatedAt: quote.updated_at,
    startDate: quote.start_date,
    endDate: quote.end_date,
    expiryDate: quote.expiry_date,
    contractLength: quote.contract_length,
    contractLengthUnit: quote.contract_length_unit,
    overheadCost: quote.overhead_cost,
    totalCost: quote.total_cost,
    marginAmount: quote.margin_amount,
  };
}

export function adaptQuoteToDb(quote: any): any {
  return {
    ...quote,
    client_name: quote.clientName || quote.client_name,
    site_name: quote.siteName || quote.site_name,
    overhead_percentage: quote.overheadPercentage || quote.overhead_percentage,
    margin_percentage: quote.marginPercentage || quote.margin_percentage,
    total_price: quote.totalPrice || quote.total_price,
    labor_cost: quote.laborCost || quote.labor_cost,
    subcontractor_cost: quote.subcontractorCost || quote.subcontractor_cost,
    quote_number: quote.quoteNumber || quote.quote_number,
    valid_until: quote.validUntil || quote.valid_until,
    created_at: quote.createdAt || quote.created_at,
    updated_at: quote.updatedAt || quote.updated_at,
    start_date: quote.startDate || quote.start_date,
    end_date: quote.endDate || quote.end_date,
    expiry_date: quote.expiryDate || quote.expiry_date,
    contract_length: quote.contractLength || quote.contract_length,
    contract_length_unit: quote.contractLengthUnit || quote.contract_length_unit,
    overhead_cost: quote.overheadCost || quote.overhead_cost,
    total_cost: quote.totalCost || quote.total_cost,
    margin_amount: quote.marginAmount || quote.margin_amount,
  };
}

export function adaptUserRole(role: any): any {
  if (!role) return null;
  
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    permissions: role.permissions || {}
  };
}

export function adaptUserRoleToApi(role: any): any {
  if (!role) return null;
  
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    permissions: typeof role.permissions === 'string' 
      ? JSON.parse(role.permissions) 
      : role.permissions || {}
  };
}

export function adaptUserProfile(user: any): any {
  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    firstName: user.first_name,
    lastName: user.last_name,
    avatarUrl: user.avatar_url,
    title: user.title,
    phone: user.phone,
    status: user.status,
    roleId: user.role_id,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    customId: user.custom_id,
    notes: user.notes,
    lastLogin: user.last_login
  };
}
