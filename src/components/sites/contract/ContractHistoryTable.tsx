
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { JsonValue } from '@/types/common';
import { ContractHistoryEntry } from '@/hooks/useSiteContractHistory';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';

interface ContractHistoryTableProps {
  history: ContractHistoryEntry[];
  isLoading: boolean;
  currentContractDetails: JsonValue;
}

export function ContractHistoryTable({ 
  history,
  isLoading,
  currentContractDetails
}: ContractHistoryTableProps) {
  const [selectedContract, setSelectedContract] = React.useState<JsonValue | null>(null);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  // Function to format the contract details for display
  const formatContractDetails = (details: ContractDetails) => {
    if (!details) return null;
    
    return (
      <div className="bg-slate-50 p-4 rounded-md">
        <h3 className="font-medium text-lg mb-4">Contract Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Contract Number</p>
            <p className="font-medium">{details.contractNumber || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="font-medium">{details.startDate ? format(new Date(details.startDate), 'MMM d, yyyy') : 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p className="font-medium">{details.endDate ? format(new Date(details.endDate), 'MMM d, yyyy') : 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Contract Type</p>
            <p className="font-medium">{details.contractType || 'N/A'}</p>
          </div>
          
          {/* Additional contract details */}
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Auto Renewal</p>
            <p className="font-medium">{details.autoRenewal ? 'Yes' : 'No'}</p>
          </div>
          
          {details.renewalPeriod && (
            <div>
              <p className="text-sm text-gray-500">Renewal Period</p>
              <p className="font-medium">{details.renewalPeriod} {details.renewalPeriod === 1 ? 'month' : 'months'}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-10 text-center">Loading contract history...</div>
        ) : history.length === 0 ? (
          <div className="py-10 text-center">No contract history available.</div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key="current">
                  <TableCell>Current</TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>Current contract details</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedContract(currentContractDetails)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                
                {history.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>v{entry.version_number}</TableCell>
                    <TableCell>{formatDate(entry.created_at)}</TableCell>
                    <TableCell>{entry.notes || 'No notes'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedContract(entry.contract_details)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {selectedContract && (
              <div className="mt-8">
                {formatContractDetails(selectedContract as ContractDetails)}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ContractHistoryTable;
