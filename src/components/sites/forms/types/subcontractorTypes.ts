
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
}

// Utility functions for backward compatibility
export const getBusinessName = (subcontractor: Subcontractor): string => {
  return subcontractor.business_name || subcontractor.businessName || subcontractor.name || '';
};

export const getContactName = (subcontractor: Subcontractor): string => {
  return subcontractor.contact_name || subcontractor.contactName || '';
};
