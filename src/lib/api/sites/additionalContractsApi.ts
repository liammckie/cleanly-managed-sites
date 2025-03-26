
import { supabase } from '@/integrations/supabase/client';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';
import { v4 as uuidv4 } from 'uuid';

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
