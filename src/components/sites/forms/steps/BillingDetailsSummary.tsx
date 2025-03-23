
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BillingDetails } from '../types/billingTypes';
import { isSiteBillingOnHold } from '@/lib/utils/billingCalculations';
import { PauseCircle, UserCheck, Users, Briefcase } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

interface BillingDetailsSummaryProps {
  billingDetails: BillingDetails;
  contractType?: string;
}

export function BillingDetailsSummary({ billingDetails, contractType = 'cleaning' }: BillingDetailsSummaryProps) {
  const isBillingOnHold = isSiteBillingOnHold(
    billingDetails.billingOnHold,
    billingDetails.billingHoldStartDate,
    billingDetails.billingHoldEndDate
  );

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  // Map contract type to display name
  const getContractTypeDisplay = (type?: string) => {
    const contractTypes: Record<string, string> = {
      'cleaning': 'Cleaning',
      'pest': 'Pest Control',
      'grounds': 'Grounds Maintenance',
      'waste': 'Waste Management',
      'hygiene': 'Hygiene Services',
      'gardening': 'Gardening',
      'security': 'Security',
      'other': 'Other'
    };
    
    return contractTypes[type || 'cleaning'] || 'Cleaning';
  };

  return (
    <Card className="bg-slate-50 mb-4">
      <CardContent className="pt-4">
        {isBillingOnHold && (
          <div className="mb-3 bg-yellow-100 text-yellow-800 px-3 py-2 rounded flex items-center">
            <PauseCircle size={16} className="mr-2" />
            <span>
              Billing On Hold
              {billingDetails.billingHoldStartDate && ` since ${formatDate(billingDetails.billingHoldStartDate)}`}
              {billingDetails.billingHoldEndDate && ` until ${formatDate(billingDetails.billingHoldEndDate)}`}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 mb-3">
          <div className={`px-3 py-1 rounded text-sm font-medium flex items-center ${
            billingDetails.serviceDeliveryType === 'contractor' 
              ? 'bg-orange-100 text-orange-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {billingDetails.serviceDeliveryType === 'contractor' ? (
              <>
                <Users size={14} className="mr-1" />
                <span>Contractor Delivery</span>
              </>
            ) : (
              <>
                <UserCheck size={14} className="mr-1" />
                <span>Direct Delivery</span>
              </>
            )}
          </div>
          
          <div className="px-3 py-1 rounded text-sm font-medium flex items-center bg-blue-100 text-blue-800">
            <Briefcase size={14} className="mr-1" />
            <span>{getContractTypeDisplay(contractType)}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">Weekly Revenue</p>
            <div className="text-lg font-semibold">
              {formatCurrency(billingDetails.totalWeeklyAmount || 0, 'AUD')}
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">Monthly Revenue</p>
            <div className="text-lg font-semibold">
              {formatCurrency(billingDetails.totalMonthlyAmount || 0, 'AUD')}
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">Annual Revenue</p>
            <div className="text-lg font-semibold">
              {formatCurrency(billingDetails.totalAnnualAmount || 0, 'AUD')}
            </div>
          </div>
        </div>

        <div className="flex justify-between p-2 bg-slate-100 rounded">
          <span className="text-sm font-medium">Payment Terms:</span>
          <span className="text-sm">
            {billingDetails.paymentTerms || 'Not specified'} ({billingDetails.billingFrequency || 'monthly'})
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
