
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { MapPin, Building, Calendar } from 'lucide-react';
import { SiteRecord } from '@/lib/types';

export interface SiteCardProps {
  site: SiteRecord;
  clientName: string;
  statusBadge: React.ReactNode;
  onClick: () => void;
}

export function SiteCard({ site, clientName, statusBadge, onClick }: SiteCardProps) {
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-semibold truncate">{site.name}</h3>
          {statusBadge}
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <Building className="h-4 w-4" />
          {clientName}
        </p>
      </CardHeader>
      
      <CardContent className="pb-2 flex-1">
        {site.address && (
          <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
            <MapPin className="h-4 w-4" />
            {site.address}
          </p>
        )}
        
        {site.created_at && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Added {new Date(site.created_at).toLocaleDateString()}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 border-t border-border">
        <div className="w-full flex justify-between text-xs">
          <span className="text-muted-foreground">ID: {site.id.substring(0, 8)}...</span>
          {site.contract_status && (
            <span className="font-medium">{site.contract_status}</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
