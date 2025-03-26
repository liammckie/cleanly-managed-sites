
export interface Periodicals {
  ceilings?: boolean;
  glazing?: boolean;
  upholstery?: boolean;
  sanitizing?: boolean;
  notes?: string;
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
  };
}
