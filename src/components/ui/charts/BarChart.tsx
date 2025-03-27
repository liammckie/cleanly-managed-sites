
import React from 'react';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface BarChartProps {
  data: any[];
  xField: string;
  yField: string;
  title?: string;
  valueFormatter?: (value: number) => string;
  height?: number | string;
}

export function BarChart({ 
  data, 
  xField, 
  yField, 
  title, 
  valueFormatter = (value) => `${value}`,
  height = '100%'
}: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xField} />
        <YAxis tickFormatter={(value) => valueFormatter(value)} />
        <Tooltip formatter={(value) => valueFormatter(value as number)} />
        {title && <Legend />}
        <Bar dataKey={yField} name={title || yField} fill="#4f46e5" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
