
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
}

// Service options for subcontractors
export const serviceOptions = [
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'security', label: 'Security' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'pest_control', label: 'Pest Control' },
  { value: 'waste_management', label: 'Waste Management' },
  { value: 'other', label: 'Other' }
];

// Utility functions for subcontractor data
export function getBusinessName(subcontractor?: Subcontractor): string {
  return subcontractor?.business_name || 'N/A';
}

export function getContactName(subcontractor?: Subcontractor): string {
  return subcontractor?.contact_name || 'N/A';
}
