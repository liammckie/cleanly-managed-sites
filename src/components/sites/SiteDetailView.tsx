
import React from 'react';
import { SiteRecord } from '@/lib/types';
import { SiteDetailHeader } from './detail/SiteDetailHeader';
import { SiteDetailTabs } from './detail/SiteDetailTabs';

interface SiteDetailViewProps {
  site: SiteRecord;
  isLoading: boolean;
  refetchSite: () => void;
}

const SiteDetailView: React.FC<SiteDetailViewProps> = ({
  site,
  isLoading,
  refetchSite,
}) => {
  return (
    <div className="space-y-6">
      <SiteDetailHeader site={site} isLoading={isLoading} />
      <SiteDetailTabs site={site} isLoading={isLoading} refetchSite={refetchSite} />
    </div>
  );
};

export default SiteDetailView;
