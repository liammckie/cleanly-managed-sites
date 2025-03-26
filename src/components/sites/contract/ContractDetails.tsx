
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CalendarIcon, Check, Clock } from 'lucide-react';

interface ContractDetailsProps {
  site: any;
  refetchSite: () => void;
}

export default function ContractDetails({ site, refetchSite }: ContractDetailsProps) {
  if (!site || !site.contract_details) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contract Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">No contract details available</div>
        </CardContent>
      </Card>
    );
  }

  const contractDetails = site.contract_details;
  
  // Format dates for display
  const startDate = contractDetails.startDate ? format(new Date(contractDetails.startDate), 'PP') : 'Not set';
  const endDate = contractDetails.endDate ? format(new Date(contractDetails.endDate), 'PP') : 'Not set';
  
  // Calculate days remaining if end date exists
  const daysRemaining = contractDetails.endDate 
    ? Math.ceil((new Date(contractDetails.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;
  
  // Determine badge color based on days remaining
  const getBadgeVariant = () => {
    if (!daysRemaining) return 'secondary';
    if (daysRemaining < 0) return 'destructive';
    if (daysRemaining < 30) return 'warning';
    return 'success';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Contract Details</CardTitle>
        {daysRemaining !== null && (
          <Badge variant={getBadgeVariant()} className="ml-auto">
            {daysRemaining < 0 
              ? `Expired ${Math.abs(daysRemaining)} days ago` 
              : `${daysRemaining} days remaining`}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Start Date</div>
              <div className="flex items-center mt-1">
                <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                <span>{startDate}</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">End Date</div>
              <div className="flex items-center mt-1">
                <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                <span>{endDate}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Contract Length</div>
              <div className="mt-1">
                {contractDetails.contractLength || 0} {contractDetails.contractLengthUnit || 'months'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Service Frequency</div>
              <div className="mt-1 capitalize">
                {contractDetails.serviceFrequency || 'Not specified'}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Auto Renewal</div>
              <div className="flex items-center mt-1">
                {contractDetails.autoRenewal ? (
                  <>
                    <Check className="h-4 w-4 mr-1 text-green-500" />
                    <span>Yes - {contractDetails.renewalPeriod} {contractDetails.renewalPeriod === 1 ? 'month' : 'months'}</span>
                  </>
                ) : (
                  <span>No</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Notice Period</div>
              <div className="flex items-center mt-1">
                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                <span>{contractDetails.renewalNotice || 0} {contractDetails.noticeUnit || 'days'}</span>
              </div>
            </div>
          </div>
          
          {contractDetails.terminationPeriod && (
            <div>
              <div className="text-sm font-medium text-gray-500">Termination Period</div>
              <div className="mt-1">{contractDetails.terminationPeriod}</div>
            </div>
          )}
          
          {contractDetails.renewalTerms && (
            <div>
              <div className="text-sm font-medium text-gray-500">Renewal Terms</div>
              <div className="mt-1">{contractDetails.renewalTerms}</div>
            </div>
          )}
          
          {contractDetails.serviceDeliveryMethod && (
            <div>
              <div className="text-sm font-medium text-gray-500">Service Delivery Method</div>
              <div className="mt-1 capitalize">{contractDetails.serviceDeliveryMethod.replace('_', ' ')}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
