
import { EmploymentType } from '@/types/common';

export function adaptEmploymentType(type: string): EmploymentType {
  switch (type) {
    case 'full-time':
    case 'fullTime':
    case 'full_time':
      return 'full-time';
    case 'part-time':
    case 'partTime':
    case 'part_time':
      return 'part-time';
    case 'casual':
      return 'casual';
    case 'contract':
      return 'contract';
    case 'intern':
      return 'intern';
    default:
      return 'casual'; // Default fallback
  }
}

export function stringToAddressObject(address: string) {
  // Simple parsing of address string into components
  const parts = address.split(',').map(part => part.trim());
  
  if (parts.length === 0) {
    return { street: '', city: '', state: '', postcode: '' };
  }
  
  if (parts.length === 1) {
    return { street: parts[0], city: '', state: '', postcode: '' };
  }
  
  // Last part might contain state and postcode
  let state = '';
  let postcode = '';
  
  if (parts.length > 2) {
    const lastPart = parts[parts.length - 1];
    const match = lastPart.match(/([A-Z]{2,3})\s+(\d{4})/);
    
    if (match) {
      state = match[1];
      postcode = match[2];
      parts.pop(); // Remove the last part that we've extracted
    }
  }
  
  return {
    street: parts[0] || '',
    city: parts.length > 1 ? parts[1] : '',
    state,
    postcode
  };
}

// Add missing adapters referenced in error messages

export function adaptQuote(dbQuote: any): any {
  if (!dbQuote) return null;
  
  return {
    id: dbQuote.id,
    name: dbQuote.name,
    status: dbQuote.status,
    clientName: dbQuote.client_name,
    siteName: dbQuote.site_name,
    startDate: dbQuote.start_date,
    endDate: dbQuote.end_date,
    expiryDate: dbQuote.expiry_date,
    contractLength: dbQuote.contract_length,
    contractLengthUnit: dbQuote.contract_length_unit,
    laborCost: dbQuote.labor_cost,
    overheadCost: dbQuote.overhead_cost,
    overheadPercentage: dbQuote.overhead_percentage,
    subcontractorCost: dbQuote.subcontractor_cost,
    marginPercentage: dbQuote.margin_percentage,
    marginAmount: dbQuote.margin_amount,
    totalCost: dbQuote.total_cost,
    totalPrice: dbQuote.total_price,
    createdAt: dbQuote.created_at,
    updatedAt: dbQuote.updated_at,
    notes: dbQuote.notes,
    overheadProfile: dbQuote.overhead_profile
  };
}

export function adaptQuoteToFrontend(dbQuote: any): any {
  return adaptQuote(dbQuote);
}

export function adaptQuoteToApi(frontendQuote: any): any {
  return {
    id: frontendQuote.id,
    name: frontendQuote.name,
    status: frontendQuote.status,
    client_name: frontendQuote.clientName,
    site_name: frontendQuote.siteName,
    start_date: frontendQuote.startDate,
    end_date: frontendQuote.endDate,
    expiry_date: frontendQuote.expiryDate,
    contract_length: frontendQuote.contractLength,
    contract_length_unit: frontendQuote.contractLengthUnit,
    labor_cost: frontendQuote.laborCost,
    overhead_cost: frontendQuote.overheadCost,
    overhead_percentage: frontendQuote.overheadPercentage,
    subcontractor_cost: frontendQuote.subcontractorCost,
    margin_percentage: frontendQuote.marginPercentage,
    margin_amount: frontendQuote.marginAmount,
    total_cost: frontendQuote.totalCost,
    total_price: frontendQuote.totalPrice,
    notes: frontendQuote.notes,
    overhead_profile: frontendQuote.overheadProfile
  };
}

export function adaptOverheadProfile(dbProfile: any): any {
  if (!dbProfile) return null;
  
  return {
    id: dbProfile.id,
    name: dbProfile.name,
    description: dbProfile.description,
    laborPercentage: dbProfile.labor_percentage,
    createdAt: dbProfile.created_at,
    updatedAt: dbProfile.updated_at
  };
}

export function adaptUserRole(dbRole: any): any {
  if (!dbRole) return null;
  
  return {
    id: dbRole.id,
    name: dbRole.name,
    description: dbRole.description,
    permissions: dbRole.permissions,
    createdAt: dbRole.created_at,
    updatedAt: dbRole.updated_at,
    userCount: dbRole.user_count
  };
}

export function adaptUserRoleToApi(frontendRole: any): any {
  return {
    id: frontendRole.id,
    name: frontendRole.name,
    description: frontendRole.description,
    permissions: frontendRole.permissions
  };
}
