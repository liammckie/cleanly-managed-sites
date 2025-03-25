
export interface AdHocWorkAuthorization {
  enabled?: boolean;
  approvalLimit?: number;
  requirePurchaseOrder?: boolean;
  approver?: string;
  approverEmail?: string;
  approverPhone?: string;
}
