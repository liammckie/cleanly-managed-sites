
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCurrency } from '@/lib/utils/formatters';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

// Define the contract data structure expected by the UI
export interface ContractData {
  id: string;
  site: {
    id: string;
    name: string;
  };
  client: {
    id: string;
    name: string;
  };
  value: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'pending' | 'expired';
}

// Format date from ISO to readable format
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// Define the columns for the contract table
export const contractColumns: ColumnDef<ContractData>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'site.name',
    header: 'Site',
    cell: ({ row }) => {
      const site = row.original.site;
      return (
        <Link to={`/sites/${site.id}`} className="font-medium hover:underline">
          {site.name}
        </Link>
      );
    },
  },
  {
    accessorKey: 'client.name',
    header: 'Client',
    cell: ({ row }) => {
      const client = row.original.client;
      return (
        <Link to={`/clients/${client.id}`} className="hover:underline">
          {client.name}
        </Link>
      );
    },
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => formatCurrency(row.original.value),
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => formatDate(row.original.startDate),
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => formatDate(row.original.endDate),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      let color = 'bg-gray-100 text-gray-800';
      
      if (status === 'active') {
        color = 'bg-green-100 text-green-800';
      } else if (status === 'pending') {
        color = 'bg-yellow-100 text-yellow-800';
      } else if (status === 'expired') {
        color = 'bg-red-100 text-red-800';
      }
      
      return (
        <Badge className={color}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const contract = row.original;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link to={`/contracts/${contract.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={`/contracts/${contract.id}/edit`}>Edit contract</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
