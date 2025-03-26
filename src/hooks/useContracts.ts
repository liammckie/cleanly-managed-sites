
import { useQuery } from '@tanstack/react-query';
import { contractsApi } from '@/lib/api/sites/contractsApi';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';
import { asJsonObject, jsonToString } from '@/lib/utils/json';

export function useContracts() {
  const { 
    data: contractData = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['contracts'],
    queryFn: contractsApi.getContracts,
  });

  // Group contracts by status
  const groupedContracts = contractData.reduce((acc, contract) => {
    const status = contract.status || 'undefined';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(contract);
    return acc;
  }, {} as Record<string, typeof contractData>);

  // Calculate total active contract value
  const totalContractValue = contractData
    .filter(contract => contract.status === 'active')
    .reduce((sum, contract) => sum + (contract.monthly_revenue || 0), 0);

  // Count contracts expiring within 30 days
  const now = new Date();
  const contractsExpiringWithin30Days = contractData
    .filter(contract => {
      const details = asJsonObject(contract.contract_details, {});
      if (!details.endDate) return false;
      
      const endDate = new Date(jsonToString(details.endDate));
      const daysUntilExpiry = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
    })
    .length;

  // Create a summary object with totals
  const summary = {
    totalActiveContracts: groupedContracts['active']?.length || 0,
    totalContractValue,
    contractsExpiringWithin30Days,
    totalContracts: contractData.length,
  };

  return { 
    contractData, 
    isLoading, 
    error,
    groupedContracts,
    summary
  };
}
