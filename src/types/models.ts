
import type { Json, QuoteStatus, ContractStatus, EmploymentType, UserStatus } from './common';

// Contract Activity – using camelCase for app usage.
export interface ContractActivity {
  id: string;
  contractId: string;    // mapped from "contract_id"
  action: string;        // added missing property
  timestamp: string;     // added missing property
  userName: string;      // added missing property
  details: string;       // added missing property
}

// Contract type – note the camelCase keys.
export interface Contract {
  id: string;
  siteId: string;        // from "site_id"
  clientId: string;      // from "client_id"
  contractNumber: string; // from "contract_number"
  startDate: string;     // from "start_date"
  endDate: string;       // from "end_date"
  monthlyRevenue?: number; // from "monthly_revenue"
  contractDetails?: Json;  // from "contract_details"
  autoRenewal?: boolean;   // from "auto_renewal"
  renewalPeriod?: number;  // from "renewal_period"
  renewalNoticeDays?: number; // from "renewal_notice_days"
  terminationPeriod?: number; // from "termination_period"
  billingCycle?: string;   // from "billing_cycle"
  serviceFrequency?: string; // from "service_frequency"
  serviceDeliveryMethod?: string; // from "service_delivery_method"
  isPrimary?: boolean;     // from "is_primary"
  createdAt: string;       // from "created_at"
  updatedAt: string;       // from "updated_at"
}

// Overhead Profile types
export interface RawOverheadProfile {
  labor_percentage: number;
  // Add any other properties required by the DB
}

export interface OverheadProfile extends RawOverheadProfile {
  // Optionally, include additional camelCase keys if mapping is needed.
}

// User types – now defined in models for clarity.
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export type UserRole = 'admin' | 'manager' | 'user'; // update as needed

// Define ContactRecord for Contacts.tsx
export interface ContactRecord {
  id: string;
  name: string;
  email: string;
  // Add other fields as needed
}
