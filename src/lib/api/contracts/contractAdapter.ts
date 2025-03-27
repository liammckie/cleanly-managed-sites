
import { ContractData } from '@/types/contracts';

export const adaptContractData = (data: any): ContractData => {
  return {
    id: data.id || crypto.randomUUID(),
    client: {
      id: data.client_id || '',
      name: data.client_name || '',
    },
    site: {
      id: data.site_id || '',
      name: data.site_name || '',
    },
    value: data.value || data.monthly_revenue || 0,
    startDate: data.start_date || data.startDate || '',
    endDate: data.end_date || data.endDate || '',
    status: data.status || 'active',
    
    // Keep original fields for compatibility
    site_id: data.site_id,
    site_name: data.site_name,
    client_id: data.client_id,
    client_name: data.client_name,
    monthly_revenue: data.monthly_revenue,
    contract_details: data.contract_details,
    
    // Ensure backward compatibility
    start_date: data.start_date || data.startDate,
    end_date: data.end_date || data.endDate,
    
    // Add the is_primary field that was being referenced elsewhere
    is_primary: data.is_primary || false
  };
};

/**
 * Adapts an array of contract data
 */
export const adaptContracts = (dataArray: any[]): ContractData[] => {
  return dataArray.map(adaptContractData);
};

/**
 * Alias for adaptContractData for backward compatibility
 */
export const adaptContract = adaptContractData;
