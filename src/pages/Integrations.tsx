
import React from 'react';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ZapierIntegration } from '@/components/integrations/ZapierIntegration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Integrations = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-2xl font-bold mb-6">Integrations</h1>
              
              <Tabs defaultValue="zapier" className="w-full">
                <TabsList>
                  <TabsTrigger value="zapier">Zapier</TabsTrigger>
                  <TabsTrigger value="xero" disabled>Xero</TabsTrigger>
                  <TabsTrigger value="other" disabled>Other</TabsTrigger>
                </TabsList>
                <TabsContent value="zapier" className="mt-4">
                  <ZapierIntegration />
                </TabsContent>
                <TabsContent value="xero">
                  <div className="text-center py-12 text-muted-foreground">
                    Xero integration coming soon
                  </div>
                </TabsContent>
                <TabsContent value="other">
                  <div className="text-center py-12 text-muted-foreground">
                    Additional integrations coming soon
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Integrations;
