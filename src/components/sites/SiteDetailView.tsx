
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SiteDetailTabs from './detail/SiteDetailTabs';

interface SiteDetailViewProps {
  site: any;
  isLoading: boolean;
  refetchSite: () => void;
}

export default function SiteDetailView({ site, isLoading, refetchSite }: SiteDetailViewProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!site) {
    return <div>Site not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{site.name}</h1>
          <p className="text-muted-foreground">
            {site.address}, {site.city}, {site.state} {site.postcode}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex h-2 w-2 rounded-full ${site.status === 'active' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
          <span className="capitalize">{site.status}</span>
        </div>
      </div>

      <SiteDetailTabs site={site} refetchSite={refetchSite} />
    </div>
  );
}
