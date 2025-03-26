
import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { contractColumns, ContractData } from '@/components/contracts/ContractColumns';

interface ContractTableProps {
  contracts: ContractData[];
  count: number;
}

export function ContractTable({ contracts, count }: ContractTableProps) {
  return (
    <div className="rounded-md border">
      <DataTable 
        columns={contractColumns} 
        data={contracts} 
        searchColumn="site.name" 
      />
      {count === 0 && (
        <div className="p-4 text-center text-muted-foreground">
          No contracts found.
        </div>
      )}
    </div>
  );
}
