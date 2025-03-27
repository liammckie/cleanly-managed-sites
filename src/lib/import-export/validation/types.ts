
// src/lib/import-export/validation/types.ts - Defines validation types

export interface ValidationError {
  path: string;
  message: string;
  row?: number;
  value?: any;
}

export interface ValidationMessage {
  type: 'error' | 'warning' | 'info';
  field: string;
  message: string;
  row?: number;
  value?: any;
}

export interface ValidationResult<T = unknown> {
  valid: boolean;
  data?: T;
  errors?: ValidationError[];
  warnings?: ValidationError[];
  messages?: ValidationMessage[];
}

export interface ValidationOptions {
  requireAllFields?: boolean;
  ignoreEmptyRows?: boolean;
}
