
import React from 'react';
import { Bar, BarChart as ReChartsBar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface BarChartProps {
  data: any[];
  xField: string;
  yField: string;
  title?: string;
  valueFormatter?: (value: number) => string;
  color?: string;
}

export function BarChart({ 
  data, 
  xField, 
  yField, 
  title, 
  valueFormatter = (value) => value.toString(),
  color = "#4f46e5" 
}: BarChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full">No data available</div>;
  }

  return (
    <div className="w-full h-full">
      {title && <h3 className="text-sm font-medium mb-2">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <ReChartsBar
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey={xField} 
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            fontSize={12}
            tick={{ fill: '#888' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tickFormatter={valueFormatter}
            fontSize={12}
            tick={{ fill: '#888' }}
          />
          <Tooltip 
            formatter={(value: number) => valueFormatter(value)}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Bar 
            dataKey={yField} 
            radius={[4, 4, 0, 0]} 
            fill={color} 
          />
        </ReChartsBar>
      </ResponsiveContainer>
    </div>
  );
}
