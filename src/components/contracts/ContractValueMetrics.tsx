
import React from 'react';
import { useContracts } from '@/hooks/useContracts';
import { ValueCard } from '@/components/dashboard/ValueCard';
import { formatCurrency } from '@/lib/utils/formatters';

/**
 * Component that displays key metrics about contract values
 */
export function ContractValueMetrics() {
  const { contractData, isLoading, metrics } = useContracts();
  
  // Calculate active count if it doesn't exist
  const activeCount = metrics.activeCount || 
    (Array.isArray(contractData) ? contractData.filter(c => c.status === 'active').length : 0);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <ValueCard
        title="Annual Contract Value"
        value={formatCurrency(metrics.totalValue * 12)}
        description="Total annual revenue from all contracts"
        loading={isLoading}
      />
      
      <ValueCard
        title="Monthly Contract Value"
        value={formatCurrency(metrics.totalValue)}
        description="Total monthly revenue from all contracts"
        loading={isLoading}
      />
      
      <ValueCard
        title="Total Contracts"
        value={metrics.totalContracts.toString()}
        description="Number of contracts across all clients"
        loading={isLoading}
      />
      
      <ValueCard
        title="Active Contracts"
        value={activeCount.toString()}
        description={`${activeCount} of ${metrics.totalContracts} contracts are active`}
        loading={isLoading}
      />
    </div>
  );
}
