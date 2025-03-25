
import React from 'react';
import { useContracts } from '@/hooks/useContracts';
import { ValueCard } from '@/components/dashboard/ValueCard';
import { formatCurrency } from '@/lib/utils/formatters';

/**
 * Component that displays key metrics about contract values
 */
export function ContractValueMetrics() {
  const { contractData, isLoading } = useContracts();
  
  // Calculate total values
  const totalAnnualValue = contractData.reduce((sum, contract) => 
    sum + (contract.monthly_revenue || 0) * 12, 0
  );
  
  const totalMonthlyValue = contractData.reduce((sum, contract) => 
    sum + (contract.monthly_revenue || 0), 0
  );
  
  const activeContracts = contractData.filter(c => c.status === 'active').length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <ValueCard
        title="Annual Contract Value"
        value={formatCurrency(totalAnnualValue)}
        description="Total annual revenue from all contracts"
        loading={isLoading}
      />
      
      <ValueCard
        title="Monthly Contract Value"
        value={formatCurrency(totalMonthlyValue)}
        description="Total monthly revenue from all contracts"
        loading={isLoading}
      />
      
      <ValueCard
        title="Total Contracts"
        value={contractData.length.toString()}
        description="Number of contracts across all clients"
        loading={isLoading}
      />
      
      <ValueCard
        title="Active Contracts"
        value={activeContracts.toString()}
        description={`${activeContracts} of ${contractData.length} contracts are active`}
        loading={isLoading}
      />
    </div>
  );
}
