
import React from 'react';
import { CreateSiteForm } from '@/components/sites/forms/CreateSiteForm';

const CreateSite: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Site</h1>
      <CreateSiteForm />
    </div>
  );
}

export default CreateSite;
