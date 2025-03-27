
import React from 'react';
import { useContracts } from '@/hooks/useContracts';
import { ValueCard } from '@/components/dashboard/ValueCard';
import { formatCurrency } from '@/lib/utils/formatters';

/**
 * Component that displays key metrics about contract values
 */
export function ContractValueMetrics() {
  const { sites, isLoading, contractSummary } = useContracts();
  
  // Calculate active count if it doesn't exist
  const activeCount = contractSummary?.activeCount || 
    (Array.isArray(sites) ? sites.filter(c => c.status === 'active').length : 0);
  
  // Calculate total contracts if it doesn't exist
  const totalContracts = contractSummary?.totalContracts || contractSummary?.totalCount || 
    (Array.isArray(sites) ? sites.length : 0);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <ValueCard
        title="Annual Contract Value"
        value={formatCurrency((contractSummary?.totalValue || 0) * 12)}
        description="Total annual revenue from all contracts"
        loading={isLoading}
      />
      
      <ValueCard
        title="Monthly Contract Value"
        value={formatCurrency(contractSummary?.totalValue || 0)}
        description="Total monthly revenue from all contracts"
        loading={isLoading}
      />
      
      <ValueCard
        title="Total Contracts"
        value={totalContracts.toString()}
        description="Number of contracts across all clients"
        loading={isLoading}
      />
      
      <ValueCard
        title="Active Contracts"
        value={activeCount.toString()}
        description={`${activeCount} of ${totalContracts} contracts are active`}
        loading={isLoading}
      />
    </div>
  );
}
