
import React, { useState } from 'react';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImportExportPage } from '@/components/data/ImportExportPage';
import { ClientDashboard } from '@/components/clients/ClientDashboard';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="import-export">Import & Export</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <h2 className="text-2xl font-semibold">Dashboard</h2>
                <p className="text-muted-foreground">
                  Welcome to your dashboard. This is where you can manage your business data.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <ClientDashboard />
                </div>
              </TabsContent>
              
              <TabsContent value="import-export">
                <ImportExportPage />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
