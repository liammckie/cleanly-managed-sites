import { supabase } from '@/integrations/supabase/client';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';

// Get additional contracts for a site
export async function getSiteAdditionalContracts(siteId: string) {
  const { data, error } = await supabase
    .from('site_additional_contracts')
    .select('*')
    .eq('site_id', siteId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error(`Error fetching additional contracts for site ${siteId}:`, error);
    throw error;
  }
  
  return data || [];
}

// Handle creating/updating site additional contracts
export async function handleSiteAdditionalContracts(
  siteId: string, 
  additionalContracts: ContractDetails[], 
  userId: string | undefined
) {
  // First, delete existing additional contracts for this site
  const { error: deleteError } = await supabase
    .from('site_additional_contracts')
    .delete()
    .eq('site_id', siteId);
  
  if (deleteError) {
    console.error(`Error deleting additional contracts for site ${siteId}:`, deleteError);
    throw deleteError;
  }
  
  // Then insert the new ones if there are any
  if (additionalContracts && additionalContracts.length > 0) {
    const contractRecords = additionalContracts.map(contract => ({
      site_id: siteId,
      contract_type: contract.contractType,
      contract_number: contract.contractNumber,
      start_date: contract.startDate,
      end_date: contract.endDate,
      value: contract.value || 0,
      billing_cycle: contract.billingCycle || 'monthly',
      user_id: userId,
      notes: contract.notes,
      renewal_terms: contract.renewalTerms,
      termination_period: contract.terminationPeriod,
      auto_renew: contract.autoRenew || false
    }));
    
    const { error } = await supabase
      .from('site_additional_contracts')
      .insert(contractRecords);
    
    if (error) {
      console.error('Error handling site additional contracts:', error);
      throw error;
    }
  }
}

// Convert database records to contract details objects
export function convertDbContractsToContractDetails(
  dbContracts: any[]
): ContractDetails[] {
  return dbContracts.map(contract => ({
    contractType: contract.contract_type,
    contractNumber: contract.contract_number,
    startDate: contract.start_date,
    endDate: contract.end_date,
    value: contract.value,
    billingCycle: contract.billing_cycle,
    notes: contract.notes,
    renewalTerms: contract.renewal_terms,
    terminationPeriod: contract.termination_period,
    autoRenew: contract.auto_renew,
    terms: [] // Initialize with empty terms array
  }));
}

export const additionalContractsApi = {
  // Create a new additional contract
  async createAdditionalContract(siteId: string, contractData: ContractDetails): Promise<any> {
    const { data, error } = await supabase
      .from('site_additional_contracts')
      .insert([{
        site_id: siteId,
        contract_number: contractData.contractNumber,
        start_date: contractData.startDate,
        end_date: contractData.endDate,
        value: contractData.value,
        termination_period: contractData.terminationPeriod,
        renewal_terms: contractData.renewalTerms,
        auto_renew: contractData.autoRenewal,
        notes: contractData.notes,
        contract_type: contractData.contractType
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating additional contract:', error);
      throw error;
    }
    
    return data;
  },
  
  // Get additional contracts for a site
  getSiteAdditionalContracts,
  
  // Handle creating/updating site additional contracts
  handleSiteAdditionalContracts,
  
  // Convert database records to contract details objects
  convertDbContractsToContractDetails
};
