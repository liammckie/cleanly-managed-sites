
export interface PeriodicalTask {
  id: string;
  name: string;
  frequency: string;
  description?: string;
  lastCompleted?: string;
  nextDue?: string;
  assignee?: string;
  status?: 'pending' | 'completed' | 'overdue';
}

export interface Periodicals {
  weekly?: PeriodicalTask[];
  monthly?: PeriodicalTask[];
  quarterly?: PeriodicalTask[];
  biannual?: PeriodicalTask[]; // Added this property
  annual?: PeriodicalTask[];
  notes?: string;
}
