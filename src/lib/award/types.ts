
export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;
export type EmploymentType = 'full_time' | 'part_time' | 'casual';
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'public_holiday';

export interface RateDefinition {
  id: string;
  percentage: number;
  description: string;
  dayType?: string;
  startTime?: string;
  endTime?: string;
  multiplier?: number;
}

export interface EmployeeLevelRates {
  base: number;
  fullTime: number;
  partTime: number;
  casual: number;
  loading?: number;
}

export interface AwardSettings {
  minimumShiftHours: number;
  casualMinimumHours: number;
  dailyMaxHours: number;
  weeklyMaxHours: number;
  breakThresholdHours: number;
  allowances: Record<string, number>;
  usePenalties?: boolean;
}

export interface AwardData {
  levels: Record<EmployeeLevel, number>;
  penalties: RateDefinition[];
  rates?: Record<EmployeeLevel, EmployeeLevelRates>;
  settings: AwardSettings;
}

export interface CostCalculationResult {
  baseRate: number;
  totalHours: number;
  laborCost: number;
  overheadCost: number;
  totalCost: number;
  margin: number;
  price: number;
  totalCostBeforeMargin: number;
  items: any[];
  
  // Additional required properties
  laborHours: number;
  breakdownByDay: any;
  byTimeOfDay: any;
  profitMargin: number;
  finalPrice: number;
}

export interface QuoteShift {
  id: string;
  quoteId?: string;
  day: Day;
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: EmploymentType;
  level: EmployeeLevel;
  allowances: string[];
  estimatedCost: number;
  location?: string;
  notes?: string;
}

export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'yearly' | 'once';

export interface QuoteSubcontractor {
  id: string;
  quoteId?: string;
  name: string;
  description: string;
  cost: number;
  frequency: Frequency;
  email?: string;
  phone?: string;
  service?: string;
  notes?: string;
}

export interface Quote {
  id: string;
  name: string;
  client_name: string;
  site_name?: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'pending';
  overhead_percentage: number;
  margin_percentage: number;
  total_price: number;
  labor_cost: number;
  supplies_cost?: number;
  equipment_cost?: number;
  subcontractor_cost: number;
  created_at: string;
  updated_at: string;
  title?: string;
  description?: string;
  clientContact?: string;
  clientEmail?: string;
  clientPhone?: string;
  siteAddress?: string;
  frequency?: string;
  scope?: string;
  terms?: string;
  notes: string;
  overheadCost: number;
  totalCost: number;
  marginAmount: number;
  startDate?: string;
  endDate?: string;
  expiryDate?: string;
  contractLength?: number;
  contractLengthUnit?: 'days' | 'weeks' | 'months' | 'years';
  clientId?: string;
  siteId?: string;
  shifts?: QuoteShift[];
  subcontractors?: QuoteSubcontractor[];
}
