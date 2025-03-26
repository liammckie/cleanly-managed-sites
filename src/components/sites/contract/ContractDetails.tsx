
import React from 'react';
import { SiteRecord } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, addMonths, differenceInDays } from 'date-fns';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { getContractField } from '@/lib/utils/contractUtils';

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

  const startDate = getContractField(contractDetails, 'startDate', null);
  const startDateObj = startDate ? new Date(startDate) : null;
  
  const endDate = getContractField(contractDetails, 'endDate', null);
  const endDateObj = endDate ? new Date(endDate) : null;
  
  // Calculate if the contract is expiring soon (within 60 days)
  const isExpiringSoon = endDateObj && differenceInDays(endDateObj, new Date()) <= 60;
  
  // Determine renewal period text
  const getRenewalPeriodText = () => {
    const autoRenewal = getContractField(contractDetails, 'autoRenewal', false);
    if (!autoRenewal) return 'No automatic renewal';
    
    const renewalPeriod = getContractField(contractDetails, 'renewalPeriod', '');
    const noticeUnit = getContractField(contractDetails, 'noticeUnit', 'months');
    
    return `Auto-renews every ${renewalPeriod || ''} ${noticeUnit || 'months'}`;
  };
  
  // Calculate the badge status and style
  const getBadgeVariant = () => {
    if (!endDateObj) return "secondary";
    
    const today = new Date();
    
    if (endDateObj < today) {
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
          {endDateObj && (
            <Badge variant={getBadgeVariant()}>
              {endDateObj < new Date() 
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
                <span>{startDateObj ? format(startDateObj, 'PP') : 'Not specified'}</span>
              </div>
              <div className="flex items-center text-sm">
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-muted-foreground w-24">End Date:</span>
                <span>{endDateObj ? format(endDateObj, 'PP') : 'Not specified'}</span>
              </div>
              {getContractField(contractDetails, 'contractLength', 0) && (
                <div className="flex items-center text-sm">
                  <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground w-24">Duration:</span>
                  <span>
                    {getContractField(contractDetails, 'contractLength', 0)} {' '}
                    {getContractField(contractDetails, 'contractLengthUnit', 'months')}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Renewal Terms</h3>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium text-muted-foreground">Auto Renewal:</span>
                <span className="ml-2">{getContractField(contractDetails, 'autoRenewal', false) ? 'Yes' : 'No'}</span>
              </div>
              {getContractField(contractDetails, 'autoRenewal', false) && (
                <div className="text-sm">
                  <span className="font-medium text-muted-foreground">Renewal Period:</span>
                  <span className="ml-2">
                    {getContractField(contractDetails, 'renewalPeriod', '')} {' '}
                    {getContractField(contractDetails, 'noticeUnit', '')}
                  </span>
                </div>
              )}
              {getContractField(contractDetails, 'renewalNotice', null) && (
                <div className="text-sm">
                  <span className="font-medium text-muted-foreground">Notice Required:</span>
                  <span className="ml-2">
                    {getContractField(contractDetails, 'renewalNotice', '')} {' '}
                    {getContractField(contractDetails, 'noticeUnit', '')}
                  </span>
                </div>
              )}
              {getContractField(contractDetails, 'terminationPeriod', null) && (
                <div className="text-sm">
                  <span className="font-medium text-muted-foreground">Termination Period:</span>
                  <span className="ml-2">{getContractField(contractDetails, 'terminationPeriod', '')}</span>
                </div>
              )}
              {getContractField(contractDetails, 'renewalTerms', null) && (
                <div className="text-sm">
                  <span className="font-medium text-muted-foreground">Renewal Terms:</span>
                  <span className="ml-2">{getContractField(contractDetails, 'renewalTerms', '')}</span>
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
              <span className="ml-2">{getContractField(contractDetails, 'serviceFrequency', '') || 'Not specified'}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-muted-foreground">Delivery Method:</span>
              <span className="ml-2">{getContractField(contractDetails, 'serviceDeliveryMethod', '') || 'Not specified'}</span>
            </div>
          </div>
        </div>
        
        {getContractField(contractDetails, 'value', null) && (
          <div>
            <h3 className="font-medium mb-2">Financial Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-sm">
                <span className="font-medium text-muted-foreground">Contract Value:</span>
                <span className="ml-2">${getContractField(contractDetails, 'value', 0).toFixed(2)}</span>
              </div>
              {getContractField(contractDetails, 'billingCycle', null) && (
                <div className="text-sm">
                  <span className="font-medium text-muted-foreground">Billing Cycle:</span>
                  <span className="ml-2">{getContractField(contractDetails, 'billingCycle', '')}</span>
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
