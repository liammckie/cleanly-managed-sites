
export interface WindowCleaning {
  frequency: string;
  lastCompleted: string;
  nextScheduled: string;
}

export interface SteamCleaning {
  charges: string;
  frequency: string;
  lastCompleted: string;
}

export interface PeriodicalTask {
  id: string;
  name: string;
  frequency: string;
  lastCompleted?: string;
  nextScheduled?: string;
  notes?: string;
}

export interface Periodicals {
  windowCleaning: WindowCleaning;
  steamCleaning: SteamCleaning;
  tasks?: PeriodicalTask[];
}
