
import { supabase } from '@/lib/supabase';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';

export const additionalContractsApi = {
  /**
   * Fetch additional contracts for a site
   */
  async fetchAdditionalContracts(siteId: string): Promise<ContractDetails[]> {
    const { data, error } = await supabase
      .from('site_additional_contracts')
      .select('*')
      .eq('site_id', siteId);

    if (error) {
      console.error('Error fetching additional contracts:', error);
      throw new Error('Failed to fetch additional contracts');
    }

    // Map the raw DB data to ContractDetails type
    return data.map(contract => ({
      id: contract.id,
      startDate: contract.start_date,
      endDate: contract.end_date,
      contractNumber: contract.contract_number,
      contractType: contract.contract_type,
      renewalTerms: contract.renewal_terms,
      terminationPeriod: contract.termination_period,
      notes: contract.notes,
      autoRenewal: contract.auto_renew,
      value: contract.value,
      billingCycle: contract.billing_cycle,
      // Add required properties from ContractDetails that aren't in our db model
      contractLength: 0,
      contractLengthUnit: 'months',
      renewalPeriod: 0,
      renewalNotice: 0,
      noticeUnit: '',
      serviceFrequency: '',
      serviceDeliveryMethod: '',
      terms: [],
    }));
  },

  /**
   * Create a new additional contract for a site
   */
  async createAdditionalContract(siteId: string, contractData: Partial<ContractDetails>): Promise<string> {
    // Map from our app model to the DB model
    const dbContractData = {
      site_id: siteId,
      start_date: contractData.startDate,
      end_date: contractData.endDate,
      contract_number: contractData.contractNumber,
      contract_type: contractData.contractType,
      renewal_terms: contractData.renewalTerms,
      termination_period: contractData.terminationPeriod,
      notes: contractData.notes,
      auto_renew: contractData.autoRenewal,
      value: contractData.value,
      billing_cycle: contractData.billingCycle,
      // Any other fields needed by the DB
    };

    const { data, error } = await supabase
      .from('site_additional_contracts')
      .insert(dbContractData)
      .select()
      .single();

    if (error) {
      console.error('Error creating additional contract:', error);
      throw new Error('Failed to create additional contract');
    }

    return data.id;
  },

  /**
   * Update an additional contract
   */
  async updateAdditionalContract(contractId: string, contractData: Partial<ContractDetails>): Promise<void> {
    // Map from our app model to the DB model
    const dbContractData = {
      start_date: contractData.startDate,
      end_date: contractData.endDate,
      contract_number: contractData.contractNumber,
      contract_type: contractData.contractType,
      renewal_terms: contractData.renewalTerms,
      termination_period: contractData.terminationPeriod,
      notes: contractData.notes,
      auto_renew: contractData.autoRenewal,
      value: contractData.value,
      billing_cycle: contractData.billingCycle,
      // Any other fields needed by the DB
    };

    const { error } = await supabase
      .from('site_additional_contracts')
      .update(dbContractData)
      .eq('id', contractId);

    if (error) {
      console.error('Error updating additional contract:', error);
      throw new Error('Failed to update additional contract');
    }
  },

  /**
   * Delete an additional contract
   */
  async deleteAdditionalContract(contractId: string): Promise<void> {
    const { error } = await supabase
      .from('site_additional_contracts')
      .delete()
      .eq('id', contractId);

    if (error) {
      console.error('Error deleting additional contract:', error);
      throw new Error('Failed to delete additional contract');
    }
  }
};

/**
 * Helper function to handle additional contracts in a site form/update operation
 */
export async function handleSiteAdditionalContracts(
  siteId: string,
  additionalContracts: ContractDetails[]
): Promise<void> {
  try {
    // Get existing additional contracts
    const existingContracts = await additionalContractsApi.fetchAdditionalContracts(siteId);
    
    // Create a map of existing contract IDs
    const existingContractIds = new Set(existingContracts.map(c => c.id));
    
    // Process each contract in the updated list
    for (const contract of additionalContracts) {
      if (contract.id && existingContractIds.has(contract.id)) {
        // Update existing contract
        await additionalContractsApi.updateAdditionalContract(contract.id, contract);
        // Remove from the set so we know it's been processed
        existingContractIds.delete(contract.id);
      } else {
        // Create new contract
        await additionalContractsApi.createAdditionalContract(siteId, contract);
      }
    }
    
    // Delete any contracts that weren't in the updated list
    for (const contractId of existingContractIds) {
      if (contractId) {
        await additionalContractsApi.deleteAdditionalContract(contractId);
      }
    }
  } catch (error) {
    console.error('Error handling additional contracts:', error);
    throw error;
  }
}
