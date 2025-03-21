
import React from 'react';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ZapierIntegration } from '@/components/integrations/ZapierIntegration';
import { GoogleDriveIntegration } from '@/components/integrations/GoogleDriveIntegration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Integrations = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabParam = searchParams.get('tab');
  const activeTab = tabParam || 'zapier';

  const handleTabChange = (value: string) => {
    navigate(`/integrations?tab=${value}`);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-2xl font-bold mb-6">Integrations</h1>
              
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList>
                  <TabsTrigger value="zapier">Zapier</TabsTrigger>
                  <TabsTrigger value="google-drive">Google Drive</TabsTrigger>
                  <TabsTrigger value="xero" disabled>Xero</TabsTrigger>
                  <TabsTrigger value="other" disabled>Other</TabsTrigger>
                </TabsList>
                <TabsContent value="zapier" className="mt-4">
                  <ZapierIntegration />
                </TabsContent>
                <TabsContent value="google-drive" className="mt-4">
                  <GoogleDriveIntegration />
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
