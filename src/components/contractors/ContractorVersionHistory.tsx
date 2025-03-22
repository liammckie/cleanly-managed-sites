
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { ContractorVersionHistoryEntry } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ContractorRecord } from '@/lib/types';

export interface ContractorVersionHistoryProps {
  history: ContractorVersionHistoryEntry[];
  isLoading: boolean;
  currentContractor: ContractorRecord;
}

export function ContractorVersionHistory({ history, isLoading, currentContractor }: ContractorVersionHistoryProps) {
  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Version History</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Version History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">No version history available for this contractor.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Version History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Version</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((version) => (
              <TableRow key={version.id}>
                <TableCell>v{version.version_number}</TableCell>
                <TableCell>{format(new Date(version.created_at), 'PPP')}</TableCell>
                <TableCell>{version.notes || 'No notes'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
