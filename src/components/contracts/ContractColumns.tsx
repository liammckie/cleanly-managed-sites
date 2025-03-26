
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

export interface ContractData {
  id: string;
  client: string;
  site: string;
  value: number;
  startDate: string;
  endDate: string;
  status: string;
}

export function getColumns(): ColumnDef<ContractData>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'client',
      header: 'Client',
    },
    {
      accessorKey: 'site',
      header: 'Site',
    },
    {
      accessorKey: 'value',
      header: 'Value',
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('value'));
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => formatDate(row.getValue('startDate')),
    },
    {
      accessorKey: 'endDate',
      header: 'End Date',
      cell: ({ row }) => formatDate(row.getValue('endDate')),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge variant={getStatusVariant(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
  ];
}

function getStatusVariant(status: string): 'default' | 'success' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'active':
      return 'success';
    case 'pending':
      return 'secondary';
    case 'expired':
      return 'destructive';
    case 'cancelled':
      return 'outline';
    default:
      return 'default';
  }
}
