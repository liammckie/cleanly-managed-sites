
export interface ServiceOption {
  value: string;
  label: string;
  selected?: boolean;
}

export interface Subcontractor {
  id?: string;
  businessName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  services?: string[];
  customServices?: string;
  monthlyCost?: number;
  isFlatRate?: boolean;
}

// Define service options
export const serviceOptions: ServiceOption[] = [
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'gardening', label: 'Gardening' },
  { value: 'security', label: 'Security' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'waste', label: 'Waste Management' },
  { value: 'pest', label: 'Pest Control' },
  { value: 'window', label: 'Window Cleaning' },
  { value: 'carpet', label: 'Carpet Cleaning' },
  { value: 'hvac', label: 'HVAC Services' },
  { value: 'electrical', label: 'Electrical Services' },
  { value: 'plumbing', label: 'Plumbing Services' },
  { value: 'landscaping', label: 'Landscaping' }
];

// Add an alias for backward compatibility
export const SERVICE_OPTIONS = serviceOptions;
