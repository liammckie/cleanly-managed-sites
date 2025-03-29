
import { supabase } from '@/integrations/supabase/client';
import { extractContractData, normalizeContractData } from '@/lib/utils/contractDataUtils';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';
import { SiteRecord } from '@/lib/types';
import { isAfter, isBefore, parseISO, addMonths, isValid } from 'date-fns';
import { adaptContractDetailsToDb } from './contracts/adaptContractTypes';

interface ContractFilters {
  status?: string;
  clientId?: string;
  expiringWithin?: number;
}

/**
 * Fetches all contracts from the sites table
 * @param filters Optional filters for the contracts query
 * @returns Array of contracts with site information
 */
export async function fetchContracts(filters: ContractFilters = {}) {
  try {
    let query = supabase
      .from('sites')
      .select('id, name, client_id, status, contract_details, clients(name)')
      .not('contract_details', 'is', null);
    
    // Apply filters
    if (filters.clientId) {
      query = query.eq('client_id', filters.clientId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Process and filter contracts
    return data
      .filter(site => site.contract_details)
      .map(site => {
        const contract = extractContractData(site.contract_details);
        
        // Skip sites without valid contract details
        if (!contract) return null;
        
        // Filter by contract status if specified
        if (filters.status && contract.status !== filters.status) {
          return null;
        }
        
        // Filter by expiration if specified
        if (filters.expiringWithin && contract.endDate) {
          const endDate = parseISO(contract.endDate);
          if (!isValid(endDate)) return null;
          
          const now = new Date();
          const thresholdDate = addMonths(now, filters.expiringWithin);
          
          // Keep only contracts expiring within the specified period
          if (!isAfter(endDate, now) || !isBefore(endDate, thresholdDate)) {
            return null;
          }
        }
        
        return {
          id: site.id,
          siteName: site.name,
          clientId: site.client_id,
          clientName: site.clients?.name,
          siteStatus: site.status,
          contract: contract
        };
      })
      .filter(Boolean); // Remove null entries
  } catch (error) {
    console.error('Error fetching contracts:', error);
    throw error;
  }
}

/**
 * Fetches contract history for a site
 * @param siteId The site ID to fetch contract history for
 * @returns Array of contract history entries
 */
export async function fetchContractHistory(siteId: string) {
  try {
    const { data, error } = await supabase
      .from('site_contract_history')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(entry => ({
      ...entry,
      contract_details: extractContractData(entry.contract_details)
    }));
  } catch (error) {
    console.error('Error fetching contract history:', error);
    throw error;
  }
}

/**
 * Updates a site's contract details
 * @param siteId The site ID to update
 * @param contractDetails The new contract details
 * @returns The updated site record
 */
export async function updateSiteContract(siteId: string, contractDetails: ContractDetails) {
  try {
    // Adapt contract details to DB format with renewal period as string
    const adaptedDetails = adaptContractDetailsToDb(contractDetails);
    
    // Normalize contract data before saving
    const normalizedContract = normalizeContractData({
      ...contractDetails,
      // Ensure renewal period is a string
      renewalPeriod: contractDetails.renewalPeriod?.toString()
    });
    
    const { data, error } = await supabase
      .from('sites')
      .update({ contract_details: normalizedContract })
      .eq('id', siteId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error updating site contract:', error);
    throw error;
  }
}

/**
 * Searches for contracts based on keywords
 * @param query The search query
 * @returns Array of matching contracts with site information
 */
export async function searchContracts(query: string) {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('id, name, client_id, contract_details, clients(name)')
      .not('contract_details', 'is', null)
      .or(`name.ilike.%${query}%,clients.name.ilike.%${query}%`);
    
    if (error) throw error;
    
    return data
      .filter(site => site.contract_details)
      .map(site => ({
        id: site.id,
        siteName: site.name,
        clientId: site.client_id,
        clientName: site.clients?.name,
        contract: extractContractData(site.contract_details)
      }))
      .filter(item => item.contract); // Filter out items with null contracts
  } catch (error) {
    console.error('Error searching contracts:', error);
    throw error;
  }
}

// Export a combined API object for convenience
export const contractsApi = {
  fetchContracts,
  fetchContractHistory,
  updateSiteContract,
  searchContracts
};
