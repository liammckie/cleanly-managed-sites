
// Award Types

export type EmploymentType = 'casual' | 'full_time' | 'part_time' | 'contractor';
export type EmployeeLevel = '1' | '2' | '3' | '4' | '5' | 'contractor';
export type PayCondition = 
  'base' | 
  'overtime_1_5' | 
  'overtime_2' | 
  'saturday' | 
  'sunday' | 
  'public_holiday' | 
  'early_morning' | 
  'evening' | 
  'night' | 
  'shift_allowance' |
  'meal_allowance';

export type DayType = 'weekday' | 'saturday' | 'sunday' | 'public_holiday';
export type Frequency = 'hourly' | 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'per_event';

export interface RateDefinition {
  id: string;
  percentage: number;
  description: string;
  dayType?: DayType;
  startTime?: string;
  endTime?: string;
  multiplier?: number;
}

export interface EmployeeLevelRates {
  base: number;
  title?: string;
  description?: string;
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
  name: string;
  description: string;
  conditionRates: Record<PayCondition, RateDefinition>;
  employeeLevelRates: Record<string, EmployeeLevelRates>;
  settings: AwardSettings;
  levels: string[];
}

export interface JobCostCalculationInput {
  employmentType: EmploymentType;
  level: EmployeeLevel;
  hours: Record<PayCondition, number>;
  overheadPercentage: number;
  marginPercentage: number;
}

export interface CostItem {
  condition: PayCondition;
  hours: number;
  rate: number;
  cost: number;
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
  items: CostItem[];
  // Required by TypeScript errors
  laborHours: number;
  breakdownByDay: any;
  byTimeOfDay: any;
  profitMargin: number;
  finalPrice: number;
}

// Quote Types
export interface Quote {
  id: string;
  name: string;
  client_name?: string;
  site_name?: string;
  status: 'draft' | 'pending' | 'sent' | 'rejected' | 'expired' | 'approved';
  created_at: string;
  updated_at: string;
  total_price: number;
  total_cost: number;
  margin_percentage: number;
  margin_amount: number;
  overhead_percentage: number;
  overhead_cost: number;
  labor_cost: number;
  subcontractor_cost: number;
  start_date?: string;
  end_date?: string;
  expiry_date?: string;
  notes?: string;
  created_by?: string;
  user_id?: string;
}

export interface QuoteShift {
  id: string;
  quote_id: string;
  day: string;
  start_time: string;
  end_time: string;
  break_duration: number;
  employment_type: EmploymentType;
  level: number;
  number_of_cleaners: number;
  estimated_cost: number;
  location?: string;
  allowances?: any[];
  notes?: string;
}

export interface Subcontractor {
  id: string;
  business_name: string;
  contact_name: string;
  cost?: number;
  frequency?: Frequency;
}
