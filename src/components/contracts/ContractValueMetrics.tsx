
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useContractForecast } from '@/hooks/useContractForecast';
import { useSites } from '@/hooks/useSites';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { DollarSign, Calendar, TrendingUp } from 'lucide-react';

export function ContractValueMetrics() {
  const { sites, isLoading: sitesLoading } = useSites();
  const { summary, summaryData } = useContractForecast(sites);
  
  // Use the correct data from the hook (summary or summaryData)
  const contractSummary = summary || summaryData;
  
  if (sitesLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <LoadingSpinner />
      </div>
    );
  }
  
  // Calculate weekly, monthly and annual values
  const weeklyRevenue = (contractSummary.totalValue / 4.33).toFixed(2);
  const weeklyProfit = ((contractSummary.totalValue - (sites?.reduce((sum, site) => sum + (site.monthly_cost || 0), 0) || 0)) / 4.33).toFixed(2);
  const monthlyRevenue = contractSummary.totalValue.toFixed(2);
  const monthlyCost = (sites?.reduce((sum, site) => sum + (site.monthly_cost || 0), 0) || 0).toFixed(2);
  const monthlyProfit = (contractSummary.totalValue - parseFloat(monthlyCost)).toFixed(2);
  const annualRevenue = (contractSummary.totalValue * 12).toFixed(2);
  const annualCost = (parseFloat(monthlyCost) * 12).toFixed(2);
  const annualProfit = (parseFloat(monthlyProfit) * 12).toFixed(2);
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Contract Value Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Weekly</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Revenue:</span>
              <span className="font-medium">${weeklyRevenue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Cost:</span>
              <span className="font-medium">${(parseFloat(monthlyCost) / 4.33).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Profit:</span>
              <span className="font-medium">${weeklyProfit}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Monthly</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Revenue:</span>
              <span className="font-medium">${monthlyRevenue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Cost:</span>
              <span className="font-medium">${monthlyCost}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Profit:</span>
              <span className="font-medium">${monthlyProfit}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Annual</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Revenue:</span>
              <span className="font-medium">${annualRevenue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Cost:</span>
              <span className="font-medium">${annualCost}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Profit:</span>
              <span className="font-medium">${annualProfit}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
