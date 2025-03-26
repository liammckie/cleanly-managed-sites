
import { supabase } from '@/lib/supabase';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';

// Fetch additional contracts for a site
export const fetchAdditionalContracts = async (siteId: string): Promise<ContractDetails[]> => {
  const { data, error } = await supabase
    .from('site_additional_contracts')
    .select('*')
    .eq('site_id', siteId);
    
  if (error) {
    console.error('Error fetching additional contracts:', error);
    throw new Error(`Failed to fetch additional contracts: ${error.message}`);
  }
  
  // Map database records to ContractDetails objects
  return (data || []).map(contract => ({
    id: contract.id,
    contractNumber: contract.contract_number,
    startDate: contract.start_date,
    endDate: contract.end_date,
    contractType: contract.contract_type,
    value: contract.value,
    billingCycle: contract.billing_cycle,
    autoRenewal: contract.auto_renew,
    renewalTerms: contract.renewal_terms,
    terminationPeriod: contract.termination_period,
    notes: contract.notes,
    // Adding required properties from ContractDetails
    contractLength: 0,
    contractLengthUnit: 'months',
    renewalPeriod: 0,
    renewalNotice: 0,
    noticeUnit: 'months',
    serviceFrequency: '',
    serviceDeliveryMethod: ''
  }));
};

// Create a new additional contract
export const createAdditionalContract = async (
  siteId: string, 
  contractDetails: Partial<ContractDetails>
): Promise<ContractDetails> => {
  // Prepare data for insertion
  const contractData = {
    site_id: siteId,
    contract_number: contractDetails.contractNumber,
    start_date: contractDetails.startDate,
    end_date: contractDetails.endDate,
    contract_type: contractDetails.contractType,
    value: contractDetails.value,
    billing_cycle: contractDetails.billingCycle,
    auto_renew: contractDetails.autoRenewal,
    renewal_terms: contractDetails.renewalTerms,
    termination_period: contractDetails.terminationPeriod,
    notes: contractDetails.notes,
  };
  
  const { data, error } = await supabase
    .from('site_additional_contracts')
    .insert([contractData])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating additional contract:', error);
    throw new Error(`Failed to create additional contract: ${error.message}`);
  }
  
  // Map the response to a ContractDetails object
  return {
    id: data.id,
    contractNumber: data.contract_number,
    startDate: data.start_date,
    endDate: data.end_date,
    contractType: data.contract_type,
    value: data.value,
    billingCycle: data.billing_cycle,
    autoRenewal: data.auto_renew,
    renewalTerms: data.renewal_terms,
    terminationPeriod: data.termination_period,
    notes: data.notes,
    // Adding required properties from ContractDetails
    contractLength: 0,
    contractLengthUnit: 'months',
    renewalPeriod: 0,
    renewalNotice: 0,
    noticeUnit: 'months',
    serviceFrequency: '',
    serviceDeliveryMethod: ''
  };
};

// Update an existing additional contract
export const updateAdditionalContract = async (
  contractId: string, 
  contractDetails: Partial<ContractDetails>
): Promise<ContractDetails> => {
  // Prepare data for update
  const contractData = {
    contract_number: contractDetails.contractNumber,
    start_date: contractDetails.startDate,
    end_date: contractDetails.endDate,
    contract_type: contractDetails.contractType,
    value: contractDetails.value,
    billing_cycle: contractDetails.billingCycle,
    auto_renew: contractDetails.autoRenewal,
    renewal_terms: contractDetails.renewalTerms,
    termination_period: contractDetails.terminationPeriod,
    notes: contractDetails.notes,
  };
  
  const { data, error } = await supabase
    .from('site_additional_contracts')
    .update(contractData)
    .eq('id', contractId)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating additional contract:', error);
    throw new Error(`Failed to update additional contract: ${error.message}`);
  }
  
  // Map the response to a ContractDetails object
  return {
    id: data.id,
    contractNumber: data.contract_number,
    startDate: data.start_date,
    endDate: data.end_date,
    contractType: data.contract_type,
    value: data.value,
    billingCycle: data.billing_cycle,
    autoRenewal: data.auto_renew,
    renewalTerms: data.renewal_terms,
    terminationPeriod: data.termination_period,
    notes: data.notes,
    // Adding required properties from ContractDetails
    contractLength: 0,
    contractLengthUnit: 'months',
    renewalPeriod: 0,
    renewalNotice: 0,
    noticeUnit: 'months',
    serviceFrequency: '',
    serviceDeliveryMethod: ''
  };
};

// Delete an additional contract
export const deleteAdditionalContract = async (contractId: string): Promise<void> => {
  const { error } = await supabase
    .from('site_additional_contracts')
    .delete()
    .eq('id', contractId);
    
  if (error) {
    console.error('Error deleting additional contract:', error);
    throw new Error(`Failed to delete additional contract: ${error.message}`);
  }
};

// Create a named export for the API functions
export const additionalContractsApi = {
  fetchAdditionalContracts,
  createAdditionalContract,
  updateAdditionalContract,
  deleteAdditionalContract
};

// Function to handle additional contracts for a site
export const handleSiteAdditionalContracts = async (
  siteId: string,
  additionalContracts: ContractDetails[]
): Promise<void> => {
  if (!additionalContracts || additionalContracts.length === 0) {
    return;
  }

  // Process each additional contract
  for (const contract of additionalContracts) {
    if (contract.id) {
      // Update existing contract
      await updateAdditionalContract(contract.id, contract);
    } else {
      // Create new contract
      await createAdditionalContract(siteId, contract);
    }
  }
};
