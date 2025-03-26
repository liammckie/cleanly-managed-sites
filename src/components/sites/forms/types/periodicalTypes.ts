
export interface Periodicals {
  ceilings: boolean;
  glazing: boolean;
  upholstery: boolean;
  sanitizing: boolean;
  pressureWashing?: boolean;
  notes: string;
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
