
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency, formatDate } from '@/lib/utils';

export interface ContractData {
  id: string;
  client: string;
  site: string;
  value: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'pending' | 'expired' | 'terminated';
}

export const getColumns = (): ColumnDef<ContractData>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
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
    accessorKey: "client",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("client")}</div>,
  },
  {
    accessorKey: "site",
    header: "Site",
    cell: ({ row }) => <div>{row.getValue("site")}</div>,
  },
  {
    accessorKey: "value",
    header: () => <div className="text-right">Value</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("value"));
      return <div className="text-right font-medium">{formatCurrency(amount)}</div>
    },
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => formatDate(row.getValue("startDate")),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => formatDate(row.getValue("endDate")),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge 
          variant={
            status === "active" ? "success" : 
            status === "pending" ? "warning" : 
            status === "expired" ? "destructive" : 
            "outline"
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
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
              Copy contract ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View contract</DropdownMenuItem>
            <DropdownMenuItem>Edit contract</DropdownMenuItem>
            <DropdownMenuItem>Renew contract</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];
