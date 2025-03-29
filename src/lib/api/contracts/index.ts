
import { contractToDb, dbToContract, contractDetailsToDb } from './contractAdapter';

// Re-export the adapter functions
export {
  contractToDb,
  dbToContract,
  contractDetailsToDb
};

// Add additional exports for missing functions from error list
export const adaptContractData = (contract: any) => {
  return dbToContract(contract);
};

export const adaptContracts = (contracts: any[]) => {
  return contracts.map(dbToContract);
};
