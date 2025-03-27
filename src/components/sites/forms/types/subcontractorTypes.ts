
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
