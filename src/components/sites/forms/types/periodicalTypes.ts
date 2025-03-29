
export interface PeriodicalItem {
  id?: string;
  name: string;
  description?: string;
  frequency: string;
  lastCompleted?: string;
  nextDue?: string;
  assignedTo?: string;
  status?: string;
  notes?: string;
}

export interface Periodicals {
  items?: PeriodicalItem[];
  notes?: string;
}
