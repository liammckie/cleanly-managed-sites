
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientDetails, useClients } from '@/hooks/useClients';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ClientHeader } from './ClientHeader';
import { ClientInfoCard } from './ClientInfoCard';
import { ClientNotesCard } from './ClientNotesCard';
import { ClientSitesCard } from './ClientSitesCard';
import { ClientErrorState } from './ClientErrorState';
import { ClientNotFoundState } from './ClientNotFoundState';

interface ClientDetailProps {
  clientId: string;
}

export function ClientDetail({ clientId }: ClientDetailProps) {
  const navigate = useNavigate();
  const { client, sites, isLoading, isError, error } = useClientDetails(clientId);
  const { deleteClient, isDeleting } = useClients();
  
  // Handle delete
  const handleDelete = () => {
    deleteClient(clientId, {
      onSuccess: () => {
        navigate('/clients');
      },
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (isError) {
    return <ClientErrorState error={error} />;
  }
  
  if (!client) {
    return <ClientNotFoundState />;
  }
  
  return (
    <div className="space-y-6">
      <ClientHeader 
        client={client} 
        onDelete={handleDelete} 
        isDeleting={isDeleting} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <ClientInfoCard client={client} />
          <ClientNotesCard notes={client.notes} />
        </div>
        
        <div className="lg:col-span-2">
          <ClientSitesCard clientId={clientId} sites={sites} />
        </div>
      </div>
    </div>
  );
}
