
import React from 'react';
import { useParams } from 'react-router-dom';

const SiteEdit = () => {
  const { siteId } = useParams();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Site {siteId}</h1>
      <p>Site editing functionality is being implemented.</p>
    </div>
  );
};

export default SiteEdit;
