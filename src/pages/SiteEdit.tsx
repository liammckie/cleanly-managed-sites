
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { EditSiteForm } from '@/components/sites/forms/EditSiteForm';
import { useSiteDetails } from '@/hooks/useSites';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const SiteEdit = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const { site, isLoading, isError, error } = useSiteDetails(siteId);
  
  // If the site ID is not provided, redirect to the sites page
  if (!siteId) {
    return <Navigate to="/sites" replace />;
  }
  
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
              <Alert variant="destructive" className="max-w-lg mx-auto mt-8">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error Loading Site</AlertTitle>
                <AlertDescription>
                  {(error as any)?.message || 'Unable to load site details. Please try again.'}
                </AlertDescription>
              </Alert>
            ) : site ? (
              <EditSiteForm site={site} />
            ) : (
              <Alert variant="default" className="max-w-lg mx-auto mt-8 bg-amber-50 border-amber-200">
                <AlertTitle>Site Not Found</AlertTitle>
                <AlertDescription>
                  The requested site could not be found. It may have been deleted or you may not have permission to view it.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SiteEdit;
