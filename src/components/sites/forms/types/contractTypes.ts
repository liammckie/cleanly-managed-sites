
export type ContractDetails = {
  startDate: string;
  endDate: string;
  contractNumber: string;
  renewalTerms: string;
  terminationPeriod: string;
}

export type ContractHistoryEntry = {
  id: string;
  site_id: string;
  contract_details: ContractDetails;
  created_at: string;
  created_by?: string;
  version_number: number;
  notes?: string;
}
