
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContractForecastChart } from './ContractForecastChart';
import { BarChart } from '@/components/ui/charts/BarChart';
import { ContractMetricsList } from './ContractMetricsList';
import { useContractForecast } from '@/hooks/useContractForecast';
import { formatCurrency } from '@/lib/utils/format';

export function ContractDashboard() {
  const { forecastData, summaryData } = useContractForecast();
  
  // Make sure we have complete summary data
  const enhancedSummaryData = {
    totalContracts: summaryData?.totalContracts || 0,
    activeCount: summaryData?.activeCount || 0,
    totalValue: summaryData?.totalValue || 0,
    expiringThisMonth: summaryData?.expiringThisMonth || 0,
    expiringNext3Months: summaryData?.expiringNext3Months || 0,
    expiringNext6Months: summaryData?.expiringNext6Months || 0,
    expiringThisYear: summaryData?.expiringThisYear || 0,
    valueExpiringThisMonth: summaryData?.valueExpiringThisMonth || 0,
    valueExpiringNext3Months: summaryData?.valueExpiringNext3Months || 0,
    valueExpiringNext6Months: summaryData?.valueExpiringNext6Months || 0,
    valueExpiringThisYear: summaryData?.valueExpiringThisYear || 0,
    totalRevenue: summaryData?.totalRevenue || 0,
    totalCost: summaryData?.totalCost || 0,
    totalProfit: summaryData?.totalProfit || 0,
    avgContractValue: summaryData?.avgContractValue || 0,
    profitMargin: summaryData?.profitMargin || 0,
    pendingCount: 0, // Default value
  };
  
  const chartData = [
    { name: 'This Month', value: enhancedSummaryData.expiringThisMonth },
    { name: '3 Months', value: enhancedSummaryData.expiringNext3Months },
    { name: '6 Months', value: enhancedSummaryData.expiringNext6Months },
    { name: '12 Months', value: enhancedSummaryData.expiringThisYear },
  ];

  const valueChartData = [
    { name: 'This Month', value: enhancedSummaryData.valueExpiringThisMonth },
    { name: '3 Months', value: enhancedSummaryData.valueExpiringNext3Months },
    { name: '6 Months', value: enhancedSummaryData.valueExpiringNext6Months },
    { name: '12 Months', value: enhancedSummaryData.valueExpiringThisYear },
  ];

  const overviewMetrics = [
    { label: 'Total Contracts', value: enhancedSummaryData.totalContracts.toString() },
    { label: 'Active Contracts', value: enhancedSummaryData.activeCount.toString() },
    { label: 'Total Value', value: formatCurrency(enhancedSummaryData.totalValue) },
    { label: 'Avg Contract Value', value: formatCurrency(enhancedSummaryData.avgContractValue) },
  ];

  const expiryMetrics = [
    { label: 'Expiring This Month', value: enhancedSummaryData.expiringThisMonth.toString() },
    { label: 'Expiring in 3 Months', value: enhancedSummaryData.expiringNext3Months.toString() },
    { label: 'Expiring in 6 Months', value: enhancedSummaryData.expiringNext6Months.toString() },
    { label: 'Expiring This Year', value: enhancedSummaryData.expiringThisYear.toString() },
  ];

  const valueMetrics = [
    { label: 'Value Expiring This Month', value: formatCurrency(enhancedSummaryData.valueExpiringThisMonth) },
    { label: 'Value Expiring in 3 Months', value: formatCurrency(enhancedSummaryData.valueExpiringNext3Months) },
    { label: 'Value Expiring in 6 Months', value: formatCurrency(enhancedSummaryData.valueExpiringNext6Months) },
    { label: 'Value Expiring This Year', value: formatCurrency(enhancedSummaryData.valueExpiringThisYear) },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Contract Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary">
            <TabsList className="mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="expiry">Expiry Metrics</TabsTrigger>
              <TabsTrigger value="value">Value at Risk</TabsTrigger>
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ContractMetricsList metrics={overviewMetrics} />
                <div className="h-60">
                  <BarChart 
                    data={chartData} 
                    xField="name" 
                    yField="value" 
                    title="Expiry Count" 
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="expiry">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ContractMetricsList metrics={expiryMetrics} />
                <div className="h-60">
                  <BarChart 
                    data={chartData} 
                    xField="name" 
                    yField="value" 
                    title="Expiry Count" 
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="value">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ContractMetricsList metrics={valueMetrics} />
                <div className="h-60">
                  <BarChart 
                    data={valueChartData} 
                    xField="name" 
                    yField="value" 
                    title="Value at Risk" 
                    valueFormatter={(value) => formatCurrency(value)}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="forecast">
              <div className="h-80">
                <ContractForecastChart data={forecastData} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
