
import { SiteStatus } from '@/lib/types/commonTypes';

export interface SiteFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;  // Changed from postcode for consistency
  country: string;
  client_id?: string;   // Changed from clientId to match backend
  client_name?: string;
  status: SiteStatus;
  phone?: string;
  email?: string;
  representative?: string;
  customId?: string;
  primary_contact?: {
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  contacts?: {
    id?: string;
    name: string;
    email?: string;  // Made email optional to match DB schema
    phone?: string;  // Made phone optional to match DB schema
    role: string;
    isPrimary?: boolean;  // Changed from is_primary
    department?: string;
    notes?: string;
  }[];
  contract_details?: any;  // Changed from contractDetails
  useClientInfo?: boolean;
  billingDetails?: any;
  additionalContracts?: any[];
  subcontractors?: any[];
  monthlyCost?: number;
  weeklyRevenue?: number;
  monthlyRevenue?: number;
  annualRevenue?: number;
  replenishables?: {
    stock?: any[];
    supplies?: any[];
    notes?: string;
  };
  periodicals?: any;
  adHocWorkAuthorization?: any;
  securityDetails?: any;
  jobSpecifications?: any;
  // Add backward compatibility properties
  contractDetails?: any;  // Alias for contract_details
  clientId?: string;      // Alias for client_id
  postcode?: string;      // Alias for postalCode
  notes: string;
}
