
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { SiteRecord } from '@/lib/types';

interface SiteGridProps {
  sites: SiteRecord[];
  handleSiteSelect: (siteId: string) => void;
}

export const SiteGrid = ({ sites, handleSiteSelect }: SiteGridProps) => {
  if (sites.length === 0) {
    return (
      <div className="col-span-full text-center py-8 text-muted-foreground">
        No sites found matching your criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {sites.map((site) => (
        <Card 
          key={site.id} 
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => handleSiteSelect(site.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium truncate">{site.name}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1 truncate">
              {site.client_name && (
                <span className="block font-medium">{site.client_name}</span>
              )}
              <span>
                {site.address}, {site.city}, {site.state}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
