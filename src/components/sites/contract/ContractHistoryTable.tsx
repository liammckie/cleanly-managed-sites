
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/button';
import { Eye, ArrowDownToLine } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { JsonValue } from '@/types/common';
import { ContractDetails } from './types';

export interface ContractHistoryVersion {
  id: string;
  version_number: number;
  created_at: string;
  created_by?: string;
  notes?: string;
  contract_details: JsonValue;
}

interface ContractHistoryTableProps {
  versions: ContractHistoryVersion[];
  isLoading?: boolean;
}

const ContractHistoryTable: React.FC<ContractHistoryTableProps> = ({ 
  versions, 
  isLoading = false 
}) => {
  const [selectedVersion, setSelectedVersion] = useState<ContractHistoryVersion | null>(null);
  
  // Function to view contract details
  const handleViewDetails = (version: ContractHistoryVersion) => {
    setSelectedVersion(version);
  };
  
  // Function to download contract as PDF
  const handleDownloadContract = (version: ContractHistoryVersion) => {
    // Implementation for PDF download would go here
    console.log('Download contract version:', version.version_number);
  };
  
  if (isLoading) {
    return (
      <div className="py-4 text-center">
        <p>Loading contract history...</p>
      </div>
    );
  }
  
  if (!versions || versions.length === 0) {
    return (
      <div className="py-4 text-center">
        <p>No contract history available.</p>
      </div>
    );
  }
  
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Version</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Details</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {versions.map((version) => {
            // Safely cast to the expected shape or provide defaults
            const details = version.contract_details as ContractDetails;
            const contractNumber = details?.contractNumber || "N/A";
            const startDate = details?.startDate || "N/A";
            const endDate = details?.endDate || "N/A";
            
            return (
              <TableRow key={version.id}>
                <TableCell>
                  <Badge variant="outline">v{version.version_number}</Badge>
                </TableCell>
                <TableCell>{formatDate(version.created_at)}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {version.notes || 'No notes'}
                </TableCell>
                <TableCell>
                  <div className="text-xs space-y-1">
                    <div>Contract: {contractNumber}</div>
                    <div>Period: {startDate} to {endDate}</div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(version)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadContract(version)}
                    >
                      <ArrowDownToLine className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      {selectedVersion && (
        <Dialog open={!!selectedVersion} onOpenChange={() => setSelectedVersion(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Contract Version {selectedVersion.version_number}</DialogTitle>
              <DialogDescription>
                Created on {formatDate(selectedVersion.created_at)}
                {selectedVersion.created_by && ` by ${selectedVersion.created_by}`}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              {selectedVersion.notes && (
                <div>
                  <h4 className="font-semibold mb-1">Notes</h4>
                  <p className="text-sm">{selectedVersion.notes}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold mb-2">Contract Details</h4>
                <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-80">
                  {JSON.stringify(selectedVersion.contract_details, null, 2)}
                </pre>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ContractHistoryTable;
