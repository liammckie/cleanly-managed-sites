
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricItem {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

interface ContractMetricsListProps {
  metrics: MetricItem[];
}

export function ContractMetricsList({ metrics }: ContractMetricsListProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              {metric.trend && (
                <div 
                  className={`text-xs font-medium ${
                    metric.trend === 'up' 
                      ? 'text-green-500' 
                      : metric.trend === 'down' 
                        ? 'text-red-500' 
                        : 'text-gray-500'
                  }`}
                >
                  {metric.trend === 'up' && '↑'}
                  {metric.trend === 'down' && '↓'}
                  {metric.trend === 'neutral' && '→'}
                  {metric.trendValue && ` ${metric.trendValue}`}
                </div>
              )}
            </div>
            <p className="text-2xl font-bold mt-1">{metric.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
