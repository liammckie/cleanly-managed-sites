
import { SiteRecord } from '@/lib/types';
import { WorkOrderAttachment } from '@/hooks/useGoogleDriveFiles';

export type WorkOrderStatus = 
  | 'draft' 
  | 'pending_approval' 
  | 'approved' 
  | 'assigned' 
  | 'in_progress' 
  | 'completed' 
  | 'invoiced' 
  | 'paid' 
  | 'cancelled';

export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Work order activity categories
 */
export type WorkOrderActivityType = 
  | 'cleaning' 
  | 'pest_control' 
  | 'grounds_maintenance' 
  | 'waste_management' 
  | 'hygiene_services'
  | 'other';

export interface WorkOrderRecord {
  id: string;
  title: string;
  description: string;
  site_id: string;
  created_by: string;
  assigned_to?: string; // subcontractor id
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  estimated_cost?: number;
  actual_cost?: number;
  billing_amount?: number;
  due_date?: string;
  completion_date?: string;
  created_at: string;
  updated_at: string;
  requires_purchase_order: boolean;
  purchase_order_number?: string;
  xero_purchase_order_id?: string;
  xero_invoice_id?: string;
  attachments?: WorkOrderAttachment[];
  // Joined data
  site?: SiteRecord;
}

export interface CreateWorkOrderData {
  title: string;
  description: string;
  site_id: string;
  priority: WorkOrderPriority;
  due_date?: string;
  completion_date?: string;
  estimated_cost?: number;
  billing_amount?: number;
  assigned_to?: string;
  requires_purchase_order: boolean;
  purchase_order_number?: string;
  attachments?: WorkOrderAttachment[];
  status?: WorkOrderStatus; // Optional field to allow setting initial status
}

export interface UpdateWorkOrderData {
  title?: string;
  description?: string;
  status?: WorkOrderStatus;
  priority?: WorkOrderPriority;
  due_date?: string;
  estimated_cost?: number;
  actual_cost?: number;
  billing_amount?: number;
  assigned_to?: string;
  completion_date?: string;
  requires_purchase_order?: boolean;
  purchase_order_number?: string;
  xero_purchase_order_id?: string;
  xero_invoice_id?: string;
  attachments?: WorkOrderAttachment[];
}

/**
 * Work order template model
 */
export interface WorkOrderTemplate {
  id: string;
  title: string;
  description: string;
  activityType: WorkOrderActivityType;
  estimatedCost?: number;
  priority?: WorkOrderPriority;
  requiresPurchaseOrder?: boolean;
  billingAmount?: number;
}
