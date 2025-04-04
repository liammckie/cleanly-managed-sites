
import React from 'react';
import { useParams } from 'react-router-dom';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import SiteDetailView from '@/components/sites/SiteDetailView';
import { useSiteDetails } from '@/hooks/useSites';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SidebarProvider } from '@/components/ui/sidebar';

const SiteDetails = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const { site, isLoading, isError, error, refetch } = useSiteDetails(siteId);
  
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
            ) : isError ? (
              <div className="text-center text-destructive">
                <h3 className="text-xl font-semibold mb-2">Error Loading Site</h3>
                <p>{(error as any)?.message || 'Unable to load site details'}</p>
              </div>
            ) : site ? (
              <SiteDetailView site={site} isLoading={isLoading} refetchSite={refetch} />
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

export default SiteDetails;
