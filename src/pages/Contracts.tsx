
import React, { useMemo } from 'react';
import { useContracts } from '@/hooks/useContracts';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/ui/page-header';
import { ContractValueMetrics } from '@/components/contracts/ContractValueMetrics';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TableFilter } from '@/components/sites/contract/TableFilter';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils/formatters';
import { format, isBefore, parseISO } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { ContractData } from '@/lib/types/contracts';
import { asJsonObject } from '@/lib/utils/json';

export default function Contracts() {
  const { contractData, groupedContracts, isLoading } = useContracts();
  
  const columns = useMemo<ColumnDef<ContractData>[]>(() => [
    {
      accessorKey: 'site_name',
      header: 'Site',
      cell: ({ row }) => (
        <Link to={`/sites/${row.original.site_id}`} className="text-primary hover:underline">
          {row.original.site_name}
        </Link>
      ),
    },
    {
      accessorKey: 'client_name',
      header: 'Client',
      cell: ({ row }) => (
        <Link to={`/clients/${row.original.client_id}`} className="text-primary hover:underline">
          {row.original.client_name}
        </Link>
      ),
    },
    {
      accessorKey: 'contract_details',
      header: 'Start Date',
      cell: ({ row }) => {
        const contractDetails = asJsonObject(row.original.contract_details, { startDate: '' });
        return contractDetails.startDate ? format(new Date(contractDetails.startDate), 'dd/MM/yyyy') : '-';
      },
    },
    {
      accessorKey: 'contract_details',
      header: 'End Date',
      cell: ({ row }) => {
        const contractDetails = asJsonObject(row.original.contract_details, { endDate: '' });
        return contractDetails.endDate ? format(new Date(contractDetails.endDate), 'dd/MM/yyyy') : '-';
      },
    },
    {
      accessorKey: 'contract_details',
      header: 'Contract Number',
      cell: ({ row }) => {
        const contractDetails = asJsonObject(row.original.contract_details, { contractNumber: '' });
        return contractDetails.contractNumber || '-';
      },
    },
    {
      accessorKey: 'contract_details',
      header: 'Contract Type',
      cell: ({ row }) => {
        const contractDetails = asJsonObject(row.original.contract_details, { contractType: '' });
        return contractDetails.contractType || '-';
      },
    },
    {
      accessorKey: 'contract_details',
      header: 'Renewal Type',
      cell: ({ row }) => {
        const contractDetails = asJsonObject(row.original.contract_details, { renewalType: '' });
        return contractDetails.renewalType || '-';
      },
    },
    {
      accessorKey: 'monthly_revenue',
      header: 'Monthly Value',
      cell: ({ row }) => {
        const value = asJsonObject(row.original.contract_details, { value: 0 }).value || row.original.monthly_revenue;
        return formatCurrency(value);
      },
    },
    {
      accessorKey: 'contract_details',
      header: 'Status',
      cell: ({ row }) => {
        const contractDetails = asJsonObject(row.original.contract_details, { status: 'active' });
        return (
          <Badge variant={contractDetails.status === 'active' ? 'default' : 'secondary'}>
            {contractDetails.status || 'Active'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'contract_details',
      header: 'Notice Period',
      cell: ({ row }) => {
        const contractDetails = asJsonObject(row.original.contract_details, { noticePeriod: '' });
        return contractDetails.noticePeriod || '-';
      },
    },
    {
      accessorKey: 'contract_details',
      header: 'Auto Renewal',
      cell: ({ row }) => {
        const contractDetails = asJsonObject(row.original.contract_details, { autoRenewal: false });
        return contractDetails.autoRenewal ? 'Yes' : 'No';
      },
    },
  ], []);

  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader
        title="Contracts"
        description="Manage all client contracts and agreements"
        actions={
          <Button asChild>
            <Link to="/contracts/new"><Plus className="mr-2 h-4 w-4" />Add Contract</Link>
          </Button>
        }
      />
      
      <ContractValueMetrics />
      
      <div className="rounded-md border bg-card">
        <div className="p-4 flex flex-col sm:flex-row justify-between gap-4">
          <TableFilter />
        </div>
        
        <DataTable columns={columns} data={contractData} loading={isLoading} />
      </div>
    </div>
  );
}
