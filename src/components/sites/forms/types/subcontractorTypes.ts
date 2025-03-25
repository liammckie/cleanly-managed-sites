
export interface Subcontractor {
  id?: string;
  businessName: string;
  contactName: string;
  email?: string;
  phone?: string;
  services?: string[];
  service?: string;
  isActive?: boolean;
  notes?: string;
  rate?: number;
  frequency?: string;
}

// Add SERVICE_OPTIONS for backward compatibility
export const SERVICE_OPTIONS = [
  { label: 'Cleaning', value: 'cleaning' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Security', value: 'security' },
  { label: 'Landscaping', value: 'landscaping' },
  { label: 'Waste Management', value: 'waste_management' },
  { label: 'Pest Control', value: 'pest_control' },
  { label: 'Other', value: 'other' }
];

// Export in camelCase for modern components
export const serviceOptions = SERVICE_OPTIONS;
