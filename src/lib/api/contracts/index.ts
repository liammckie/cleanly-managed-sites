
import { contractToDb, dbToContract, contractDetailsToDb } from './contractAdapter';
import { Contract } from '@/types/db';

// Re-export the adapter functions
export {
  contractToDb,
  dbToContract,
  contractDetailsToDb
};

// Add adapter functions to fix the errors
export const adaptContractData = (contract: any): Contract => {
  return dbToContract(contract);
};

export const adaptContracts = (contracts: any[]): Contract[] => {
  return contracts.map(dbToContract);
};
