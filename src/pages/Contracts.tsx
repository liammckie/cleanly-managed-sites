
import React, { useState } from 'react';
import { useContracts } from '@/hooks/useContracts';
import { DataTable } from '@/components/ui/data-table';
import { ContractData, getColumns } from '@/components/contracts/ContractColumns';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Contracts() {
  const navigate = useNavigate();
  const { contractData, isLoading } = useContracts();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleAddNewContract = () => {
    navigate('/contracts/create');
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Convert the contract data to the format expected by the DataTable
  const adaptedContracts = contractData || [];
  
  return (
    <div className="container py-10">
      <PageHeader
        title="Contracts"
        description="Manage all your contracts"
        action={
          <Button onClick={handleAddNewContract}>
            <Plus className="mr-2 h-4 w-4" />
            Create Contract
          </Button>
        }
      />
      
      <div className="mt-6">
        <DataTable
          columns={getColumns()}
          data={adaptedContracts}
          searchKey="client"
          placeholder="Search contracts..."
          onSearch={setSearchQuery}
        />
      </div>
    </div>
  );
}
