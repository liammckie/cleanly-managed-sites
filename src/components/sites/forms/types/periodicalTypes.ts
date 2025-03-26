
export interface PeriodicalTask {
  id?: string;
  name: string;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  lastCompleted?: string; // ISO date
  nextDue?: string; // ISO date
  notes?: string;
  responsible?: string;
  status?: 'pending' | 'completed' | 'overdue';
}

export interface Periodicals {
  tasks?: PeriodicalTask[];
  notes?: string;
  monthly?: PeriodicalTask[]; // Support for older format
  quarterly?: PeriodicalTask[]; // Additional frequency
  // Custom structure for UI rendering
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
  };
  additional?: {
    upholstery: boolean;
    pressureWashing: boolean;
  };
}
