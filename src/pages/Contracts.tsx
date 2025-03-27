
import React from 'react';
import { useContracts } from '@/hooks/useContracts';
import { DashboardLayout } from '@/components/ui/layout/DashboardLayout';
import { ContractDashboard } from '@/components/sites/contract/ContractDashboard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ContractTable } from '@/components/sites/contract/ContractTable';

const Contracts = () => {
  const { contractData, isLoading, error, metrics, groupedContracts } = useContracts();
  
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Contracts Management</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <h3 className="text-xl font-semibold mb-2">Error Loading Contracts</h3>
            <p>{error.message || 'Unable to load contract data'}</p>
          </div>
        ) : (
          <>
            <ContractDashboard />
            
            <h2 className="text-xl font-semibold mt-8 mb-4">All Contracts</h2>
            <ContractTable contracts={contractData} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Contracts;
