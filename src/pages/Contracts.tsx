
import React from 'react';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { DataTable } from '@/components/ui/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContractValueMetrics } from '@/components/contracts/ContractValueMetrics';
import { contractColumns } from '@/components/contracts/ContractColumns';
import { useContracts } from '@/hooks/useContracts';
import { SidebarProvider } from '@/components/ui/sidebar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { adaptContractDataArray } from '@/components/contracts/contractTypeAdapter';
import { Plus } from 'lucide-react';

export default function Contracts() {
  const { contracts, isLoading, error } = useContracts();
  
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold">Contracts</h1>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Contract
              </Button>
            </div>
            
            <div className="mb-6">
              <ContractValueMetrics />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Active Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <LoadingSpinner />
                  </div>
                ) : error ? (
                  <div className="text-center p-4 bg-red-50 text-red-800 rounded">
                    Error loading contracts: {error.message}
                  </div>
                ) : (
                  <DataTable 
                    columns={contractColumns} 
                    data={adaptContractDataArray(contracts)}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
