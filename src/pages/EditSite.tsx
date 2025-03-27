
import React from 'react';
import { useParams } from 'react-router-dom';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { useSite } from '@/hooks/useSite';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SidebarProvider } from '@/components/ui/sidebar';
import { EditSiteForm } from '@/components/sites/forms/edit/EditSiteForm';

const EditSite = () => {
  const { id } = useParams<{ id: string }>();
  const { site, isLoading, error } = useSite(id);
  
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="text-center text-destructive">
                <h3 className="text-xl font-semibold mb-2">Error Loading Site</h3>
                <p>{error.message || 'Unable to load site details'}</p>
              </div>
            ) : site ? (
              <EditSiteForm 
                site={site}
                initialData={site}
                siteId={id} 
                isLoading={false}
                onSubmit={() => {}}
              />
            ) : (
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Site Not Found</h3>
                <p>The requested site could not be found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default EditSite;
