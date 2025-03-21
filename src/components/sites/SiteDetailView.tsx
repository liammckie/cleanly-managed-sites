
import React from 'react';
import { SiteRecord } from '@/lib/api';
import { SiteDetailHeader } from './detail/SiteDetailHeader';
import { SiteDetailTabs } from './detail/SiteDetailTabs';

export function SiteDetailView({ site }: { site: SiteRecord }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <SiteDetailHeader site={site} />
      <SiteDetailTabs site={site} />
    </div>
  );
}
