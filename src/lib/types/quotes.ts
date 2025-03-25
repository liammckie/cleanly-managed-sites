
import { Frequency } from '@/lib/award/types';

export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type EmploymentType = 'casual' | 'full-time' | 'part-time' | 'contractor';
export type EmployeeLevel = 'level1' | 'level2' | 'level3' | 'level4' | 'level5';

export interface QuoteShift {
  id: string;
  quoteId: string;
  day?: Day;
  startTime?: string;
  endTime?: string;
  breakDuration?: number;
  numberOfCleaners?: number;
  employmentType?: EmploymentType;
  level?: EmployeeLevel;
  allowances?: string[];
  estimatedCost?: number;
  location?: string;
  notes?: string;
}

export interface Subcontractor {
  id: string;
  quoteId: string;
  name?: string;
  description?: string;
  cost?: number;
  frequency?: Frequency;
  email?: string;
  phone?: string;
  services?: string[];
  service?: string;
  notes?: string;
  rate?: number;
}
