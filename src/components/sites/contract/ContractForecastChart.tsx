
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ContractForecast } from '../forms/types/contractTypes';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface ContractForecastChartProps {
  forecast: ContractForecast[];
  isLoading: boolean;
}

export function ContractForecastChart({ forecast, isLoading }: ContractForecastChartProps) {
  if (isLoading) {
    return (
      <Card className="w-full h-96">
        <CardHeader>
          <CardTitle>Contract Revenue Forecast</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-72">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  const chartConfig = {
    revenue: { label: 'Revenue', theme: { light: '#4ade80', dark: '#4ade80' } },
    cost: { label: 'Cost', theme: { light: '#f87171', dark: '#f87171' } },
    profit: { label: 'Profit', theme: { light: '#60a5fa', dark: '#60a5fa' } },
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>12-Month Contract Revenue Forecast</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ChartContainer config={chartConfig} className="h-full">
          <BarChart
            data={forecast}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  payload={payload}
                  label={label}
                  labelKey="month"
                  labelFormatter={(value) => `${value}`}
                />
              )}
            />
            <Legend />
            <Bar dataKey="revenue" name="Revenue" fill="var(--color-revenue)" />
            <Bar dataKey="cost" name="Cost" fill="var(--color-cost)" />
            <Bar dataKey="profit" name="Profit" fill="var(--color-profit)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
