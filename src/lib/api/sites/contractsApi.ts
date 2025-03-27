import { supabase } from '@/lib/supabase';
import { ContractData, ContractSummaryData } from '@/types/contracts';
import { asJsonObject } from '@/lib/utils/json';
import { adaptContract, adaptContracts } from '../contracts/contractAdapter';

/**
 * Fetch contracts for a specific site
 */
async function fetchContractsForSite(siteId: string): Promise<ContractData[]> {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select(`
        id,
        site_id:id,
        site_name:name,
        client_id,
        client_name,
        monthly_revenue,
        contract_details,
        status,
        is_primary:true
      `)
      .eq('id', siteId)
      .eq('status', 'active');

    if (error) throw error;
    
    return adaptContracts(data || []);
  } catch (error) {
    console.error('Error fetching site contracts:', error);
    throw error;
  }
}

/**
 * Fetch all contracts
 */
async function fetchAllContracts(): Promise<ContractData[]> {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select(`
        id,
        site_id:id,
        site_name:name,
        client_id,
        client_name,
        monthly_revenue,
        contract_details,
        status,
        is_primary:true
      `)
      .eq('status', 'active');

    if (error) throw error;
    
    return adaptContracts(data || []);
  } catch (error) {
    console.error('Error fetching all contracts:', error);
    throw error;
  }
}

/**
 * Create a new contract
 */
async function createContract(contractData: Partial<ContractData>): Promise<ContractData> {
  try {
    // Implementation will depend on how contracts are actually stored
    // This is a placeholder
    throw new Error("Not implemented yet");
  } catch (error) {
    console.error('Error creating contract:', error);
    throw error;
  }
}

/**
 * Update a contract
 */
async function updateContract(id: string, contractData: Partial<ContractData>): Promise<ContractData> {
  try {
    // Implementation will depend on how contracts are actually stored
    // This is a placeholder
    throw new Error("Not implemented yet");
  } catch (error) {
    console.error('Error updating contract:', error);
    throw error;
  }
}

/**
 * Delete a contract
 */
async function deleteContract(id: string): Promise<void> {
  try {
    // Implementation will depend on how contracts are actually stored
    // This is a placeholder
    throw new Error("Not implemented yet");
  } catch (error) {
    console.error('Error deleting contract:', error);
    throw error;
  }
}

// Export the combined API object
export const contractsApi = {
  getContracts: fetchAllContracts,
  getContractsForSite: fetchContractsForSite,
  createContract,
  updateContract,
  deleteContract
};

// Also export individual functions for specific use cases
export {
  fetchContractsForSite,
  fetchAllContracts,
  createContract,
  updateContract,
  deleteContract
};
