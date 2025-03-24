
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SiteRecord } from '@/lib/types';
import { WorkOrderForm } from './WorkOrderForm';
import { SiteSelector } from './site-selection/SiteSelector';
import { getTemplateById } from '@/lib/templates/workOrderTemplates';

interface NewWorkOrderDialogProps {
  sites: SiteRecord[];
  onSuccess: () => void;
}

export const NewWorkOrderDialog = ({ sites: allSites, onSuccess }: NewWorkOrderDialogProps) => {
  const [searchParams] = useSearchParams();
  const [selectedSite, setSelectedSite] = useState<SiteRecord | null>(null);
  
  // Get site ID and template ID from URL if they exist
  const siteId = searchParams.get('site');
  const templateId = searchParams.get('template');
  
  // If siteId is provided in URL, find and select that site
  useEffect(() => {
    if (siteId) {
      const site = allSites.find(s => s.id === siteId);
      if (site) {
        setSelectedSite(site);
      }
    }
  }, [siteId, allSites]);

  // Make sure we have valid sites for rendering
  const validSites = allSites.filter(site => site && site.id);

  if (validSites.length === 0) {
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
    // Pass templateId to WorkOrderForm
    return <WorkOrderForm 
      site={selectedSite} 
      onSuccess={onSuccess} 
      templateId={templateId || undefined}
    />;
  }

  return <SiteSelector sites={validSites} onSiteSelect={setSelectedSite} />;
};
