
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils/formatters';
import { ContractDetails as ContractDetailsType } from '../forms/types/contractTypes';

interface ContractDetailsProps {
  contractDetails: ContractDetailsType;
}

export const ContractDetails: React.FC<ContractDetailsProps> = ({
  contractDetails
}) => {
  // Check if the contract details are empty
  if (!contractDetails || Object.keys(contractDetails).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contract Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No contract details available</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate contract status based on dates
  const getContractStatus = () => {
    if (!contractDetails.endDate) return { status: 'active', label: 'Active' };
    
    const now = new Date();
    const endDate = new Date(contractDetails.endDate);
    
    if (endDate < now) {
      return { status: 'destructive', label: 'Expired' };
    }
    
    // Check if expiring within 30 days
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    if (endDate <= thirtyDaysFromNow) {
      return { status: 'outline', label: 'Expiring Soon' };
    }
    
    return { status: 'success', label: 'Active' };
  };

  const { status, label } = getContractStatus();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Contract Details</CardTitle>
        <Badge variant={status as "default" | "secondary" | "destructive" | "success" | "outline"}>
          {label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
            <p>{formatDate(contractDetails.startDate)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">End Date</h3>
            <p>{contractDetails.endDate ? formatDate(contractDetails.endDate) : 'No end date'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Contract Length</h3>
            <p>{contractDetails.contractLength} {contractDetails.contractLengthUnit}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Auto Renewal</h3>
            <p>{contractDetails.autoRenewal ? 'Yes' : 'No'}</p>
          </div>
          {contractDetails.renewalPeriod && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Renewal Period</h3>
              <p>{contractDetails.renewalPeriod} days</p>
            </div>
          )}
          {contractDetails.renewalNotice && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Renewal Notice</h3>
              <p>{contractDetails.renewalNotice} {contractDetails.noticeUnit}</p>
            </div>
          )}
          {contractDetails.terminationPeriod && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Termination Period</h3>
              <p>{contractDetails.terminationPeriod}</p>
            </div>
          )}
          {contractDetails.renewalTerms && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Renewal Terms</h3>
              <p>{contractDetails.renewalTerms}</p>
            </div>
          )}
          {contractDetails.serviceFrequency && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Service Frequency</h3>
              <p className="capitalize">{contractDetails.serviceFrequency}</p>
            </div>
          )}
          {contractDetails.serviceDeliveryMethod && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Delivery Method</h3>
              <p className="capitalize">{contractDetails.serviceDeliveryMethod}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractDetails;
