
import React from 'react';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { ClientForm } from '@/components/clients/ClientForm';

const CreateClient = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24">
          <div className="max-w-5xl mx-auto">
            <ClientForm mode="create" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClient;
