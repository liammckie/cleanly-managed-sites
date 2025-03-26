
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ContractData } from '@/lib/types/contracts';
import { MoreHorizontal, Edit, BarChart2 } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
    cell: ({ row }) => {
      const date = row.getValue('startDate') as string;
      if (!date) return <div className="text-muted-foreground">Not set</div>;
      return <div>{format(new Date(date), 'PPP')}</div>;
    },
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => {
      const date = row.getValue('endDate') as string;
      if (!date) return <div className="text-muted-foreground">Not set</div>;
      return <div>{format(new Date(date), 'PPP')}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      
      let variant: "default" | "destructive" | "outline" | "secondary" | "success" = "default";
      
      switch (status) {
        case 'active':
          variant = "success";
          break;
        case 'pending':
          variant = "secondary";
          break;
        case 'expired':
          variant = "destructive";
          break;
        case 'on_hold':
          variant = "outline";
          break;
        default:
          variant = "default";
      }
      
      return (
        <Badge variant={variant} className="capitalize">
          {status.replace('_', ' ')}
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
            <DropdownMenuItem onClick={() => window.location.href = `/contracts/${contract.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.location.href = `/contracts/${contract.id}/analytics`}>
              <BarChart2 className="mr-2 h-4 w-4" />
              Analytics
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
