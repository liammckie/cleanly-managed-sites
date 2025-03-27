
import { Day, EmploymentType, EmployeeLevel } from '@/types/common';

export type PayCondition = 
  | 'base'
  | 'saturday'
  | 'sunday'
  | 'publicHoliday'
  | 'earlyMorning'
  | 'evening'
  | 'overnight'
  | 'overtime1'
  | 'overtime2'
  | 'overtime3';

export interface RateDefinition {
  id: string;
  percentage: number;
  description: string;
}

export interface EmployeeLevelRates {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6?: number;
}

export interface AwardSettings {
  usePenalties: boolean;
  minimumShiftHours: number;
  casualMinimumHours: number;
  dailyMaxHours: number;
  weeklyMaxHours: number;
  breakThresholdHours: number;
  allowances: Record<string, number>;
  baseRateMultiplier?: number;
  overheadPercentageDefault?: number;
  marginPercentageDefault?: number;
}

export interface AwardData {
  baseLevelRates: EmployeeLevelRates;
  casualLoading: number;
  levels: EmployeeLevel[];
  rates: RateDefinition[];
  penaltyRates: Record<PayCondition, RateDefinition>;
  employeeLevelRates: EmployeeLevelRates;
  allowances: Record<string, { amount: number; unit: string }>;
  conditionRates: Record<PayCondition, number>;
  defaultSettings: AwardSettings;
}

export interface JobCostCalculationInput {
  baseRate: number;
  hours: number;
  employmentType: EmploymentType;
  level: EmployeeLevel;
  conditions?: Partial<Record<PayCondition, number>>;
  allowances?: string[];
  overheadPercentage?: number;
  marginPercentage?: number;
}

export interface CostCalculationResult {
  baseRate: number;
  totalHours: number;
  laborHours: number;
  laborCost: number;
  overheadCost: number;
  totalCost: number;
  profitMargin: number;
  margin: number;
  price: number;
  finalPrice: number;
  totalCostBeforeMargin: number;
  items: any[];
  breakdownByDay: Record<string, number>;
  byTimeOfDay: Record<string, number>;
}

export interface QuoteShift {
  id: string;
  quote_id: string;
  day: Day;
  start_time: string;
  end_time: string;
  break_duration: number;
  number_of_cleaners: number;
  employment_type: EmploymentType;
  level: EmployeeLevel;
  allowances: string[];
  estimated_cost: number;
  location: string;
  notes: string;
}

export interface Quote {
  id: string;
  name: string;
  title?: string;
  client_name: string;
  site_name?: string;
  description?: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'pending' | 'accepted';
  overhead_percentage: number;
  margin_percentage: number;
  total_price: number;
  labor_cost: number;
  equipment_cost?: number;
  subcontractor_cost: number;
  created_at: string;
  updated_at: string;
  quote_number?: string;
  valid_until?: string;
  client_id?: string;
  site_id?: string;
  shifts?: QuoteShift[];
  subcontractors?: any[];
  overhead_cost?: number;
  total_cost?: number;
  margin_amount?: number;
  start_date?: string;
  end_date?: string;
  expiry_date?: string;
  contract_length?: number;
  contract_length_unit?: 'days' | 'weeks' | 'months' | 'years';
  overhead_profile?: string;
  user_id?: string;
  created_by?: string;
  notes: string;
  frequency?: string;
  scope?: string;
  terms?: string;
}

export interface Subcontractor {
  id: string;
  name: string;
  cost: number;
  frequency: string;
  description?: string;
}
