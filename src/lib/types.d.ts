
import { Database } from '@/lib/database.types';

// Reusable types
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Extend types from the Database
export type DbTables = Database['public']['Tables'];

// Define record types based on database tables
export type ClientRecord = DbTables['clients']['Row'];
export type SiteRecord = DbTables['sites']['Row'];
export type UserRecord = DbTables['users']['Row'];
export type ContactRecord = DbTables['contacts']['Row'];
export type WorkOrderRecord = DbTables['work_orders']['Row'];
export type SubcontractorRecord = DbTables['subcontractors']['Row'];
export type ContractorRecord = DbTables['contractors']['Row'];
export type BusinessRecord = DbTables['business_details']['Row'];
export type QuoteRecord = DbTables['quotes']['Row'];
export type TaskRecord = DbTables['tasks']['Row'];
export type NoteRecord = DbTables['notes']['Row'];
export type DocumentRecord = DbTables['documents']['Row'];
export type ContractHistoryRecord = DbTables['contract_history']['Row'];
export type UserIntegrationRecord = DbTables['user_integrations']['Row'];

// Enhanced record types with additional properties
export interface EnhancedSiteRecord extends SiteRecord {
  client_name?: string;
  contractor_name?: string;
  total_work_orders?: number;
  tasks_completed?: number;
  tasks_pending?: number;
}

export interface EnhancedWorkOrderRecord extends WorkOrderRecord {
  site_name?: string;
  client_name?: string;
  assigned_to_name?: string;
  total_tasks?: number;
  completed_tasks?: number;
}

export interface EnhancedTaskRecord extends TaskRecord {
  work_order_title?: string;
  assignee_name?: string;
}

export interface EnhancedDocumentRecord extends DocumentRecord {
  uploaded_by_name?: string;
  site_name?: string;
  client_name?: string;
}
