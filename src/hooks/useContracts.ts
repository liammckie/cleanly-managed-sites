
import { useState, useEffect } from 'react';
import { contractsApi } from '@/lib/api/sites/contractsApi';
import { ContractData, ContractSummaryData, GroupedContracts } from '@/lib/types/contracts';

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
  const [groupedContracts, setGroupedContracts] = useState<GroupedContracts>({});

  useEffect(() => {
    const fetchContracts = async () => {
      setIsLoading(true);
      try {
        const contracts = await contractsApi.getContracts();
        
        // Set contract data
        setContractData(contracts);
        
        // Process contracts for metrics
        calculateMetrics(contracts);
        
        // Group contracts for charts
        groupContractsByKey(contracts);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch contracts'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContracts();
  }, []);
  
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
  
  const groupContractsByKey = (contracts: ContractData[]) => {
    if (!contracts || !Array.isArray(contracts)) {
      return;
    }
    
    // Group by status
    const byStatus: Record<string, ContractData[]> = {};
    
    contracts.forEach(contract => {
      const status = contract.status || 'unknown';
      if (!byStatus[status]) {
        byStatus[status] = [];
      }
      byStatus[status].push(contract);
    });
    
    setGroupedContracts({
      ...byStatus
    });
  };

  return {
    contractData,
    isLoading,
    error,
    metrics,
    groupedContracts
  };
}
