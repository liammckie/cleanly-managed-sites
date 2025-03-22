
import React from 'react';
import { useParams } from 'react-router-dom';
import { ContractorForm } from '@/components/contractors/ContractorForm';
import { useContractorDetails } from '@/hooks/useContractors';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';

const EditContractor = () => {
  const { id } = useParams<{ id: string }>();
  const { contractor, isLoading, error } = useContractorDetails(id!);
  
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <div className="flex-1 overflow-y-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">Edit Contractor</h1>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="rounded-lg p-8 text-center border border-border bg-card">
                <p className="text-destructive">
                  Error loading contractor: {(error as any)?.message || 'Unknown error'}
                </p>
              </div>
            ) : contractor ? (
              <ContractorForm mode="edit" contractor={contractor} />
            ) : (
              <div className="rounded-lg p-8 text-center border border-border bg-card">
                <p>Contractor not found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default EditContractor;
