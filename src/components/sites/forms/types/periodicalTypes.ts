
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
  
  // Add nested objects for category-specific settings
  carpet?: {
    cleaning?: boolean;
    shampooing?: boolean;
  };
  floor?: {
    buffing?: boolean;
    stripping?: boolean;
  };
  windows?: {
    internal?: boolean;
    external?: boolean;
  };
  highLevel?: {
    dusting?: boolean;
  };
  additional?: {
    upholstery?: boolean;
    pressureWashing?: boolean;
  };
  notes?: string;
}
