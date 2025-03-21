
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SiteCard } from '@/components/sites/SiteCard';
import { SiteRecord } from '@/lib/types';
import { Building2, Plus } from 'lucide-react';

interface ClientSitesCardProps {
  clientId: string;
  sites: SiteRecord[];
}

export function ClientSitesCard({ clientId, sites }: ClientSitesCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Sites</CardTitle>
          <CardDescription>Sites managed for this client</CardDescription>
        </div>
        
        <Button asChild size="sm" className="gap-1">
          <Link to={`/sites/create?client=${clientId}`}>
            <Plus size={16} />
            <span>Add Site</span>
          </Link>
        </Button>
      </CardHeader>
      
      <CardContent>
        {sites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sites.map(site => (
              <SiteCard
                key={site.id}
                id={site.id}
                name={site.name}
                address={site.address}
                city={site.city}
                status={site.status as any}
                representative={site.representative}
                phone={site.phone}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
            <h3 className="mt-4 text-lg font-medium">No Sites Yet</h3>
            <p className="text-muted-foreground">
              This client doesn't have any sites yet.
            </p>
            <Button asChild className="mt-4">
              <Link to={`/sites/create?client=${clientId}`}>
                Add First Site
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
