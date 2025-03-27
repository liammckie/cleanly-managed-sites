
import { ContractData, ContractForecast } from '@/types/contracts';

// Placeholder API functions
export const fetchContractForecasts = async (startDate?: string, endDate?: string): Promise<ContractForecast[]> => {
  return [];
};

export const fetchContracts = async (): Promise<ContractData[]> => {
  return [];
};

export const fetchContract = async (id: string): Promise<ContractData> => {
  throw new Error('Not implemented');
};
