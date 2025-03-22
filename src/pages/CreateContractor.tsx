
import React from 'react';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ContractorForm } from '@/components/contractors/ContractorForm';

const CreateContractor = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <div className="flex-1 overflow-y-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">Add New Contractor</h1>
            <ContractorForm />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CreateContractor;
