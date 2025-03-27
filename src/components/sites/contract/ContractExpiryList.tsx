
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format, differenceInDays } from 'date-fns';
import { SiteRecord } from '@/lib/types';

interface ContractExpiryListProps {
  sites: SiteRecord[];
  isLoading: boolean;
}

export function ContractExpiryList({ sites, isLoading }: ContractExpiryListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Contract Expirations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center pb-2 border-b">
                <div>
                  <Skeleton className="h-5 w-40 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter out sites with valid contract end dates and sort by closeness to expiration
  const sitesWithExpirations = sites
    .filter(site => {
      // Handle contract_details safely
      if (!site.contract_details || typeof site.contract_details !== 'object') {
        return false;
      }
      // Cast to any to access endDate property
      const details = site.contract_details as any;
      return details && details.endDate;
    })
    .map(site => {
      const details = site.contract_details as any;
      const endDateStr = details.endDate as string;
      const endDate = new Date(endDateStr);
      const daysUntilExpiry = differenceInDays(endDate, new Date());
      
      return {
        ...site,
        endDate,
        daysUntilExpiry
      };
    })
    .filter(site => site.daysUntilExpiry > 0) // Only show future expirations
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)
    .slice(0, 5); // Show only the closest 5

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Contract Expirations</CardTitle>
      </CardHeader>
      <CardContent>
        {sitesWithExpirations.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No upcoming contract expirations found
          </p>
        ) : (
          <div className="space-y-4">
            {sitesWithExpirations.map(site => (
              <div key={site.id} className="flex justify-between items-center pb-2 border-b">
                <div>
                  <p className="font-medium">{site.name}</p>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {format(site.endDate, 'dd MMM yyyy')}
                  </p>
                </div>
                <ExpiryBadge daysRemaining={site.daysUntilExpiry} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ExpiryBadge({ daysRemaining }: { daysRemaining: number }) {
  let variant: "default" | "destructive" | "outline" | "secondary" = "default";
  let label = `${daysRemaining} days`;
  
  if (daysRemaining <= 30) {
    variant = "destructive";
  } else if (daysRemaining <= 60) {
    variant = "secondary";
  } else if (daysRemaining <= 90) {
    variant = "outline";
  }
  
  return <Badge variant={variant}>{label}</Badge>;
}
