
import React from 'react';
import { useParams } from 'react-router-dom';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import EditSiteForm from '@/components/sites/forms/EditSiteForm';
import { useSite } from '@/hooks/useSite';

const EditSite: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { site, isLoading, error } = useSite(id);

  if (isLoading) {
    return (
      <PageLayout>
        <div>Loading site details...</div>
      </PageLayout>
    );
  }

  if (error || !site) {
    return (
      <PageLayout>
        <div>Error loading site: {error?.message || 'Site not found'}</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <EditSiteForm initialData={site} siteId={id!} />
    </PageLayout>
  );
};

export default EditSite;
