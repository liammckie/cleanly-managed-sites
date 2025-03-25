
import React from 'react';

interface SiteListHeaderProps {
  siteCount: number;
}

export function SiteListHeader({ siteCount }: SiteListHeaderProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-bold tracking-tight">Sites</h1>
      <p className="text-muted-foreground">
        {siteCount === 0 
          ? 'No sites found' 
          : siteCount === 1 
            ? '1 site found' 
            : `${siteCount} sites found`}
      </p>
    </div>
  );
}
