
import React, { useState } from 'react';
import { useContracts } from '@/hooks/useContracts';
import { DataTable } from '@/components/ui/data-table';
import { getColumns } from '@/components/contracts/ContractColumns';
import { adaptContractsToColumnFormat } from '@/lib/api/contracts/contractAdapter';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Contracts() {
  const navigate = useNavigate();
  const { contracts, isLoading, error } = useContracts();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredContracts = contracts.filter(contract => 
    contract.site_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddNewContract = () => {
    navigate('/contracts/create');
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Failed to load contracts: {error.message}</span>
        </div>
      </div>
    );
  }
  
  // Convert the contract data to the format expected by the DataTable
  const adaptedContracts = adaptContractsToColumnFormat(filteredContracts);
  
  return (
    <div className="container py-10">
      <PageHeader
        heading="Contracts"
        subheading="Manage all your contracts"
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
          searchColumn="client"
          searchPlaceholder="Search contracts..."
          onSearch={setSearchQuery}
        />
      </div>
    </div>
  );
}
