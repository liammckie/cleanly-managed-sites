
export interface ContractActivity {
  id: string;
  contract_id: string;
  contractId?: string;
  activity_type: string;
  action?: string;
  created_at: string;
  timestamp?: string;
  created_by?: string;
  userName?: string;
  metadata?: any;
  details?: any;
  description?: string;
}

export interface ContractActivityWithDetails extends ContractActivity {
  action: string;
  timestamp: string;
  userName: string;
  details: any;
}
