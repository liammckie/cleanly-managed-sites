
export type ServiceOption = 
  | 'cleaning' 
  | 'window_cleaning' 
  | 'carpet_cleaning' 
  | 'floor_maintenance' 
  | 'pressure_washing' 
  | 'waste_management' 
  | 'gardening' 
  | 'pest_control'
  | 'security'
  | 'hvac' 
  | 'electrical'
  | 'plumbing'
  | 'general_maintenance'
  | 'other';

export type Subcontractor = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  services?: ServiceOption[];
  customServices?: string;
  monthlyCost?: number;
  isFlatRate?: boolean;
}

export const SERVICE_OPTIONS: { value: ServiceOption; label: string }[] = [
  { value: 'cleaning', label: 'General Cleaning' },
  { value: 'window_cleaning', label: 'Window Cleaning' },
  { value: 'carpet_cleaning', label: 'Carpet Cleaning' },
  { value: 'floor_maintenance', label: 'Floor Maintenance' },
  { value: 'pressure_washing', label: 'Pressure Washing' },
  { value: 'waste_management', label: 'Waste Management' },
  { value: 'gardening', label: 'Gardening / Landscaping' },
  { value: 'pest_control', label: 'Pest Control' },
  { value: 'security', label: 'Security Services' },
  { value: 'hvac', label: 'HVAC Maintenance' },
  { value: 'electrical', label: 'Electrical Services' },
  { value: 'plumbing', label: 'Plumbing Services' },
  { value: 'general_maintenance', label: 'General Maintenance' },
  { value: 'other', label: 'Other (Custom)' }
];
