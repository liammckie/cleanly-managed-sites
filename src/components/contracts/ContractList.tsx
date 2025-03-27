
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
import { SiteRecord } from '@/lib/types';
import { format } from 'date-fns';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ContractListProps {
  sites: SiteRecord[];
  isLoading: boolean;
}

export function ContractList({ sites, isLoading }: ContractListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!sites || sites.length === 0) {
    return <div className="text-center p-4">No contracts found</div>;
  }

  const getStatusVariant = (status: string): "default" | "success" | "destructive" | "outline" | "secondary" => {
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
  };

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
          {sites.map((site) => {
            // Safely extract contract details and handle when it's a string or object
            const contractDetails = typeof site.contract_details === 'object' ? site.contract_details || {} : {};
            
            // Safely access contract dates
            const startDateStr = contractDetails && 'startDate' in contractDetails 
              ? contractDetails.startDate as string 
              : undefined;
              
            const endDateStr = contractDetails && 'endDate' in contractDetails 
              ? contractDetails.endDate as string 
              : undefined;
              
            const contractNumber = contractDetails && 'contractNumber' in contractDetails
              ? contractDetails.contractNumber as string
              : 'N/A';

            return (
              <TableRow key={site.id}>
                <TableCell className="font-medium">{site.name}</TableCell>
                <TableCell>{site.client_name}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {contractNumber}
                </TableCell>
                <TableCell className="text-right">
                  ${site.monthly_revenue?.toLocaleString() || '0'}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {endDateStr ? 
                    format(new Date(endDateStr), 'dd/MM/yyyy') : 
                    'N/A'}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(site.status)}>
                    {site.status}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
