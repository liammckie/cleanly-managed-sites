
export interface PeriodicalService {
  frequency?: string;
  lastCompleted?: string;
  nextScheduled?: string;
  charges?: number;
  cleaning?: boolean;
  shampooing?: boolean;
  buffing?: boolean;
  stripping?: boolean;
  internal?: boolean;
  external?: boolean;
  dusting?: boolean;
  upholstery?: boolean;
  pressureWashing?: boolean;
}

export interface Periodicals {
  carpets?: PeriodicalService;
  floors?: PeriodicalService;
  windows?: PeriodicalService;
  highDusting?: PeriodicalService;
  deepCleaning?: PeriodicalService;
  carpet?: PeriodicalService;
  floor?: PeriodicalService;
  highLevel?: PeriodicalService;
  additional?: PeriodicalService;
  notes?: string;
}
