
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { useContracts } from '@/hooks/useContracts';
import { ContractValueMetrics } from '@/components/contracts/ContractValueMetrics';
import { ContractList } from '@/components/contracts/ContractList';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const Contracts = () => {
  const { sites, isLoading, error, contractSummary } = useContracts();

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader 
        title="Contracts" 
        description="Manage all your service contracts"
      />

      <ContractValueMetrics />
      
      <div className="mt-8">
        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500">
                <p>Error loading contracts: {error}</p>
              </div>
            ) : (
              <ContractList sites={sites} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contracts;
