
export interface Subcontractor {
  id?: string;
  business_name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  services?: string[];
  monthly_cost?: number;
  is_flat_rate?: boolean;
  customServices?: string;
  notes?: string;
}

export const serviceOptions = [
  { id: 'cleaning', label: 'Cleaning' },
  { id: 'window_cleaning', label: 'Window Cleaning' },
  { id: 'carpet_cleaning', label: 'Carpet Cleaning' },
  { id: 'floor_maintenance', label: 'Floor Maintenance' },
  { id: 'pest_control', label: 'Pest Control' },
  { id: 'high_cleaning', label: 'High Cleaning' },
  { id: 'waste_management', label: 'Waste Management' },
  { id: 'other', label: 'Other' },
];

// Helper functions for accessing subcontractor properties safely
export function getBusinessName(subcontractor: Subcontractor): string {
  return subcontractor.business_name || 'Unknown Business';
}

export function getContactName(subcontractor: Subcontractor): string {
  return subcontractor.contact_name || '';
}

// Helper function to find service label by ID
export function getServiceLabel(serviceId: string): string {
  const service = serviceOptions.find(option => option.id === serviceId);
  return service ? service.label : serviceId;
}
