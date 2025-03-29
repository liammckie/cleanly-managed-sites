
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContractSummaryData } from '@/lib/types/contractTypes';
import { format } from 'date-fns';

interface ContractDashboardProps {
  summaryData: ContractSummaryData;
}

export const ContractDashboard: React.FC<ContractDashboardProps> = ({ summaryData }) => {
  const metrics = [
    {
      title: "Active Contracts",
      value: summaryData.activeCount,
      change: ((summaryData.activeCount / summaryData.totalContracts) * 100).toFixed(0) + "%",
      changeType: "increase"
    },
    {
      title: "Pending Contracts",
      value: summaryData.pendingCount,
      change: ((summaryData.pendingCount / summaryData.totalContracts) * 100).toFixed(0) + "%",
      changeType: "increase"
    },
    {
      title: "Total Contract Value",
      value: summaryData.totalValue,
      change: "+12%",
      changeType: "increase"
    },
    {
      title: "Expiring Soon",
      value: summaryData.expiringWithin30Days,
      change: "-5%",
      changeType: "decrease"
    }
  ];

  const forecastData = [
    { month: format(new Date(), 'MMM'), revenue: 5000, cost: 3000, profit: 2000 },
    { month: format(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'MMM'), revenue: 6000, cost: 3500, profit: 2500 },
    { month: format(new Date(new Date().setMonth(new Date().getMonth() + 2)), 'MMM'), revenue: 7000, cost: 4000, profit: 3000 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{metric.value}</div>
            <div className={`text-sm ${metric.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
              {metric.change}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
