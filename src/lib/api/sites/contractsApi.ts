
import { supabase } from '@/lib/supabase';
import { adaptContractFromDb } from '@/lib/adapters/contractAdapter';
import { Contract } from '@/lib/types/contracts';

// Adapter functions
export const adaptContract = (contract: any): Contract => {
  return adaptContractFromDb({
    id: contract.id,
    site_id: contract.site_id,
    client_id: contract.client_id,
    contract_number: contract.contract_number || '',
    start_date: contract.start_date || '',
    end_date: contract.end_date || '',
    value: contract.value || 0,
    status: contract.status || 'active',
    monthly_value: contract.monthly_value,
    monthly_revenue: contract.monthly_revenue,
    auto_renewal: contract.auto_renewal || false,
    renewal_period: contract.renewal_period || '',
    renewal_notice_days: contract.renewal_notice_days || 0,
    termination_period: contract.termination_period || '',
    service_frequency: contract.service_frequency || '',
    service_delivery_method: contract.service_delivery_method || '',
    is_primary: contract.is_primary || false,
    created_at: contract.created_at || '',
    updated_at: contract.updated_at || '',
    contract_details: contract.contract_details
  });
};

export const adaptContracts = (contracts: any[]): Contract[] => {
  return contracts.map(adaptContract);
};

// API functions
export const fetchContractsBySiteId = async (siteId: string) => {
  const { data, error } = await supabase
    .from('site_additional_contracts')
    .select('*')
    .eq('site_id', siteId);
  
  if (error) {
    console.error('Error fetching contracts by site ID:', error);
    throw new Error(error.message);
  }
  
  return adaptContracts(data || []);
};

export const fetchContractById = async (contractId: string) => {
  const { data, error } = await supabase
    .from('site_additional_contracts')
    .select('*')
    .eq('id', contractId)
    .single();
  
  if (error) {
    console.error('Error fetching contract by ID:', error);
    throw new Error(error.message);
  }
  
  return adaptContract(data);
};
