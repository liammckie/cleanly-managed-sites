
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ContractData } from '@/lib/types/contracts';

interface ContractTableProps {
  contracts: ContractData[];
}

export function ContractTable({ contracts }: ContractTableProps) {
  if (!contracts || contracts.length === 0) {
    return <div className="text-center p-4">No contracts found</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Site</TableHead>
            <TableHead>Client</TableHead>
            <TableHead className="hidden md:table-cell">Contract #</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="hidden md:table-cell">End Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell className="font-medium">{contract.site_name}</TableCell>
              <TableCell>{contract.client_name}</TableCell>
              <TableCell className="hidden md:table-cell">
                {contract.contract_details?.contractNumber || 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                ${contract.monthly_revenue?.toLocaleString() || '0'}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {contract.contract_details?.endDate ? 
                  format(new Date(contract.contract_details.endDate), 'dd/MM/yyyy') : 
                  'N/A'}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(contract.status)}>
                  {contract.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function getStatusVariant(status: string): "default" | "success" | "destructive" | "outline" | "secondary" {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'success';
    case 'pending':
      return 'secondary';
    case 'inactive':
    case 'lost':
      return 'destructive';
    case 'on-hold':
      return 'outline';
    default:
      return 'default';
  }
}
