
export interface Subcontractor {
  id?: string;
  contractor_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  business_name?: string;
  contact_name?: string;
  services?: string[];
  role?: string;
  cost?: number;
  notes?: string;
  // For backward compatibility
  businessName?: string;
  contactName?: string;
  // Additional fields needed
  customServices?: string;
  monthlyCost?: number;
  isFlatRate?: boolean;
  service?: string;
  rate?: number;
  quoteId?: string; // Required for quote subcontractors
}

// Service options for subcontractors
export const serviceOptions = [
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'security', label: 'Security' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'pest_control', label: 'Pest Control' },
  { value: 'waste_management', label: 'Waste Management' },
  { value: 'painting', label: 'Painting' },
  { value: 'carpentry', label: 'Carpentry' },
  { value: 'flooring', label: 'Flooring' },
  { value: 'other', label: 'Other' }
];

// Utility functions for backward compatibility
export const getBusinessName = (subcontractor: Subcontractor): string => {
  return subcontractor.business_name || subcontractor.businessName || subcontractor.name || '';
};

export const getContactName = (subcontractor: Subcontractor): string => {
  return subcontractor.contact_name || subcontractor.contactName || '';
};
