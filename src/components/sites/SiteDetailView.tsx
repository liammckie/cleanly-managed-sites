
import React from 'react';
import { SiteRecord } from '@/lib/api';
import { SiteDetailHeader } from './detail/SiteDetailHeader';
import { SiteDetailTabs } from './detail/SiteDetailTabs';

export function SiteDetailView({ site }: { site: SiteRecord }) {
  // Validate site has a valid ID
  if (!site || !site.id) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Invalid site data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <SiteDetailHeader site={site} />
      <SiteDetailTabs site={site} />
    </div>
  );
}
