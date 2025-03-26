
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function UserDetailSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-40" />
          <div className="space-x-2">
            <Skeleton className="h-9 w-20 inline-block" />
            <Skeleton className="h-9 w-20 inline-block" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center space-y-2">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-5 w-16" />
          </div>
          
          <div className="flex-1 space-y-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index}>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-5 w-40" />
                </div>
              ))}
            </div>
            
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
