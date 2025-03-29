
import { supabase } from '@/lib/supabase';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';
import { v4 as uuidv4 } from 'uuid';

// Function to transform contract details for database
const transformContractForDb = (contract: ContractDetails) => {
  return {
    contract_number: contract.contractNumber,
    start_date: contract.startDate,
    end_date: contract.endDate,
    contract_type: contract.contractType,
    value: Number(contract.value || 0),
    billing_cycle: contract.billingCycle,
    auto_renew: contract.autoRenewal,
    renewal_terms: contract.renewalTerms,
    termination_period: contract.terminationPeriod,
    notes: contract.notes
  };
};

// Function to transform database contract to UI contract details
const transformDbToContract = (dbContract: any): ContractDetails => {
  return {
    id: dbContract.id,
    contractNumber: dbContract.contract_number || '',
    startDate: dbContract.start_date || '',
    endDate: dbContract.end_date || '',
    contractType: dbContract.contract_type || '',
    value: dbContract.value || 0,
    billingCycle: dbContract.billing_cycle || 'monthly',
    autoRenewal: dbContract.auto_renew || false,
    renewalTerms: dbContract.renewal_terms || '',
    terminationPeriod: dbContract.termination_period || '',
    renewalPeriod: String(dbContract.renewal_period || '0'),
    serviceFrequency: dbContract.service_frequency || '',
    serviceDeliveryMethod: dbContract.service_delivery_method || '',
    notes: dbContract.notes || ''
  };
};

// Function to handle site additional contracts
export const handleSiteAdditionalContracts = async (
  siteId: string,
  additionalContracts: ContractDetails[]
) => {
  try {
    if (!additionalContracts || additionalContracts.length === 0) {
      return { success: true, message: 'No additional contracts to process' };
    }

    // Get existing additional contracts
    const { data: existingContracts, error: fetchError } = await supabase
      .from('site_additional_contracts')
      .select('id')
      .eq('site_id', siteId);

    if (fetchError) {
      console.error('Error fetching existing contracts:', fetchError);
      throw fetchError;
    }

    // Create a map of existing contract IDs
    const existingContractIds = new Set(existingContracts?.map(c => c.id) || []);

    // Process each additional contract
    for (const contract of additionalContracts) {
      const transformedContract = transformContractForDb(contract);
      
      // If contract has an ID and it exists in the database, update it
      if (contract.id && existingContractIds.has(contract.id)) {
        const { error } = await supabase
          .from('site_additional_contracts')
          .update({
            ...transformedContract,
            updated_at: new Date().toISOString()
          })
          .eq('id', contract.id);

        if (error) {
          console.error('Error updating additional contract:', error);
          throw error;
        }

        // Remove this ID from the set as it's been processed
        existingContractIds.delete(contract.id);
      } 
      // If the contract doesn't have an ID or it doesn't exist, create it
      else {
        const { error } = await supabase
          .from('site_additional_contracts')
          .insert({
            ...transformedContract,
            id: contract.id || uuidv4(),
            site_id: siteId,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error creating additional contract:', error);
          throw error;
        }
      }
    }

    // Delete any contracts that were not included in the update
    if (existingContractIds.size > 0) {
      const { error } = await supabase
        .from('site_additional_contracts')
        .delete()
        .in('id', Array.from(existingContractIds));

      if (error) {
        console.error('Error deleting obsolete contracts:', error);
        throw error;
      }
    }

    return { success: true, message: 'Additional contracts processed successfully' };
  } catch (error) {
    console.error('Error handling additional contracts:', error);
    return { 
      success: false, 
      message: `Error handling additional contracts: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
};

// Function to get all additional contracts for a site
export const getAdditionalContracts = async (siteId: string): Promise<ContractDetails[]> => {
  try {
    const { data, error } = await supabase
      .from('site_additional_contracts')
      .select('*')
      .eq('site_id', siteId);

    if (error) {
      console.error('Error fetching additional contracts:', error);
      throw error;
    }

    return (data || []).map(transformDbToContract);
  } catch (error) {
    console.error('Error in getAdditionalContracts:', error);
    return [];
  }
};

// Export the API object
export const additionalContractsApi = {
  handleSiteAdditionalContracts,
  getAdditionalContracts
};
