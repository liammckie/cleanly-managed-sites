
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, DollarSign, PercentIcon, ClockIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContractSummary } from './types';

interface ContractSummaryCardsProps {
  summary: ContractSummary;
  isLoading?: boolean;
  onRenewClick?: () => void;
}

const ContractSummaryCards: React.FC<ContractSummaryCardsProps> = ({
  summary,
  isLoading = false,
  onRenewClick
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contract Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Loading...</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Loading...</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renewal Rate</CardTitle>
            <PercentIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Contract Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${summary.totalValue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Annual value across all active contracts
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          <ClockIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.expiringWithin30Days}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Contracts expiring within 30 days
          </p>
        </CardContent>
        <CardFooter>
          {summary.expiringWithin30Days > 0 && onRenewClick && (
            <Button variant="outline" size="sm" className="w-full" onClick={onRenewClick}>
              <CalendarIcon className="h-3 w-3 mr-1" />
              Schedule Renewals
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Renewal Rate</CardTitle>
          <PercentIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.renewalRate}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            Current contract renewal success rate
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractSummaryCards;
