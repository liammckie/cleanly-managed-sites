
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ValueCardProps {
  title: string;
  value: string;
  description?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
}

export function ValueCard({ title, value, description, loading, icon, trend }: ValueCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        
        <div className="mt-2">
          {loading ? (
            <Skeleton className="h-9 w-24" />
          ) : (
            <div className="text-2xl font-bold">{value}</div>
          )}
        </div>
        
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        )}
        
        {trend && !loading && (
          <div className="mt-2 flex items-center">
            <div className={`text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'} font-medium`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </div>
            <div className="ml-1 text-xs text-muted-foreground">
              {trend.label}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
