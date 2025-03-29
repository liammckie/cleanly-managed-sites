
/**
 * Contact related type definitions
 */
import { Json } from './common';

/**
 * Contact record from database
 */
export interface ContactRecord {
  id: string;
  name: string;
  role: string;
  department?: string;
  email?: string;
  phone?: string;
  notes?: string;
  is_primary: boolean;
  entity_id: string;
  entity_type: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  services?: Json;
  monthly_cost?: number;
  is_flat_rate?: boolean;
}

/**
 * Enum for entity types
 */
export type EntityType = 'client' | 'site' | 'supplier' | 'internal';

/**
 * Enum for assignment types
 */
export type AssignmentType = 'single' | 'all_sites' | 'all_clients';

/**
 * Contact form data
 */
export interface ContactFormValues {
  name: string;
  role: string;
  department?: string;
  email?: string;
  phone?: string;
  notes?: string;
  is_primary?: boolean;
}

/**
 * Full contact form with entity information
 */
export interface FullContactFormValues extends ContactFormValues {
  entity_id: string;
  entity_type: EntityType;
  assignment_type?: AssignmentType;
}

/**
 * Employee specific data
 */
export interface EmployeeServicesValues {
  position?: string;
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'casual' | 'intern';
  startDate?: string;
  employeeId?: string;
  reportingTo?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

/**
 * Employee form values
 */
export interface EmployeeFormValues extends ContactFormValues {
  position?: string;
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'casual' | 'intern';
  startDate?: Date | string;
  employeeId?: string;
  reportingTo?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}
