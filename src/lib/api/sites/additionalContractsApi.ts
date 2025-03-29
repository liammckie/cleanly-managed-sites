
import { supabase } from '@/lib/supabase';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';

export const fetchAdditionalContracts = async (siteId: string) => {
  try {
    const { data, error } = await supabase
      .from('site_additional_contracts')
      .select('*')
      .eq('site_id', siteId);
    
    if (error) {
      console.error('Error fetching additional contracts:', error);
      throw new Error('Failed to fetch additional contracts');
    }
    
    return data.map(contract => ({
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
      renewalPeriod: contract.renewal_period ? String(contract.renewal_period) : '',
      renewalNoticeDays: contract.renewal_notice,
      serviceFrequency: contract.service_frequency,
      serviceDeliveryMethod: contract.service_delivery_method
    })) as ContractDetails[];
  } catch (error) {
    console.error('Error in fetchAdditionalContracts:', error);
    throw error;
  }
};

export const fetchAdditionalContract = async (contractId: string) => {
  try {
    const { data, error } = await supabase
      .from('site_additional_contracts')
      .select('*')
      .eq('id', contractId)
      .single();
    
    if (error) {
      console.error('Error fetching additional contract:', error);
      throw new Error('Failed to fetch additional contract');
    }
    
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
      renewalPeriod: data.renewal_period ? String(data.renewal_period) : '',
      renewalNoticeDays: data.renewal_notice,
      serviceFrequency: data.service_frequency,
      serviceDeliveryMethod: data.service_delivery_method
    } as ContractDetails;
  } catch (error) {
    console.error('Error in fetchAdditionalContract:', error);
    throw error;
  }
};

export const createAdditionalContract = async (siteId: string, contractDetails: Partial<ContractDetails>) => {
  try {
    const { data, error } = await supabase
      .from('site_additional_contracts')
      .insert({
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
        renewal_period: contractDetails.renewalPeriod,
        renewal_notice: contractDetails.renewalNoticeDays,
        service_frequency: contractDetails.serviceFrequency,
        service_delivery_method: contractDetails.serviceDeliveryMethod
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating additional contract:', error);
      throw new Error('Failed to create additional contract');
    }
    
    return data;
  } catch (error) {
    console.error('Error in createAdditionalContract:', error);
    throw error;
  }
};

export const updateAdditionalContract = async (contractId: string, contractDetails: Partial<ContractDetails>) => {
  try {
    const { data, error } = await supabase
      .from('site_additional_contracts')
      .update({
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
        renewal_period: contractDetails.renewalPeriod,
        renewal_notice: contractDetails.renewalNoticeDays,
        service_frequency: contractDetails.serviceFrequency,
        service_delivery_method: contractDetails.serviceDeliveryMethod
      })
      .eq('id', contractId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating additional contract:', error);
      throw new Error('Failed to update additional contract');
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateAdditionalContract:', error);
    throw error;
  }
};

export const deleteAdditionalContract = async (contractId: string) => {
  try {
    const { error } = await supabase
      .from('site_additional_contracts')
      .delete()
      .eq('id', contractId);
    
    if (error) {
      console.error('Error deleting additional contract:', error);
      throw new Error('Failed to delete additional contract');
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteAdditionalContract:', error);
    throw error;
  }
};
