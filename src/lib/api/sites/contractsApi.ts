
import { supabase } from '@/lib/supabase';
import { ContractData, ContractSummaryData } from '@/types/contracts';
import { asJsonObject } from '@/lib/utils/json';
import { adaptContract, adaptContracts } from '../contracts/contractAdapter';

/**
 * Fetch contracts for a specific site
 */
export async function fetchContractsForSite(siteId: string): Promise<ContractData[]> {
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
export async function fetchAllContracts(): Promise<ContractData[]> {
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
