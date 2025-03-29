
import { Contract, ContractDetails, ContractSummaryData } from '@/lib/types/contractTypes';

export interface ContractComponentProps {
  contract: Contract;
}

export interface ContractDetailsProps {
  details: ContractDetails;
}

export interface ContractSummaryProps {
  summaryData: ContractSummaryData;
}

export interface ContractTermsProps {
  terms?: ContractDetails['terms'];
}

