export interface Quote {
  id: string;
  title: string;
  name: string;
  clientName: string;
  siteName?: string;
  description?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  overheadPercentage: number;
  marginPercentage: number;
  totalPrice: number;
  laborCost: number;
  suppliesCost: number;
  equipmentCost: number;
  subcontractorCost: number;
  createdAt: string;
  updatedAt: string;
  quoteNumber?: string;
  validUntil?: string;
  clientId?: string;
  clientContact?: string;
  clientEmail?: string;
  clientPhone?: string;
  siteId?: string;
  siteAddress?: string;
  frequency?: string;
  scope?: string;
  terms?: string;
  notes?: string;
  created_by?: string;
  overheadCost?: number;
  totalCost?: number;
  marginAmount?: number;
  startDate?: string;
  endDate?: string;
  expiryDate?: string;
  contractLength?: number;
  contractLengthUnit?: string;
  overheadProfile?: string;
  userId?: string;
  shifts?: QuoteShift[];
  subcontractors?: Subcontractor[];
}

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
  description?: string;
  cost: number;
  frequency: Frequency;
  quoteId?: string;
  email?: string;
  phone?: string;
  services?: string[];
  service?: string;
  notes?: string;
  rate?: number;
}

// Update Frequency to include one_time
export type Frequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'one_time';

export type Day =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'
  | 'public_holiday';

export type EmploymentType = 'full_time' | 'part_time' | 'casual' | 'contract';

export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;

export interface EmployeeLevelRate {
  level: EmployeeLevel;
  hourlyRate: number;
}

export interface ShiftData {
  day: Day;
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: EmploymentType;
  level: EmployeeLevel;
  allowances: string[];
  location: string;
  notes: string;
}

export interface JobCostingParams {
  shifts: ShiftData[];
  subcontractors: Subcontractor[];
  overheadPercentage: number;
  marginPercentage: number;
}

export interface JobCostBreakdown {
  totalCost: number;
  overheadCost: number;
  marginCost: number;
  marginAmount: number;
  totalPrice: number;
  totalCostBeforeMargin: number;
  shiftCosts: Record<string, number>;
}

export interface JobCostBreakdownItem {
  description: string;
  hours: number;
  rate: number;
  amount: number;
}

export interface EmployeeLevelRates {
  [level: number]: EmployeeLevelRate;
}

export type AllowanceType = 'laundry' | 'vehicle' | 'first_aid' | 'leading_hand' | 'meal';

export type PayCondition = 
  'base' | 'standard' | 'weekday' | 'shift-early-late' | 'night' | 
  'saturday' | 'sunday' | 'public_holiday' | 'evening' | 
  'early_morning' | 'overnight' | 'overtime-first-2-hours' | 
  'overtime-after-2-hours' | 'overtime-sunday' | 'overtime-public_holiday';
