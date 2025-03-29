
export interface AdHocWorkAuthorization {
  approvalLimit?: number;
  requirePurchaseOrder?: boolean;
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
  approvalMethod?: string;
  approvalContact?: string;
  notes?: string;
}
