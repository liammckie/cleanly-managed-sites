
import { supabase } from '@/integrations/supabase/client';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';
import { v4 as uuidv4 } from 'uuid';

// Export the additional contracts API functions as a named object
export const additionalContractsApi = {
  // Get all additional contracts for a site
  async getAdditionalContracts(siteId: string): Promise<ContractDetails[]> {
    const { data, error } = await supabase
      .from('site_additional_contracts')
      .select('*')
      .eq('site_id', siteId);
    
    if (error) {
      console.error('Error fetching additional contracts:', error);
      throw error;
    }
    
    // Convert database model to application model
    return data.map(contract => ({
      id: contract.id,
      startDate: contract.start_date,
      endDate: contract.end_date,
      contractNumber: contract.contract_number,
      contractType: contract.contract_type,
      renewalTerms: contract.renewal_terms,
      terminationPeriod: contract.termination_period,
      notes: contract.notes,
      autoRenewal: contract.auto_renew, // corrected from autoRenew
      terms: []
    }));
  },
  
  // Create a new additional contract
  async createAdditionalContract(siteId: string, contractDetails: ContractDetails): Promise<ContractDetails> {
    const id = uuidv4();
    
    const { data, error } = await supabase
      .from('site_additional_contracts')
      .insert([{
        id,
        site_id: siteId,
        contract_number: contractDetails.contractNumber,
        contract_type: contractDetails.contractType,
        start_date: contractDetails.startDate,
        end_date: contractDetails.endDate,
        auto_renew: contractDetails.autoRenewal, // corrected from autoRenew
        renewal_terms: contractDetails.renewalTerms,
        termination_period: contractDetails.terminationPeriod,
        notes: contractDetails.notes
      }])
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating additional contract:', error);
      throw error;
    }
    
    return {
      id: data.id,
      startDate: data.start_date,
      endDate: data.end_date,
      contractNumber: data.contract_number,
      contractType: data.contract_type,
      renewalTerms: data.renewal_terms,
      terminationPeriod: data.termination_period,
      notes: data.notes,
      autoRenewal: data.auto_renew, // corrected from autoRenew
      terms: []
    };
  },
  
  // Update an existing additional contract
  async updateAdditionalContract(contractId: string, contractDetails: Partial<ContractDetails>): Promise<ContractDetails> {
    const { data, error } = await supabase
      .from('site_additional_contracts')
      .update({
        contract_number: contractDetails.contractNumber,
        contract_type: contractDetails.contractType,
        start_date: contractDetails.startDate,
        end_date: contractDetails.endDate,
        auto_renew: contractDetails.autoRenewal, // corrected from autoRenew
        renewal_terms: contractDetails.renewalTerms,
        termination_period: contractDetails.terminationPeriod,
        notes: contractDetails.notes
      })
      .eq('id', contractId)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating additional contract:', error);
      throw error;
    }
    
    return {
      id: data.id,
      startDate: data.start_date,
      endDate: data.end_date,
      contractNumber: data.contract_number,
      contractType: data.contract_type,
      renewalTerms: data.renewal_terms,
      terminationPeriod: data.termination_period,
      notes: data.notes,
      autoRenewal: data.auto_renew, // corrected from autoRenew
      terms: []
    };
  },
  
  // Delete an additional contract
  async deleteAdditionalContract(contractId: string): Promise<void> {
    const { error } = await supabase
      .from('site_additional_contracts')
      .delete()
      .eq('id', contractId);
    
    if (error) {
      console.error('Error deleting additional contract:', error);
      throw error;
    }
  }
};

// Export the function that handles site additional contracts
export async function handleSiteAdditionalContracts(
  siteId: string,
  additionalContracts: ContractDetails[],
  userId: string
): Promise<void> {
  // Get existing additional contracts for the site
  const { data: existingContracts, error: fetchError } = await supabase
    .from('site_additional_contracts')
    .select('id')
    .eq('site_id', siteId);
  
  if (fetchError) {
    console.error('Error fetching existing additional contracts:', fetchError);
    throw fetchError;
  }
  
  // Create a set of existing contract IDs for quick lookup
  const existingContractIds = new Set(existingContracts.map(contract => contract.id));
  
  // Process each additional contract
  for (const contract of additionalContracts) {
    // If the contract has an ID and exists in the database, update it
    if (contract.id && existingContractIds.has(contract.id)) {
      const { error: updateError } = await supabase
        .from('site_additional_contracts')
        .update({
          contract_number: contract.contractNumber,
          contract_type: contract.contractType,
          start_date: contract.startDate,
          end_date: contract.endDate,
          auto_renew: contract.autoRenewal,
          renewal_terms: contract.renewalTerms,
          termination_period: contract.terminationPeriod,
          notes: contract.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', contract.id);
      
      if (updateError) {
        console.error('Error updating additional contract:', updateError);
        throw updateError;
      }
      
      // Remove this ID from the set to track what's been processed
      existingContractIds.delete(contract.id);
    } 
    // If the contract doesn't have an ID or it doesn't exist in the database, insert it
    else {
      const { error: insertError } = await supabase
        .from('site_additional_contracts')
        .insert([{
          id: contract.id || uuidv4(),
          site_id: siteId,
          contract_number: contract.contractNumber,
          contract_type: contract.contractType,
          start_date: contract.startDate,
          end_date: contract.endDate,
          auto_renew: contract.autoRenewal,
          renewal_terms: contract.renewalTerms,
          termination_period: contract.terminationPeriod,
          notes: contract.notes,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }]);
      
      if (insertError) {
        console.error('Error inserting additional contract:', insertError);
        throw insertError;
      }
    }
  }
  
  // Delete any contracts that exist in the database but not in the provided list
  if (existingContractIds.size > 0) {
    const { error: deleteError } = await supabase
      .from('site_additional_contracts')
      .delete()
      .in('id', Array.from(existingContractIds));
    
    if (deleteError) {
      console.error('Error deleting additional contracts:', deleteError);
      throw deleteError;
    }
  }
}
