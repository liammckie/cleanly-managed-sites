import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { contractsApi } from '@/lib/api/sites/contractsApi';
import { ContractData, ContractSummaryData, GroupedContracts } from '@/lib/types/contracts';
import { addMonths, isAfter, isBefore } from 'date-fns';

export function useContracts() {
  const [contractData, setContractData] = useState<ContractData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [metrics, setMetrics] = useState<ContractSummaryData>({
    // Expiration counts
    expiringThisMonth: 0,
    expiringNext3Months: 0,
    expiringNext6Months: 0,
    expiringThisYear: 0,
    
    // Expiration values
    valueExpiringThisMonth: 0,
    valueExpiringNext3Months: 0,
    valueExpiringNext6Months: 0,
    valueExpiringThisYear: 0,
    
    // Overall contract data
    totalContracts: 0,
    totalValue: 0,
    
    // Financial metrics
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    avgContractValue: 0,
    profitMargin: 0,
    
    // Additional metrics
    activeCount: 0
  });
  const [groupedContracts, setGroupedContracts] = useState<GroupedContracts>({
    activeContracts: [],
    expiringContracts: [],
    expiredContracts: []
  });

  const { data: contracts, refetch, createContract, updateContract, deleteContract, isCreating, isUpdating, isDeleting } = useQuery({
    queryKey: ['contracts'],
    queryFn: contractsApi.getContracts,
    onSuccess: (contracts) => {
      setContractData(contracts);
      
      const active: ContractData[] = [];
      const expiring: ContractData[] = [];
      const expired: ContractData[] = [];
      const today = new Date();
      const threeMonthsLater = addMonths(today, 3);
      
      contracts.forEach(contract => {
        let endDate: Date | null = null;
        
        // Safely extract contract details
        if (contract.contract_details && typeof contract.contract_details === 'object') {
          const details = contract.contract_details as any;
          if (details.endDate) {
            endDate = new Date(details.endDate);
          }
        }
        
        if (!endDate) {
          // If no end date, consider it as active
          active.push(contract);
        } else if (isBefore(endDate, today)) {
          // If end date is in the past, consider it as expired
          expired.push(contract);
        } else if (isBefore(endDate, threeMonthsLater)) {
          // If end date is within 3 months, consider it as expiring
          expiring.push(contract);
        } else {
          // Otherwise, consider it as active
          active.push(contract);
        }
      });
      
      setGroupedContracts({
        activeContracts: active,
        expiringContracts: expiring,
        expiredContracts: expired
      });
      
      // Update metrics
      calculateMetrics(contracts);
    },
    onError: (err) => {
      setError(err instanceof Error ? err : new Error('Failed to fetch contracts'));
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const calculateMetrics = (contracts: ContractData[]) => {
    if (!contracts || !Array.isArray(contracts)) {
      return;
    }
    
    // Default metrics
    const newMetrics: ContractSummaryData = {
      expiringThisMonth: 0,
      expiringNext3Months: 0,
      expiringNext6Months: 0,
      expiringThisYear: 0,
      valueExpiringThisMonth: 0,
      valueExpiringNext3Months: 0,
      valueExpiringNext6Months: 0,
      valueExpiringThisYear: 0,
      totalContracts: contracts.length,
      totalValue: 0,
      totalRevenue: 0,
      totalCost: 0,
      totalProfit: 0,
      avgContractValue: 0,
      profitMargin: 0,
      activeCount: 0
    };
    
    const now = new Date();
    const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const next3Months = new Date(now.getFullYear(), now.getMonth() + 3, 0);
    const next6Months = new Date(now.getFullYear(), now.getMonth() + 6, 0);
    const thisYearEnd = new Date(now.getFullYear(), 11, 31);
    
    // Calculate metrics
    contracts.forEach(contract => {
      // Add to total revenue
      const monthlyRevenue = Number(contract.monthly_revenue) || 0;
      newMetrics.totalValue += monthlyRevenue;
      
      // Count active contracts
      if (contract.status === 'active') {
        newMetrics.activeCount++;
      }
      
      // Check expiration dates
      if (contract.contract_details && typeof contract.contract_details === 'object' && contract.contract_details.endDate) {
        try {
          const endDate = new Date(contract.contract_details.endDate as string);
          
          // This month
          if (endDate <= thisMonthEnd) {
            newMetrics.expiringThisMonth++;
            newMetrics.valueExpiringThisMonth += monthlyRevenue;
          }
          
          // Next 3 months
          if (endDate <= next3Months) {
            newMetrics.expiringNext3Months++;
            newMetrics.valueExpiringNext3Months += monthlyRevenue;
          }
          
          // Next 6 months
          if (endDate <= next6Months) {
            newMetrics.expiringNext6Months++;
            newMetrics.valueExpiringNext6Months += monthlyRevenue;
          }
          
          // This year
          if (endDate <= thisYearEnd) {
            newMetrics.expiringThisYear++;
            newMetrics.valueExpiringThisYear += monthlyRevenue;
          }
        } catch (e) {
          // Skip invalid dates
        }
      }
    });
    
    // Calculate averages and other derived metrics
    if (newMetrics.totalContracts > 0) {
      newMetrics.avgContractValue = newMetrics.totalValue / newMetrics.totalContracts;
    }
    
    // Estimate profit (this is a simplified calculation, adapt as needed)
    newMetrics.totalRevenue = newMetrics.totalValue * 12; // Annualized revenue
    newMetrics.totalCost = newMetrics.totalRevenue * 0.7; // Assuming 70% cost
    newMetrics.totalProfit = newMetrics.totalRevenue - newMetrics.totalCost;
    
    if (newMetrics.totalRevenue > 0) {
      newMetrics.profitMargin = (newMetrics.totalProfit / newMetrics.totalRevenue) * 100;
    }
    
    setMetrics(newMetrics);
  };

  return {
    contractData,
    isLoading,
    error,
    metrics,
    groupedContracts,
    refetch,
    createContract,
    updateContract,
    deleteContract,
    isCreating,
    isUpdating,
    isDeleting
  };
}
