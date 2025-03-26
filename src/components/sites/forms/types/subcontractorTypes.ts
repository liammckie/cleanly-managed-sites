
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

export const serviceOptions = [
  { id: 'cleaning', label: 'Cleaning' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'security', label: 'Security' },
  { id: 'landscaping', label: 'Landscaping' },
  { id: 'pest_control', label: 'Pest Control' },
  { id: 'waste_management', label: 'Waste Management' },
  { id: 'hvac', label: 'HVAC' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'plumbing', label: 'Plumbing' },
  { id: 'other', label: 'Other' }
];

// Helper functions for working with subcontractors
export const getBusinessName = (subcontractor: Subcontractor): string => {
  return subcontractor.business_name || subcontractor.name || 'Unnamed Subcontractor';
};

export const getContactName = (subcontractor: Subcontractor): string => {
  return subcontractor.contact_name || 'No contact name';
};
