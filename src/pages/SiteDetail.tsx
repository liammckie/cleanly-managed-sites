
import React from 'react';
import { useParams } from 'react-router-dom';

const SiteDetail: React.FC = () => {
  const { siteId } = useParams<{ siteId: string }>();
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Site Details</h1>
      <p className="text-gray-600">Viewing site ID: {siteId}</p>
    </div>
  );
}

export default SiteDetail;
