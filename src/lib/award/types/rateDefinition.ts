
export interface RateDefinition {
  id: string;
  dayType: string;
  startTime: string;
  endTime: string;
  multiplier: number;
  percentage: number;
  description: string;
}

export interface AwardSettings {
  usePenalties: boolean;
  standardHoursPerDay: number;
  penaltyRates: Record<string, number>;
}

export interface AwardData {
  rates: Record<string, RateDefinition>;
  baseRates: Record<number, number>;
  settings: AwardSettings;
}

export interface CostCalculationResult {
  baseRate: number;
  totalHours: number;
  laborHours: number;
  laborCost: number;
  overheadCost: number;
  totalCost: number;
  margin: number;
  profitMargin: number;
  price: number;
  finalPrice: number;
  totalCostBeforeMargin: number;
  items: any[];
  breakdownByDay: Record<string, any>;
  byTimeOfDay: Record<string, any>;
}

export interface EmployeeLevelRates {
  loading: boolean;
  levels: Record<number, number>;
}
