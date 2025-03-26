
export interface AdHocWorkAuthorization {
  approvalRequired?: boolean;
  approvalThreshold?: number;
  approvers?: string[];
  contactMethod?: 'email' | 'sms' | 'both';
  autoApproveUnder?: number;
  notes?: string;
}
