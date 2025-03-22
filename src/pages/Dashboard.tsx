
import React from 'react';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ClientDashboard } from '@/components/clients/ClientDashboard';
import { ContractValueMetrics } from '@/components/contracts/ContractValueMetrics';

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
            <p className="text-muted-foreground mb-6">
              Welcome to your dashboard. This is where you can manage your business data.
            </p>
            
            <div className="space-y-8">
              <ContractValueMetrics />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ClientDashboard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
