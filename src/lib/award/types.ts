
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'public_holiday';
export type EmploymentType = 'casual' | 'part_time' | 'full_time';
export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;
export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'yearly' | 'once' | 'one-time' | 'accepted';
export type PayCondition = 'standard' | 'saturday' | 'sunday' | 'public_holiday' | 'overtime' | 'earlyMorning' | 'evening';

export interface QuoteShift {
  id: string;
  quoteId: string;
  day: Day;
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: EmploymentType;
  level: EmployeeLevel;
  allowances: string[];
  estimatedCost: number;
  location: string;
  notes: string;
}

export interface Subcontractor {
  id: string;
  name: string;
  business_name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  frequency?: Frequency;
  cost?: number;
  monthly_cost?: number;
  service?: string;
  services?: string[];
  description?: string;
  notes?: string;
}

export interface Quote {
  id: string;
  name: string;
  client_name: string;
  site_name?: string;
  status: QuoteStatus;
  overhead_percentage: number;
  margin_percentage: number;
  total_price: number;
  labor_cost: number;
  supplies_cost?: number;
  equipment_cost?: number;
  subcontractor_cost: number;
  created_at: string;
  updated_at: string;
  shifts?: QuoteShift[];
  subcontractors?: Subcontractor[];
}

export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'pending' | 'accepted';

export interface RateDefinition {
  id: string;
  dayType: Day | 'all';
  startTime?: string;
  endTime?: string;
  multiplier: number;
  percentage: number;
  description: string;
}

export interface JobCostCalculationInput {
  shifts: QuoteShift[];
  subcontractors: Subcontractor[];
  overheadPercentage: number;
  marginPercentage: number;
}

export interface CostCalculationResult {
  baseRate: number;
  totalHours: number;
  laborHours: number;
  laborCost: number;
  overheadCost: number;
  totalCost: number;
  totalCostBeforeMargin: number;
  margin: number;
  profitMargin: number;
  price: number;
  finalPrice: number;
  items: any[];
  breakdownByDay: Record<string, number>;
  byTimeOfDay: Record<string, number>;
}

export interface AwardSettings {
  allowances: Record<string, number>;
  usePenalties: boolean;
  minimumShiftHours: number;
  casualMinimumHours: number;
  dailyMaxHours: number;
  weeklyMaxHours: number;
  breakThresholdHours: number;
  baseRateMultiplier?: number;
  overheadPercentageDefault?: number;
  marginPercentageDefault?: number;
}

export interface AwardData {
  settings: AwardSettings;
  baseRates: Record<EmployeeLevel, number>;
  casualLoading: number;
  employeeLevelRates?: Record<EmployeeLevel, number>;
  conditionRates?: Record<PayCondition, RateDefinition>;
  rates?: RateDefinition[];
}

export interface EmployeeLevelRates {
  level1: number;
  level2: number;
  level3: number;
  level4: number;
  level5: number;
  loading?: number;
}
