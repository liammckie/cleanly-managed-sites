import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, FileEdit, Trash2, Copy, Download } from 'lucide-react';

// Simple formatting utilities
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(value);
};

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Define the contract data type
export interface ContractData {
  id: string;
  client: string;
  site: string;
  value: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'pending' | 'draft' | 'cancelled';
  type: string;
}

// Function to get the appropriate badge variant based on contract status
const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" | "success" => {
  switch (status) {
    case 'active':
      return 'success';
    case 'expired':
      return 'destructive';
    case 'pending':
      return 'outline';
    case 'draft':
      return 'secondary';
    case 'cancelled':
      return 'destructive';
    default:
      return 'default';
  }
};

// Define the columns
export const contractColumns: ColumnDef<ContractData>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
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
    accessorKey: 'client',
    header: 'Client',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('client')}</div>
    ),
  },
  {
    accessorKey: 'site',
    header: 'Site',
    cell: ({ row }) => <div>{row.getValue('site')}</div>,
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => <div>{formatCurrency(row.getValue('value'))}</div>,
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => <div>{formatDate(row.getValue('startDate'))}</div>,
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => <div>{formatDate(row.getValue('endDate'))}</div>,
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
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => <div>{row.getValue('type')}</div>,
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(contract.id)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <FileEdit className="mr-2 h-4 w-4" />
              Edit Contract
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Contract
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Export a function to get the columns for compatibility
export const getColumns = () => contractColumns;
