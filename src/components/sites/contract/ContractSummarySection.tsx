
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContractData } from '@/lib/types/contracts';
import { ContractSummaryData } from '@/lib/types/contracts';
import { formatCurrency } from '@/lib/utils/formatters';

interface ContractSummarySectionProps {
  contractData: ContractData[];
  summaryData: ContractSummaryData;
  isLoading: boolean;
}

export function ContractSummarySection({ 
  contractData, 
  summaryData, 
  isLoading 
}: ContractSummarySectionProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-5 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded mb-2" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Contract Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summaryData.totalValue)}
          </div>
          <p className="text-xs text-muted-foreground">
            Monthly recurring revenue
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Active Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {contractData.filter(c => c.status === 'active').length}
          </div>
          <p className="text-xs text-muted-foreground">
            Out of {contractData.length} total contracts
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Expiring Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {summaryData.expiringNext3Months}
          </div>
          <p className="text-xs text-muted-foreground">
            Within the next 3 months
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">At Risk Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summaryData.valueExpiringNext3Months)}
          </div>
          <p className="text-xs text-muted-foreground">
            Expiring revenue in next 3 months
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
