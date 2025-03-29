import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { ContractData, GroupedContracts } from '@/lib/types/contracts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface ContractChartsProps {
  contractData: ContractData[];
  groupedContracts: GroupedContracts;
  isLoading: boolean;
}

export function ContractCharts({ contractData, groupedContracts, isLoading }: ContractChartsProps) {
  // Transform the data for the status distribution chart
  const statusData = Object.entries(groupedContracts).map(([status, contracts]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: Array.isArray(contracts) ? contracts.length : 0
  }));

  // Calculate contract value distribution by status
  const valueByStatus = Object.entries(groupedContracts).map(([status, contracts]) => {
    let totalValue = 0;
    if (Array.isArray(contracts)) {
      totalValue = contracts.reduce((sum, contract) => sum + (parseFloat(contract.monthly_revenue?.toString() || '0') * 12), 0);
    }
    return {
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: totalValue,
      count: Array.isArray(contracts) ? contracts.length : 0
    };
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Contract Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Skeleton className="w-full h-full" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contract Value by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Skeleton className="w-full h-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Contract Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} contracts`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Contract Value by Status</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={valueByStatus}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, 'Annual Value']} 
              />
              <Legend />
              <Bar dataKey="value" name="Annual Value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
