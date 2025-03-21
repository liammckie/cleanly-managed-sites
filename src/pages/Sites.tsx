
import React from 'react';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { SitesList } from '@/components/sites/SitesList';
import { SidebarProvider } from '@/components/ui/sidebar';

const Sites = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
            <SitesList />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Sites;
