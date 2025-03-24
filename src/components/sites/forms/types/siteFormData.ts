
import { SiteStatus } from '../../SiteCard';
import { ContactRecord } from '@/lib/types';
import { 
  Periodicals, 
  JobSpecifications, 
  Replenishables, 
  SecurityDetails, 
  Subcontractor, 
  ContractDetails, 
  BillingDetails, 
  AdHocWorkAuthorization
} from './index';
import { SiteContact } from './contactTypes';

// Main form data type
export interface SiteFormData {
  // Basic information
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  status: SiteStatus;
  representative: string;
  phone: string;
  email: string;
  clientId: string;
  customId?: string; // Add custom ID field
  
  // Optional financial fields
  monthlyCost?: number;
  monthlyRevenue?: number;
  weeklyRevenue?: number;
  annualRevenue?: number;
  
  // Client data integration flag
  useClientInfo: boolean;
  
  // Extended information (stored as JSON)
  securityDetails: SecurityDetails;
  jobSpecifications: JobSpecifications;
  periodicals: Periodicals;
  replenishables: Replenishables;
  contractDetails: ContractDetails;
  billingDetails: BillingDetails;
  adHocWorkAuthorization: AdHocWorkAuthorization;
  
  // Related entities
  contacts: SiteContact[];
  subcontractors: Subcontractor[];
  
  // Additional contracts
  additionalContracts?: ContractDetails[];
}
