
export interface AdHocWorkAuthorization {
  canAuthorize?: boolean;
  authorizationLimit?: number;
  authorizationContact?: string;
  authorizationEmail?: string;
  authorizationPhone?: string;
  authorizationNotes?: string;
  purchaseOrderRequired?: boolean;
}
