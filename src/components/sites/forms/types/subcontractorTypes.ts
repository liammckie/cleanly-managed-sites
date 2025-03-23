
export type ServiceOption = string;

export const SERVICE_OPTIONS = [
  { value: 'general_cleaning', label: 'General Cleaning' },
  { value: 'window_cleaning', label: 'Window Cleaning' },
  { value: 'carpet_cleaning', label: 'Carpet Cleaning' },
  { value: 'floor_polishing', label: 'Floor Polishing' },
  { value: 'pressure_washing', label: 'Pressure Washing' },
  { value: 'waste_management', label: 'Waste Management' },
  { value: 'gardening', label: 'Gardening' },
  { value: 'pest_control', label: 'Pest Control' }
];

export interface Subcontractor {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  services?: ServiceOption[];
  customServices?: string;
  monthlyCost?: number;
  isFlatRate?: boolean;
}
