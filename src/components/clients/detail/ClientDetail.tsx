
import React, { ErrorInfo, useState } from 'react';
import { useClientDetails } from '@/hooks/useClients';
import { useNavigate } from 'react-router-dom';
import { ClientHeader } from './ClientHeader';
import { ClientInfoCard } from './ClientInfoCard';
import { ClientNotesCard } from './ClientNotesCard';
import { ClientSitesCard } from './ClientSitesCard';
import { ClientContactsCard } from './ClientContactsCard';
import { ClientNotFoundState } from './ClientNotFoundState';
import { ClientErrorState } from './ClientErrorState';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import { clientsApi } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClientDetailProps {
  clientId: string;
}

// Error boundary for the contacts card
class ContactsErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Contacts component failed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Fallback component for when contacts can't be loaded
const ContactsFallback = ({ clientId }: { clientId: string }) => {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error loading contacts</AlertTitle>
      <AlertDescription>
        There was a problem loading the client contacts.
        <Button 
          variant="link"
          className="p-0 h-auto font-normal underline ml-2"
          onClick={() => window.location.reload()}
        >
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export function ClientDetail({ clientId }: ClientDetailProps) {
  const { client, sites, isLoading, isError, error, updateClient } = useClientDetails(clientId);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  // Handle client deletion
  const handleDelete = async () => {
    try {
      await clientsApi.deleteClient(clientId);
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client deleted successfully');
      navigate('/clients');
    } catch (err: any) {
      console.error('Error deleting client:', err);
      toast.error(`Failed to delete client: ${err.message}`);
    }
  };
  
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
      <ClientHeader 
        client={client} 
        onDelete={handleDelete} 
        isDeleting={false} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ClientInfoCard client={client} />
        <ClientNotesCard notes={client.notes} clientId={clientId} />
      </div>
      
      <ContactsErrorBoundary
        fallback={<ContactsFallback clientId={clientId} />}
      >
        <ClientContactsCard clientId={clientId} />
      </ContactsErrorBoundary>
      
      <ClientSitesCard sites={sites} clientId={clientId} />
    </div>
  );
}
