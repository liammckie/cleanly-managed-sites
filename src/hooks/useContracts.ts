
import { useQuery } from '@tanstack/react-query';
import { ContractData } from '@/lib/types/contracts';
import { contractsApi } from '@/lib/api/sites/contractsApi';
import { asJsonObject, jsonToString } from '@/lib/utils/json';

export interface GroupedContracts {
  active: ContractData[];
  pending: ContractData[];
  expired: ContractData[];
  expiringSoon: ContractData[];
}

export function useContracts() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['contracts'],
    queryFn: contractsApi.getContracts
  });

  // Safely calculate metrics based on data
  const totalValue = Array.isArray(data) 
    ? data.reduce((sum, contract) => sum + (contract.monthly_revenue || 0), 0) 
    : 0;
    
  const averageValue = Array.isArray(data) && data.length > 0 
    ? totalValue / data.length 
    : 0;

  // Group contracts
  const groupedContracts: GroupedContracts = {
    active: [],
    pending: [],
    expired: [],
    expiringSoon: []
  };

  if (Array.isArray(data)) {
    // Active contracts
    groupedContracts.active = data.filter(contract => 
      contract.status === 'active'
    );
    
    // Pending contracts
    groupedContracts.pending = data.filter(contract => 
      contract.status === 'pending'
    );
    
    // Calculate expired contracts
    const today = new Date();
    data.forEach(contract => {
      const contractDetails = asJsonObject(contract.contract_details, { endDate: '' });
      const endDateStr = jsonToString(contractDetails.endDate);
      
      if (endDateStr && new Date(endDateStr) < today) {
        groupedContracts.expired.push(contract);
      }
      
      // Check for contracts expiring in the next 30 days
      if (endDateStr) {
        const endDate = new Date(endDateStr);
        const daysUntilExpiry = Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry >= 0 && daysUntilExpiry <= 30) {
          groupedContracts.expiringSoon.push(contract);
        }
      }
    });
  }

  // Contract statistics
  const totalContracts = Array.isArray(data) ? data.length : 0;
  const activeCount = groupedContracts.active.length;
  const pendingCount = groupedContracts.pending.length;
  const expiredCount = groupedContracts.expired.length;
  const expiringSoonCount = groupedContracts.expiringSoon.length;

  return {
    contractData: data || [],
    isLoading,
    isError,
    groupedContracts,
    metrics: {
      totalContracts,
      activeCount,
      pendingCount,
      expiredCount,
      expiringSoonCount,
      totalValue,
      averageValue
    }
  };
}
