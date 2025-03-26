
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteRecord } from '@/lib/types';
import { formatDate } from '@/lib/utils/date';
import { getContractStartDate, getContractEndDate, getContractType } from '@/lib/utils/contractDataUtils';

interface SiteOverviewProps {
  site: SiteRecord;
  isLoading: boolean;
}

const SiteOverview: React.FC<SiteOverviewProps> = ({ site, isLoading }) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Safely access contract details
  const startDate = getContractStartDate(site.contract_details);
  const endDate = getContractEndDate(site.contract_details);
  const contractType = getContractType(site.contract_details);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p className="text-sm">{site.address}</p>
              <p className="text-sm">{site.city}, {site.state} {site.postcode}</p>
              <p className="text-sm">{site.country}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contact</p>
              <p className="text-sm">{site.email}</p>
              <p className="text-sm">{site.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Contract Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contract Period</p>
              <p className="text-sm">
                {startDate ? formatDate(startDate) : 'Not set'} - {endDate ? formatDate(endDate) : 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contract Type</p>
              <p className="text-sm">{contractType || 'Standard'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Revenue</p>
              <p className="text-sm">
                {site.weekly_revenue ? `$${site.weekly_revenue.toFixed(2)} weekly` : 'Not set'}
                {site.monthly_revenue ? ` | $${site.monthly_revenue.toFixed(2)} monthly` : ''}
                {site.annual_revenue ? ` | $${site.annual_revenue.toFixed(2)} annually` : ''}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteOverview;
