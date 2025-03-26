
import { useQuery } from '@tanstack/react-query';
import { ContractData } from '@/lib/types/contracts';
import { contractsApi } from '@/lib/api/sites/contractsApi';
import { asJsonObject, jsonToString } from '@/lib/utils/json';

export interface GroupedContracts {
  active: ContractData[];
  pending: ContractData[];
  expired: ContractData[];
  expiringSoon: ContractData[];
  byStatus: Record<string, ContractData[]>;
  byMonth: Record<string, ContractData[]>;
}

export function useContracts() {
  const { data: contractData = [], isLoading, error } = useQuery({
    queryKey: ['contracts'],
    queryFn: contractsApi.getContracts
  });

  // Safely calculate metrics based on data
  const totalValue = Array.isArray(contractData) 
    ? contractData.reduce((sum, contract) => sum + (contract.monthly_revenue || 0), 0) 
    : 0;
    
  const averageValue = Array.isArray(contractData) && contractData.length > 0 
    ? totalValue / contractData.length 
    : 0;

  // Group contracts
  const groupedContracts: GroupedContracts = {
    active: [],
    pending: [],
    expired: [],
    expiringSoon: [],
    byStatus: {},
    byMonth: {}
  };

  if (Array.isArray(contractData)) {
    // Group by status
    contractData.forEach(contract => {
      const status = contract.status || 'undefined';
      if (!groupedContracts.byStatus[status]) {
        groupedContracts.byStatus[status] = [];
      }
      groupedContracts.byStatus[status].push(contract);
    });
    
    // Active contracts
    groupedContracts.active = contractData.filter(contract => 
      contract.status === 'active'
    );
    
    // Pending contracts
    groupedContracts.pending = contractData.filter(contract => 
      contract.status === 'pending'
    );
    
    // Calculate expired contracts
    const today = new Date();
    contractData.forEach(contract => {
      const contractDetails = asJsonObject(contract.contract_details, { endDate: '' });
      const endDateStr = contractDetails.endDate as string | undefined;
      
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
        
        // Group by expiry month
        if (!isNaN(endDate.getTime())) {
          const monthKey = `${endDate.getMonth() + 1}-${endDate.getFullYear()}`;
          if (!groupedContracts.byMonth[monthKey]) {
            groupedContracts.byMonth[monthKey] = [];
          }
          groupedContracts.byMonth[monthKey].push(contract);
        }
      }
    });
  }

  // Contract statistics
  const totalContracts = Array.isArray(contractData) ? contractData.length : 0;
  const activeCount = groupedContracts.active.length;
  const pendingCount = groupedContracts.pending.length;
  const expiredCount = groupedContracts.expired.length;
  const expiringSoonCount = groupedContracts.expiringSoon.length;

  return {
    contractData,
    isLoading,
    isError: !!error,
    error,
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
