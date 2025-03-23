
import React from 'react';
import { useClientDetails } from '@/hooks/useClients';
import { ClientHeader } from './ClientHeader';
import { ClientInfoCard } from './ClientInfoCard';
import { ClientNotesCard } from './ClientNotesCard';
import { ClientSitesCard } from './ClientSitesCard';
import { ClientContactsCard } from './ClientContactsCard';
import { ClientNotFoundState } from './ClientNotFoundState';
import { ClientErrorState } from './ClientErrorState';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function ClientDetail({ clientId }: { clientId: string }) {
  const { client, sites, isLoading, isError, error } = useClientDetails(clientId);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (isError) {
    return <ClientErrorState error={error} />;
  }
  
  if (!client) {
    return <ClientNotFoundState clientId={clientId} />;
  }
  
  return (
    <div className="space-y-6">
      <ClientHeader client={client} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ClientInfoCard client={client} />
        <ClientNotesCard client={client} />
      </div>
      
      <ClientContactsCard clientId={clientId} />
      
      <ClientSitesCard sites={sites} clientId={clientId} />
    </div>
  );
}
