
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from '@/lib/utils/date';
import { getContractField } from '@/lib/utils/contractUtils';
import { SiteRecord } from '@/lib/types';

interface SiteOverviewProps {
  site: SiteRecord;
}

const SiteOverview: React.FC<SiteOverviewProps> = ({ site }) => {
  // Format revenue numbers for display
  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const weeklyRevenue = formatCurrency(site.weekly_revenue);
  const monthlyRevenue = formatCurrency(site.monthly_revenue);
  const annualRevenue = formatCurrency(site.annual_revenue);

  // Get contract details
  const startDate = getContractField(site.contract_details, 'startDate', '');
  const endDate = getContractField(site.contract_details, 'endDate', '');
  const contractType = getContractField(site.contract_details, 'contractType', 'Standard');

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Site Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-2">Basic Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium">{site.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Address:</span>
              <span className="font-medium text-right">{site.address}, {site.city}, {site.state} {site.postcode}</span>
            </div>
            {site.phone && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{site.phone}</span>
              </div>
            )}
            {site.email && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{site.email}</span>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Contract & Billing</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Start Date:</span>
              <span className="font-medium">{startDate ? formatDate(startDate) : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">End Date:</span>
              <span className="font-medium">{endDate ? formatDate(endDate) : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contract Type:</span>
              <span className="font-medium">{contractType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Weekly Revenue:</span>
              <span className="font-medium">{weeklyRevenue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monthly Revenue:</span>
              <span className="font-medium">{monthlyRevenue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Annual Revenue:</span>
              <span className="font-medium">{annualRevenue}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteOverview;
