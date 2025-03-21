
import React from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText, Info } from 'lucide-react';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import { ContractVersionDetails } from './ContractVersionDetails';

interface ContractHistoryTableProps {
  history: ContractHistoryEntry[];
  isLoading: boolean;
  currentContractDetails: any;
}

export function ContractHistoryTable({ history, isLoading, currentContractDetails }: ContractHistoryTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-8 glass-card p-6">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Contract History</h3>
        <p className="text-muted-foreground">
          When contract details are updated, versions will be stored and displayed here.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="bg-muted/50 p-4 flex items-center gap-2 border-b">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="font-medium">Contract Version History</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Version</TableHead>
            <TableHead>Date Modified</TableHead>
            <TableHead>Contract Number</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Badge variant="outline" className="bg-primary text-primary-foreground">Current</Badge>
            </TableCell>
            <TableCell>Current Version</TableCell>
            <TableCell>{currentContractDetails?.contractNumber || 'N/A'}</TableCell>
            <TableCell>{currentContractDetails?.startDate || 'N/A'}</TableCell>
            <TableCell>{currentContractDetails?.endDate || 'N/A'}</TableCell>
            <TableCell>-</TableCell>
            <TableCell className="text-right">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-xs px-2 py-1 rounded hover:bg-muted flex items-center ml-auto">
                    <Info className="h-4 w-4 mr-1" />
                    View
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Contract Details (Current Version)</DialogTitle>
                  </DialogHeader>
                  <ContractVersionDetails contractDetails={currentContractDetails} />
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
          {history.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                <Badge variant="outline">v{entry.version_number}</Badge>
              </TableCell>
              <TableCell>{format(new Date(entry.created_at), 'MMM d, yyyy HH:mm')}</TableCell>
              <TableCell>{entry.contract_details.contractNumber}</TableCell>
              <TableCell>{entry.contract_details.startDate}</TableCell>
              <TableCell>{entry.contract_details.endDate}</TableCell>
              <TableCell className="max-w-[200px] truncate">{entry.notes || '-'}</TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-xs px-2 py-1 rounded hover:bg-muted flex items-center ml-auto">
                      <Info className="h-4 w-4 mr-1" />
                      View
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Contract Details (Version {entry.version_number})</DialogTitle>
                    </DialogHeader>
                    <ContractVersionDetails contractDetails={entry.contract_details} />
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
