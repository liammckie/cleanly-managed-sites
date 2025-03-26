
import React from 'react';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useContracts } from '@/hooks/useContracts';
import { adaptContractDataArray } from '@/components/contracts/contractTypeAdapter';
import { ContractData } from '@/components/contracts/ContractColumns';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ContractValueMetrics } from '@/components/contracts/ContractValueMetrics';
import { ContractTable } from '@/components/contracts/ContractTable';

const Contracts = () => {
  const { contractData: data, isLoading, isError } = useContracts();

  const totalContracts = Array.isArray(data) ? data.length : 0;
  const adaptedContracts = Array.isArray(data) ? adaptContractDataArray(data as ContractData[]) : [];

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <div className="flex-1 overflow-y-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">Contracts</h1>
            
            <ContractValueMetrics />
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner />
              </div>
            ) : isError ? (
              <div className="rounded-lg p-8 text-center border border-border bg-card">
                <p className="text-destructive">
                  Error loading contracts.
                </p>
              </div>
            ) : (
              <ContractTable 
                contracts={adaptedContracts} 
                count={totalContracts} 
              />
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Contracts;
