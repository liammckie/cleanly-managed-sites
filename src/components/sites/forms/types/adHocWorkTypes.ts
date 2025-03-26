
export interface AdHocWorkAuthorization {
  authorizedAmount?: number;
  requiresApproval?: boolean;
  approvalThreshold?: number;
  approvalContact?: string;
  approvalEmail?: string;
  approvalPhone?: string;
  notes?: string;
  // Additional fields needed by components
  approvalLimit?: number;
  requirePurchaseOrder?: boolean;
}
