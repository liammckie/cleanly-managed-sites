
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils/format';

// Define the ContractForecast type locally to avoid dependency issues
interface ContractForecast {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

interface ContractForecastChartProps {
  data: ContractForecast[];
}

export function ContractForecastChart({ data }: ContractForecastChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500">
        No forecast data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => formatCurrency(value, { notation: 'compact' })} />
        <Tooltip formatter={(value) => formatCurrency(value as number)} />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          stackId="1" 
          stroke="#4f46e5" 
          fill="#818cf8" 
          name="Revenue" 
        />
        <Area 
          type="monotone" 
          dataKey="cost" 
          stackId="2" 
          stroke="#ef4444" 
          fill="#fca5a5" 
          name="Cost" 
        />
        <Area 
          type="monotone" 
          dataKey="profit" 
          stackId="3" 
          stroke="#22c55e" 
          fill="#86efac" 
          name="Profit" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
