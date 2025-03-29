
import React from 'react';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import CreateSiteForm from '@/components/sites/forms/CreateSiteForm';

const CreateSite: React.FC = () => {
  return (
    <PageLayout>
      <CreateSiteForm />
    </PageLayout>
  );
};

export default CreateSite;
