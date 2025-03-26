
import React from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContractHistoryEntry } from '@/hooks/useSiteContractHistory';
import { Json } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface ContractHistoryTableProps {
  history: ContractHistoryEntry[];
  isLoading: boolean;
  currentContractDetails: Json;
}

const ContractHistoryTable: React.FC<ContractHistoryTableProps> = ({ 
  history, 
  isLoading,
  currentContractDetails
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contract History</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contract History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4 text-muted-foreground">
            No contract history found for this site.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Version</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Created By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.version_number}</TableCell>
                <TableCell>{format(new Date(entry.created_at), 'MMM d, yyyy')}</TableCell>
                <TableCell>{entry.notes}</TableCell>
                <TableCell>{entry.created_by || 'System'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ContractHistoryTable;
