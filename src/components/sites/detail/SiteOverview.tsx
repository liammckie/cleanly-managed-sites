
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteRecord } from '@/lib/types';
import { formatDate } from '@/lib/utils/date';

interface SiteOverviewProps {
  site: SiteRecord;
  isLoading: boolean;
}

export const SiteOverview: React.FC<SiteOverviewProps> = ({ site, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Loading site overview data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const contractDetails = site.contract_details && typeof site.contract_details === 'object' 
    ? site.contract_details 
    : {};
  
  const startDate = contractDetails.startDate 
    ? formatDate(contractDetails.startDate) 
    : 'Not specified';
    
  const endDate = contractDetails.endDate 
    ? formatDate(contractDetails.endDate) 
    : 'Not specified';
    
  const contractType = contractDetails.contractType || 'Standard';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Address</h3>
            <p className="text-sm">
              {site.address}<br />
              {site.city}, {site.state} {site.postcode}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Contact</h3>
            <p className="text-sm">
              {site.email && (
                <>Email: {site.email}<br /></>
              )}
              {site.phone && (
                <>Phone: {site.phone}<br /></>
              )}
              {site.representative && (
                <>Representative: {site.representative}</>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Contract Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Contract Period</h3>
            <p className="text-sm">
              Start Date: {startDate}<br />
              End Date: {endDate}<br />
              Contract Type: {contractType}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Financial</h3>
            <p className="text-sm">
              Weekly Revenue: ${site.weekly_revenue?.toFixed(2) || '0.00'}<br />
              Monthly Revenue: ${site.monthly_revenue?.toFixed(2) || '0.00'}<br />
              Annual Revenue: ${site.annual_revenue?.toFixed(2) || '0.00'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
