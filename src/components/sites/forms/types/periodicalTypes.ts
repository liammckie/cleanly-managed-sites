
export interface Periodicals {
  ceilings?: boolean;
  glazing?: boolean;
  upholstery?: boolean;
  sanitizing?: boolean;
  pressureWashing?: boolean;
  notes?: string;
  
  // Frequency properties
  glazingFrequency?: string;
  ceilingsFrequency?: string;
  upholsteryFrequency?: string;
  sanitizingFrequency?: string;
  pressureWashingFrequency?: string;
  
  // Date properties
  nextGlazingDate?: string;
  nextCeilingsDate?: string;
  nextUpholsteryDate?: string;
  nextSanitizingDate?: string;
  nextPressureWashingDate?: string;
  
  // Extended structure for component compatibility
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
    vents: boolean;
  };
  additional?: {
    sanitizing: boolean;
    upholstery: boolean;
    pressureWashing?: boolean;
  };
}
