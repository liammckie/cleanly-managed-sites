
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ContractSummaryData, ContractData } from '@/lib/types/contracts';

interface ContractSummarySectionProps {
  summaryData: ContractSummaryData;
  contractData: ContractData[];
  isLoading: boolean;
}

export function ContractSummarySection({ 
  summaryData, 
  contractData, 
  isLoading 
}: ContractSummarySectionProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="p-3">
              <CardTitle><Skeleton className="h-6 w-40" /></CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <Skeleton className="h-12 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="p-3">
          <CardTitle className="text-base">Total Active Contracts</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <p className="text-3xl font-bold">{summaryData.activeCount || 0}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="p-3">
          <CardTitle className="text-base">Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <p className="text-3xl font-bold">
            ${(summaryData.totalValue / 12).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="p-3">
          <CardTitle className="text-base">Expiring This Month</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <p className="text-3xl font-bold">{summaryData.expiringThisMonth || 0}</p>
          <p className="text-sm text-muted-foreground">
            ${(summaryData.valueExpiringThisMonth || 0).toLocaleString()} monthly
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="p-3">
          <CardTitle className="text-base">Expiring Next 3 Months</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <p className="text-3xl font-bold">{summaryData.expiringNext3Months || 0}</p>
          <p className="text-sm text-muted-foreground">
            ${(summaryData.valueExpiringNext3Months || 0).toLocaleString()} monthly
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
