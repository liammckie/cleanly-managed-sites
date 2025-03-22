
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useContractors } from "@/hooks/useContractors";
import { Building2, ChevronRight, FileCheck, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";

export function ContractorsDashboard() {
  const { contractorCounts, isLoading } = useContractors();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <LoadingSpinner />
      </div>
    );
  }

  // Define default values in case properties don't exist
  const totalContractors = contractorCounts?.totalContractors || 0;
  const activeContractors = contractorCounts?.activeContractors || 0;
  const expiringDocuments = contractorCounts?.expiringDocuments || 0;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Link to="/contractors?status=all">
        <Card className="cursor-pointer hover:bg-accent/5 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contractors</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalContractors}</div>
              <div className="text-xs text-muted-foreground flex items-center">
                View All <ChevronRight className="h-3 w-3 ml-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Link to="/contractors?status=active">
        <Card className="cursor-pointer hover:bg-accent/5 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contractors</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{activeContractors}</div>
              <div className="text-xs text-muted-foreground flex items-center">
                View Active <ChevronRight className="h-3 w-3 ml-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Link to="/contractors/documents/expiring">
        <Card className="cursor-pointer hover:bg-accent/5 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Documents</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{expiringDocuments}</div>
              <div className="text-xs text-muted-foreground flex items-center">
                View Expiring <ChevronRight className="h-3 w-3 ml-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
