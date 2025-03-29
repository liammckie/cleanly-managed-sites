
import { supabase } from '@/lib/supabase';
import { dbToContract } from '@/lib/adapters/contractAdapter';
import { Contract } from '@/types/db';

// Adapter functions
export const adaptContract = (contract: any): Contract => {
  return dbToContract(contract);
};

export const adaptContracts = (contracts: any[]): Contract[] => {
  return contracts.map(dbToContract);
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
