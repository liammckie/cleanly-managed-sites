
import { SiteStatus } from '@/components/sites/forms/types/siteFormData';

export interface SiteFormData {
  id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  clientId: string;
  clientName?: string;
  representative: string;
  contactDetails: {
    email?: string;
    phone?: string;
    notes?: string;
  };
  status: SiteStatus;
  customId?: string;
  monthlyRevenue?: number;
  annualRevenue?: number;
  monthlyCost?: number;
  contractDetails?: {
    contractNumber?: string;
    startDate?: string;
    endDate?: string;
    terminationPeriod?: string;
    renewalTerms?: string;
    autoRenewal?: boolean;
    noticePeriod?: string;
    contractType?: string;
    renewalType?: string;
    value?: number;
    status?: string;
  };
  jobSpecifications?: {
    daysPerWeek?: number;
    hoursPerDay?: number;
    directEmployees?: number;
    notes?: string;
  };
  securityDetails?: {
    accessCode?: string;
    alarmCode?: string;
    keyLocation?: string;
    outOfHoursAccess?: boolean;
  };
  replenishables?: {
    stock?: any[];
    contactDetails?: string;
  };
  periodicals?: Record<string, {
    frequency: string;
    lastCompleted?: string;
    nextScheduled?: string;
    charges?: number;
  }>;
  contacts?: {
    id?: string;
    name: string;
    email?: string;
    phone?: string;
    role: string;
    department?: string;
    notes?: string;
    entity_id?: string;
    entity_type?: string;
    is_primary?: boolean;
  }[];
}

// Update SiteStatus to include "on-hold"
export type SiteStatus = 'active' | 'inactive' | 'pending' | 'on-hold';
