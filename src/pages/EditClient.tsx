
import React from 'react';
import { useParams } from 'react-router-dom';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { ClientForm } from '@/components/clients/ClientForm';
import { useClientDetails } from '@/hooks/useClients';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const EditClient = () => {
  const { id } = useParams<{ id: string }>();
  const { client, isLoading, error } = useClientDetails(id!);
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24">
          <div className="max-w-5xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="rounded-lg p-8 text-center border border-border bg-card">
                <p className="text-destructive">
                  Error loading client: {(error as any)?.message || 'Unknown error'}
                </p>
              </div>
            ) : client ? (
              <ClientForm mode="edit" client={client} />
            ) : (
              <div className="rounded-lg p-8 text-center border border-border bg-card">
                <p>Client not found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditClient;
