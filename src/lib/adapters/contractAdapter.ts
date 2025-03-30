
import { Contract, DbContract, ContractDetails } from '@/lib/types/contracts';
import { adaptContractToDb, adaptContractFromDb, adaptContractDetailsToDb, adaptContractDetailsFromDb, adaptContractDetailsToJson } from '@/lib/types/adapters/contractAdapter';

// Re-export adapter functions from the new centralized adapter registry
export { 
  adaptContractToDb,
  adaptContractFromDb,
  adaptContractDetailsToDb,
  adaptContractDetailsFromDb, 
  adaptContractDetailsToJson
};
