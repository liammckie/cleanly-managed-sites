
export interface Subcontractor {
  id?: string;
  name: string;
  business_name?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  services?: string[];
  service?: string;
  notes?: string;
  is_flat_rate?: boolean;
  monthly_cost?: number;
  isFlatRate?: boolean;
  monthlyCost?: number;
  customServices?: string;
}
