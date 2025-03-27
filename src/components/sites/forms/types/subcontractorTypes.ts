
export interface Subcontractor {
  id?: string;
  business_name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  is_flat_rate?: boolean;
  monthly_cost?: number;
  services?: string[];
  customServices?: string;
  contractor_id?: string;
  name?: string; // Added for compatibility
}

// Service options for subcontractors
export const serviceOptions = [
  { value: 'cleaning', label: 'Cleaning', id: 'cleaning' },
  { value: 'maintenance', label: 'Maintenance', id: 'maintenance' },
  { value: 'security', label: 'Security', id: 'security' },
  { value: 'landscaping', label: 'Landscaping', id: 'landscaping' },
  { value: 'pest_control', label: 'Pest Control', id: 'pest_control' },
  { value: 'waste_management', label: 'Waste Management', id: 'waste_management' },
  { value: 'other', label: 'Other', id: 'other' }
];

// Utility functions for subcontractor data
export function getBusinessName(subcontractor?: Subcontractor): string {
  return subcontractor?.business_name || 'N/A';
}

export function getContactName(subcontractor?: Subcontractor): string {
  return subcontractor?.contact_name || 'N/A';
}
