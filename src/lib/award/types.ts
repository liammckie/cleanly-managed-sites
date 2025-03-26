
// Basic enums 
export enum Day {
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday',
  Saturday = 'saturday',
  Sunday = 'sunday'
}

export enum EmploymentType {
  FullTime = 'full_time',
  PartTime = 'part_time',
  Casual = 'casual'
}

export enum EmployeeLevel {
  Level1 = 1,
  Level2 = 2,
  Level3 = 3,
  Level4 = 4,
  Level5 = 5,
  Level6 = 6,
  Level7 = 7
}

export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'yearly' | 'once' | 'annually' | 'one_time' | 'per_event';

// Define interfaces for the award engine
export interface AwardData {
  baseRates: Record<EmployeeLevel, number>;
  casualLoading: number;
  allowances: PayCondition[];
}

export interface PayCondition {
  id: string;
  name: string;
  amount: number;
  description?: string;
  unit: string;
}

export interface RateDefinition {
  id: string;
  dayType: string;
  startTime: string;
  endTime: string;
  multiplier: number;
  description: string;
}

export interface EmployeeLevelRates {
  level: EmployeeLevel;
  baseRate: number;
  casualRate: number;
}

export interface AwardSettings {
  award: string;
  state: string;
  baseAwardLevel: EmployeeLevel;
  casualLoading: number;
  includeSuper: boolean;
  superRate: number;
  includeCasualLoading: boolean;
  includeWeekendRates: boolean;
  includePublicHolidayRates: boolean;
  includeEarlyMorningRates: boolean;
  includeLateNightRates: boolean;
  includeAllowances: boolean;
}

export interface CostCalculationResult {
  totalCost: number;
  laborHours: number;
  breakdownByDay: Record<string, DayBreakdown>;
  byTimeOfDay: TimeOfDayBreakdown;
  overheadCost: number;
  profitMargin: number;
  finalPrice: number;
}

export interface DayBreakdown {
  hours: number;
  cost: number;
  shifts: ShiftBreakdown[];
}

export interface ShiftBreakdown {
  day: Day;
  startTime: string;
  endTime: string;
  hours: number;
  rate: number;
  cost: number;
}

export interface TimeOfDayBreakdown {
  standard: number;
  earlyMorning: number;
  lateNight: number;
  weekend: number;
  publicHoliday: number;
}

export interface JobCostCalculationInput {
  shifts: JobShift[];
  overheadPercentage: number;
  marginPercentage: number;
}

export interface JobShift {
  day: Day;
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: EmploymentType;
  level: EmployeeLevel;
  allowances: string[];
}

export interface Subcontractor {
  id: string;
  name: string;
  service?: string;
  cost: number;
  frequency: Frequency;
  monthlyCost?: number;
  annualCost?: number;
}
