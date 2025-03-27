export type SiteStatus = 'active' | 'pending' | 'inactive' | 'on-hold' | 'lost';

export interface ValidationMessage {
  field: string;
  message: string;
  row?: number;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationMessage[];
  warnings: ValidationMessage[];
  data: any[];
}

export interface EnhancedValidationResult {
  isValid: boolean;
  errors: ValidationMessage[];
  warnings: ValidationMessage[];
  data: any[];
}
