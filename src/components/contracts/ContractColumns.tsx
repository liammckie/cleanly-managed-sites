import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"

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

export const getColumns = (): ColumnDef<ContractData>[] => [
  {
    id: "select",
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
  },
];
