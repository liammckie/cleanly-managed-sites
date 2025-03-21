
import React from 'react';
import { useParams } from 'react-router-dom';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { SiteDetailView } from '@/components/sites/SiteDetailView';

const SiteDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <SiteDetailView />
        </div>
      </div>
    </div>
  );
};

export default SiteDetail;
