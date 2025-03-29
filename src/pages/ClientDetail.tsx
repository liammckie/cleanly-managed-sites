
import React from 'react';
import { useParams } from 'react-router-dom';

const ClientDetail: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Client Details</h1>
      <p className="text-gray-600">Viewing client ID: {clientId}</p>
    </div>
  );
}

export default ClientDetail;
