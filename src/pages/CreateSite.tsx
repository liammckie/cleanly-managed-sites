
import React from 'react';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { CreateSiteForm } from '@/components/sites/forms/CreateSiteForm';

const CreateSite = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <CreateSiteForm />
        </div>
      </div>
    </div>
  );
};

export default CreateSite;
