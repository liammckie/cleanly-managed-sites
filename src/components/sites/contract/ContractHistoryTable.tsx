
import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils/formatters';
import { useSiteContractHistory } from '@/hooks/useSiteContractHistory';
import { ContractDetails, ContractTerm } from './types';
import { Badge } from '@/components/ui/badge';
import { JsonValue } from '@/types/common';

export const ContractHistoryTable = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const { contractHistory, isLoading, error } = useSiteContractHistory(siteId);

  if (isLoading) {
    return <div>Loading contract history...</div>;
  }

  if (error) {
    return <div>Error loading contract history: {error.message}</div>;
  }

  if (!contractHistory || contractHistory.length === 0) {
    return <div>No contract history available</div>;
  }

  const formatContractSummary = (contractDetails: JsonValue) => {
    if (typeof contractDetails === 'string') {
      return 'Contract details not available in structured format';
    }
    
    if (!contractDetails || typeof contractDetails !== 'object') {
      return 'No contract details';
    }
    
    // Safe access
    const details = contractDetails as Record<string, any>;
    
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-x-2">
          <span className="text-muted-foreground">Contract Number:</span>
          <span>{details.contractNumber || 'N/A'}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-2">
          <span className="text-muted-foreground">Start Date:</span>
          <span>{details.startDate ? formatDate(details.startDate) : 'N/A'}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-2">
          <span className="text-muted-foreground">End Date:</span>
          <span>{details.endDate ? formatDate(details.endDate) : 'N/A'}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-2">
          <span className="text-muted-foreground">Auto Renewal:</span>
          <span>{details.autoRenewal === true ? 'Yes' : 'No'}</span>
        </div>
      </div>
    );
  };

  const renderContractDetails = (contractDetails: ContractDetails) => {
    return (
      <div className="space-y-3">
        <div>
          <span className="font-medium">Start Date:</span>{' '}
          {contractDetails.startDate ? formatDate(contractDetails.startDate) : 'Not specified'}
        </div>
        <div>
          <span className="font-medium">End Date:</span>{' '}
          {contractDetails.endDate ? formatDate(contractDetails.endDate) : 'Not specified'}
        </div>
        <div>
          <span className="font-medium">Auto Renewal:</span>{' '}
          {contractDetails.autoRenewal ? 'Yes' : 'No'}
        </div>
        {contractDetails.renewalPeriod && (
          <div>
            <span className="font-medium">Renewal Period:</span> {contractDetails.renewalPeriod} {contractDetails.renewalNotice === 1 ? 'month' : 'months'}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Contract Details</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contractHistory.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{formatDate(entry.created_at)}</TableCell>
                <TableCell>
                  <Badge variant="outline">v{entry.version_number}</Badge>
                </TableCell>
                <TableCell className="max-w-xs">
                  {formatContractSummary(entry.contract_details)}
                </TableCell>
                <TableCell>{entry.notes || 'No notes'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ContractHistoryTable;
