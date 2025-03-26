
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
