
// Define enhanced Periodicals interface
export interface Periodicals {
  items?: PeriodicalItem[];
  notes?: string;
  glazing?: boolean;
  ceilings?: boolean;
  upholstery?: boolean;
  sanitizing?: boolean;
  pressureWashing?: boolean;
  nextGlazingDate?: string;
  nextCeilingsDate?: string;
  nextUpholsteryDate?: string;
  nextSanitizingDate?: string;
  nextPressureWashingDate?: string;
  glazingFrequency?: string;
  ceilingsFrequency?: string;
  upholsteryFrequency?: string;
  sanitizingFrequency?: string;
  pressureWashingFrequency?: string;
}

// Define PeriodicalItem interface
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
