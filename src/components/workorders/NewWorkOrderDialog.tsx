
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SiteRecord } from '@/lib/types';
import { WorkOrderForm } from './WorkOrderForm';
import { SiteSelector } from './site-selection/SiteSelector';

interface NewWorkOrderDialogProps {
  sites: SiteRecord[];
  onSuccess: () => void;
}

export const NewWorkOrderDialog = ({ sites: allSites, onSuccess }: NewWorkOrderDialogProps) => {
  const [selectedSite, setSelectedSite] = useState<SiteRecord | null>(null);

  if (allSites.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground mb-4">
          You need to create a site before you can create a work order.
        </p>
        <Button asChild>
          <a href="/sites/create">Create Site</a>
        </Button>
      </div>
    );
  }

  if (selectedSite) {
    return <WorkOrderForm site={selectedSite} onSuccess={onSuccess} />;
  }

  return <SiteSelector sites={allSites} onSiteSelect={setSelectedSite} />;
};
