
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { ContractData } from '@/lib/types/contracts';
import { GroupedContracts } from '@/hooks/useContracts';
import { asJsonObject } from '@/lib/utils/json';

interface ContractChartsProps {
  contractData: ContractData[];
  groupedContracts: GroupedContracts;
  isLoading: boolean;
}

export function ContractCharts({ 
  contractData, 
  groupedContracts,
  isLoading 
}: ContractChartsProps) {
  if (isLoading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Contract Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </CardContent>
      </Card>
    );
  }

  // Prepare data for status distribution chart
  const statusData = Object.entries(groupedContracts.byStatus || {}).map(([status, contracts]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: contracts.length,
    color: getStatusColor(status)
  }));

  // Prepare data for expiry forecast chart
  const expiryData = Object.entries(groupedContracts.byMonth || {})
    .map(([monthKey, contracts]) => {
      const [month, year] = monthKey.split('-');
      return {
        name: `${getMonthName(parseInt(month))}, ${year}`,
        value: contracts.reduce((sum, contract) => sum + (contract.monthly_revenue || 0), 0),
        count: contracts.length
      };
    })
    .sort((a, b) => {
      const [monthA, yearA] = a.name.split(', ');
      const [monthB, yearB] = b.name.split(', ');
      return new Date(`${monthA} 1, ${yearA}`).getTime() - new Date(`${monthB} 1, ${yearB}`).getTime();
    })
    .slice(0, 6); // Show next 6 months

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Contract Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
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
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} contracts`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to get status color
function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return '#10b981'; // Green
    case 'pending':
      return '#f59e0b'; // Yellow/Amber
    case 'expired':
      return '#ef4444'; // Red
    case 'renewed':
      return '#3b82f6'; // Blue
    case 'on-hold':
      return '#9ca3af'; // Gray
    default:
      return '#8884d8'; // Default purple
  }
}

// Helper function to get month name
function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1] || '';
}
