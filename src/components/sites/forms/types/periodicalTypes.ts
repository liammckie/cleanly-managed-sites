
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
  biannual?: PeriodicalTask[];
  annual?: PeriodicalTask[];
  notes?: string;
  carpet?: {
    cleaning: boolean;
    shampooing: boolean;
  };
  floor?: {
    buffing: boolean;
    stripping: boolean;
  };
  windows?: {
    internal: boolean;
    external: boolean;
  };
  highLevel?: {
    dusting: boolean;
    cleaning: boolean;
  };
  additional?: {
    upholstery: boolean;
    sanitizing: boolean;
    pressureWashing?: boolean;
  };
}
