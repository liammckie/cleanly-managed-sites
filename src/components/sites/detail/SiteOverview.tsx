
import React from 'react';
import { SiteRecord } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateToLocal } from '@/lib/utils/date';

interface SiteOverviewProps {
  site: SiteRecord;
  refetchSite: () => void;
}

export const SiteOverview: React.FC<SiteOverviewProps> = ({ site, refetchSite }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Site Name</h3>
              <p>{site.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
              <p>{site.client_name || 'Not assigned'}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
            <p>
              {site.address && `${site.address}, `}
              {site.city && `${site.city}, `}
              {site.state && `${site.state} `}
              {site.postcode && site.postcode}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p>{site.email || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
              <p>{site.phone || 'Not provided'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
              <p>{site.created_at ? formatDateToLocal(site.created_at) : 'Unknown'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
              <p>{site.updated_at ? formatDateToLocal(site.updated_at) : 'Unknown'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Weekly Revenue</h3>
              <p className="text-lg font-medium">
                ${site.weekly_revenue ? site.weekly_revenue.toFixed(2) : '0.00'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Monthly Revenue</h3>
              <p className="text-lg font-medium">
                ${site.monthly_revenue ? site.monthly_revenue.toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Annual Revenue</h3>
              <p className="text-lg font-medium">
                ${site.annual_revenue ? site.annual_revenue.toFixed(2) : '0.00'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Monthly Cost</h3>
              <p className="text-lg font-medium">
                ${site.monthly_cost ? site.monthly_cost.toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Monthly Profit</h3>
            <p className="text-lg font-medium">
              ${(site.monthly_revenue && site.monthly_cost) 
                ? (site.monthly_revenue - site.monthly_cost).toFixed(2) 
                : '0.00'}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Profit Margin</h3>
            <p className="text-lg font-medium">
              {(site.monthly_revenue && site.monthly_cost && site.monthly_revenue > 0) 
                ? `${(((site.monthly_revenue - site.monthly_cost) / site.monthly_revenue) * 100).toFixed(2)}%` 
                : '0.00%'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
