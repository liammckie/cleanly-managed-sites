
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';

export interface ContractHistoryEntry {
  id?: string;
  site_id: string;
  contract_details: ContractDetails;
  notes?: string;
  created_at?: string;
  created_by?: string;
  version_number?: number;
}

export interface Quote {
  id: string;
  name: string;
  clientName?: string;
  siteName?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  expiryDate?: string;
  totalPrice: number;
  laborCost: number;
  overheadPercentage: number;
  marginPercentage: number;
  subcontractorCost: number;
  createdAt: string;
  updatedAt: string;
}
