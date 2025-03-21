
import React from 'react';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ContractDashboard } from '@/components/sites/contract/ContractDashboard';
import { useSites } from '@/hooks/useSites';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const Contracts = () => {
  const { sites, isLoading, error } = useSites();

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
                <h3 className="text-xl font-semibold mb-2">Error Loading Sites</h3>
                <p>{error.message || 'Unable to load site data'}</p>
              </div>
            ) : (
              <ContractDashboard sites={sites} isLoading={isLoading} />
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Contracts;
