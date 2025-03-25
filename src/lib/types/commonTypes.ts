
// Common type definitions to ensure consistency across the application

// Site form related types
export type SiteStatus = 'active' | 'pending' | 'inactive' | 'lost' | 'on_hold';

// Billing related types
export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'one-time';

// Contract types
export type ContractType = 'cleaning' | 'maintenance' | 'security' | 'other';

// Quote types
export type QuoteShift = {
  id: string;
  quoteId: string;
  day: string;
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: string;
  level: number;
  allowances: string[];
  estimatedCost: number;
  location?: string;
  notes?: string;
};

export type Subcontractor = {
  id: string;
  quoteId: string;
  name: string;
  description?: string;
  cost: number;
  frequency: string;
  email?: string;
  phone?: string;
  services?: string[];
  service?: string;
  notes?: string;
  rate?: number;
};

// PayCondition type for award calculations
export type PayCondition = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'public_holiday';

// Award calculation types
export interface RateDefinition {
  percentage: number;
  flatRate?: number;
  description: string;
}

export interface AwardSettings {
  useModernAward: boolean;
  usePenalties: boolean;
  includeAllowances: boolean;
  awardVersion: string;
  customRates: boolean;
  baseRateMultiplier: number;
  overheadPercentageDefault: number;
  marginPercentageDefault: number;
  lastUpdated: string;
  baseRates: Record<string, number>;
  loadingRates: Record<string, number>;
  allowances: Record<string, number>;
}

export interface JobCostBreakdown {
  directLabor: number;
  contractors: number;
  supplies: number;
  equipment: number;
  overhead: number;
  margin: number;
  total: number;
  totalCostBeforeMargin?: number;
}

// For DatePicker props compatibility
export interface DatePickerCustomProps {
  id?: string;
  value: Date;
  onChange: (date: any) => void;
}
