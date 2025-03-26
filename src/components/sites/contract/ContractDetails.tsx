
import React from 'react';
import { SiteRecord } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, addMonths, differenceInDays } from 'date-fns';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { BadgeVariant } from '@/types/ui';

interface ContractDetailsProps {
  contractDetails: any;
  site: SiteRecord;
  refetchSite: () => void;
}

const ContractDetails: React.FC<ContractDetailsProps> = ({ contractDetails, site, refetchSite }) => {
  if (!contractDetails) {
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

  const startDate = contractDetails.startDate 
    ? new Date(contractDetails.startDate) 
    : null;
  
  const endDate = contractDetails.endDate 
    ? new Date(contractDetails.endDate) 
    : null;
  
  // Calculate if the contract is expiring soon (within 60 days)
  const isExpiringSoon = endDate && differenceInDays(endDate, new Date()) <= 60;
  
  // Determine renewal period text
  const getRenewalPeriodText = () => {
    if (!contractDetails.autoRenewal) return 'No automatic renewal';
    return `Auto-renews every ${contractDetails.renewalPeriod || ''} ${contractDetails.noticeUnit || 'months'}`;
  };
  
  // Calculate the badge status and style
  const getBadgeVariant = (): BadgeVariant => {
    if (!endDate) return "secondary";
    
    const today = new Date();
    
    if (endDate < today) {
      return "destructive";
    } else if (isExpiringSoon) {
      return "warning";
    } else {
      return "success";
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Contract Details</CardTitle>
          {endDate && (
            <Badge variant={getBadgeVariant()}>
              {endDate < new Date() 
                ? 'Expired' 
                : isExpiringSoon 
                  ? 'Expiring Soon' 
                  : 'Active'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Contract Period</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-muted-foreground w-24">Start Date:</span>
                <span>{startDate ? format(startDate, 'PP') : 'Not specified'}</span>
              </div>
              <div className="flex items-center text-sm">
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-muted-foreground w-24">End Date:</span>
                <span>{endDate ? format(endDate, 'PP') : 'Not specified'}</span>
              </div>
              {contractDetails.contractLength && (
                <div className="flex items-center text-sm">
                  <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground w-24">Duration:</span>
                  <span>{contractDetails.contractLength} {contractDetails.contractLengthUnit || 'months'}</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Renewal Terms</h3>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium text-muted-foreground">Auto Renewal:</span>
                <span className="ml-2">{contractDetails.autoRenewal ? 'Yes' : 'No'}</span>
              </div>
              {contractDetails.autoRenewal && (
                <div className="text-sm">
                  <span className="font-medium text-muted-foreground">Renewal Period:</span>
                  <span className="ml-2">{contractDetails.renewalPeriod} {contractDetails.noticeUnit}</span>
                </div>
              )}
              {contractDetails.renewalNotice && (
                <div className="text-sm">
                  <span className="font-medium text-muted-foreground">Notice Required:</span>
                  <span className="ml-2">{contractDetails.renewalNotice} {contractDetails.noticeUnit}</span>
                </div>
              )}
              {contractDetails.terminationPeriod && (
                <div className="text-sm">
                  <span className="font-medium text-muted-foreground">Termination Period:</span>
                  <span className="ml-2">{contractDetails.terminationPeriod}</span>
                </div>
              )}
              {contractDetails.renewalTerms && (
                <div className="text-sm">
                  <span className="font-medium text-muted-foreground">Renewal Terms:</span>
                  <span className="ml-2">{contractDetails.renewalTerms}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Service Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-sm">
              <span className="font-medium text-muted-foreground">Service Frequency:</span>
              <span className="ml-2">{contractDetails.serviceFrequency || 'Not specified'}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-muted-foreground">Delivery Method:</span>
              <span className="ml-2">{contractDetails.serviceDeliveryMethod || 'Not specified'}</span>
            </div>
          </div>
        </div>
        
        {contractDetails.value && (
          <div>
            <h3 className="font-medium mb-2">Financial Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-sm">
                <span className="font-medium text-muted-foreground">Contract Value:</span>
                <span className="ml-2">${contractDetails.value.toFixed(2)}</span>
              </div>
              {contractDetails.billingCycle && (
                <div className="text-sm">
                  <span className="font-medium text-muted-foreground">Billing Cycle:</span>
                  <span className="ml-2">{contractDetails.billingCycle}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContractDetails;
