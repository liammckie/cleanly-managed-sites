
import React from 'react';
import { useParams } from 'react-router-dom';
import { EditSiteForm } from '@/components/sites/forms/EditSiteForm';

const EditSite: React.FC = () => {
  const { siteId } = useParams<{ siteId: string }>();
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Site</h1>
      <EditSiteForm />
    </div>
  );
}

export default EditSite;
