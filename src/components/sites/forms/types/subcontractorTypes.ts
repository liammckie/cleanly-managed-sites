
export interface Subcontractor {
  id?: string;
  contractor_id?: string;
  business_name?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  services?: string[];
  customServices?: string;
  monthlyCost?: number;
  isFlatRate?: boolean;
  // Add any other properties needed
}

// Export service options for reuse
export const serviceOptions = [
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'security', label: 'Security' },
  { value: 'gardening', label: 'Gardening' },
  { value: 'lawn_care', label: 'Lawn Care' },
  { value: 'pest_control', label: 'Pest Control' },
  { value: 'window_cleaning', label: 'Window Cleaning' },
  { value: 'carpet_cleaning', label: 'Carpet Cleaning' },
  { value: 'waste_management', label: 'Waste Management' },
  { value: 'other', label: 'Other' }
];
