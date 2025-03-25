
import { ColumnDef } from "@tanstack/react-table";
import { ContractData } from "@/lib/types/contracts";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { asJsonObject } from "@/lib/utils/json";

export function getColumns(): ColumnDef<ContractData>[] {
  return [
    {
      accessorKey: "site_name",
      header: "Site",
      cell: ({ row }) => {
        const site = row.original;
        return (
          <div>
            <div className="font-medium">{site.site_name}</div>
            <div className="text-sm text-muted-foreground">
              {site.client_name}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "contract_details.contractNumber",
      header: "Contract #",
      cell: ({ row }) => {
        const details = asJsonObject(row.original.contract_details, { contractNumber: '' });
        return details.contractNumber || "-";
      },
    },
    {
      accessorKey: "contract_details.endDate",
      header: "Expiry Date",
      cell: ({ row }) => {
        const details = asJsonObject(row.original.contract_details, { endDate: '' });
        if (!details.endDate) return "No end date";
        
        try {
          const date = new Date(details.endDate);
          const today = new Date();
          const diffTime = date.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          let badgeVariant = "default";
          if (diffDays < 0) badgeVariant = "destructive";
          else if (diffDays < 30) badgeVariant = "warning";
          else if (diffDays < 90) badgeVariant = "secondary";
          
          return (
            <div className="flex flex-col gap-1">
              <span>{format(date, "dd/MM/yyyy")}</span>
              {diffDays < 0 ? (
                <Badge variant={badgeVariant}>Expired</Badge>
              ) : (
                <Badge variant={badgeVariant}>
                  {diffDays} days left
                </Badge>
              )}
            </div>
          );
        } catch (e) {
          return "Invalid date";
        }
      },
    },
    {
      accessorKey: "monthly_revenue",
      header: "Monthly Value",
      cell: ({ row }) => {
        return formatCurrency(row.original.monthly_revenue || 0);
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status || "unknown";
        let badgeVariant = "default";
        
        switch (status) {
          case "active":
            badgeVariant = "success";
            break;
          case "expired":
            badgeVariant = "destructive";
            break;
          case "pending":
            badgeVariant = "warning";
            break;
          case "draft":
            badgeVariant = "secondary";
            break;
        }
        
        return (
          <Badge variant={badgeVariant} className="capitalize">
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const contract = row.original;
        
        return (
          <div className="flex justify-end">
            <Button 
              variant="ghost" 
              size="icon" 
              asChild
            >
              <Link to={`/sites/${contract.site_id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to={`/sites/${contract.site_id}`}>View Site</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to={`/sites/${contract.site_id}/edit`}>Edit Contract</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to={`/sites/${contract.site_id}/variation`}>Create Variation</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
