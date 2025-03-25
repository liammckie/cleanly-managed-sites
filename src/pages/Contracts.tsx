
import React, { useState } from 'react';
import { useContracts } from '@/hooks/useContracts';
import { ContractData } from '@/lib/types/contracts';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/ui/page-header';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { TableFilter } from '@/components/sites/contract/TableFilter';
import { ContractValueMetrics } from '@/components/contracts/ContractValueMetrics';
import { getColumns } from '@/components/contracts/ContractColumns';
import { useNavigate } from 'react-router-dom';

export default function Contracts() {
  const navigate = useNavigate();
  const { contractData, isLoading } = useContracts();
  const [filterValue, setFilterValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Filter the contract data based on search value and status
  const filteredData = contractData.filter(contract => {
    const matchesSearch = 
      !filterValue || 
      contract.site_name.toLowerCase().includes(filterValue.toLowerCase()) ||
      contract.client_name.toLowerCase().includes(filterValue.toLowerCase());
    
    const matchesStatus = 
      !statusFilter || 
      contract.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort by expiry date
  const sortedData = [...filteredData].sort((a, b) => {
    const getEndDate = (contract: ContractData) => {
      // TypeScript needs a type assertion here
      const details = contract.contract_details as any;
      return details?.endDate || '9999-12-31'; // Far future date for contracts with no end date
    };
    
    return getEndDate(a).localeCompare(getEndDate(b));
  });

  const columns = getColumns();
  
  return (
    <PageLayout>
      <div className="container mx-auto py-6 space-y-6">
        <PageHeader 
          title="Contract Management" 
          description="View and manage all client contracts"
          action={
            <Button onClick={() => navigate('/contracts/new')}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Contract
            </Button>
          }
        />
        
        <ContractValueMetrics />
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">All Contracts</h2>
            <TableFilter 
              value={filterValue}
              onChange={setFilterValue}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          </div>
          
          <div className="border rounded-md">
            <DataTable 
              columns={columns} 
              data={sortedData}
            />
          </div>
          
          {isLoading && (
            <div className="flex justify-center p-4">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          )}
          
          {!isLoading && sortedData.length === 0 && (
            <div className="text-center py-8 border rounded-md bg-muted/30">
              <h3 className="text-lg font-medium mb-2">No contracts found</h3>
              <p className="text-muted-foreground">
                {filterValue || statusFilter 
                  ? "Try adjusting your filters" 
                  : "Add your first contract to get started"}
              </p>
              {!filterValue && !statusFilter && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate('/contracts/new')}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Contract
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
