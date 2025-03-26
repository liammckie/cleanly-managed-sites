
// Adding to the existing file
export interface Shift {
  id?: string;
  day?: string;
  startTime?: string;
  endTime?: string;
  breakDuration?: number;
  numberOfCleaners?: number;
  employmentType?: string;
  level?: number;
  location?: string;
  estimatedCost?: number;
  notes?: string;
}

export interface Scenario {
  id?: string;
  name: string;
  description?: string;
  shifts: Shift[];
  subcontractors?: any[];
  materials?: any[];
  overheadPercentage?: number;
  profitPercentage?: number;
}
