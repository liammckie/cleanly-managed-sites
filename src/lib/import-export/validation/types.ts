
export interface ValidationMessage {
  type: 'error' | 'warning' | 'info';
  field: string;
  message: string;
  row?: number;
  value?: any;
}

export interface ValidationResult {
  valid: boolean;
  messages: ValidationMessage[];
}

export interface ValidationOptions {
  requireAllFields?: boolean;
  ignoreEmptyRows?: boolean;
}
