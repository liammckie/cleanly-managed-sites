
import React from 'react';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ZapierIntegration } from '@/components/integrations/ZapierIntegration';
import { GoogleDriveIntegration } from '@/components/integrations/GoogleDriveIntegration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useXeroWorkOrders } from '@/hooks/useXeroWorkOrders';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const Integrations = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabParam = searchParams.get('tab');
  const activeTab = tabParam || 'zapier';
  const { isConnected, isLoading, connectToXero } = useXeroWorkOrders();

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
                  <TabsTrigger value="xero">Xero</TabsTrigger>
                  <TabsTrigger value="other" disabled>Other</TabsTrigger>
                </TabsList>
                <TabsContent value="zapier" className="mt-4">
                  <ZapierIntegration />
                </TabsContent>
                <TabsContent value="google-drive" className="mt-4">
                  <GoogleDriveIntegration />
                </TabsContent>
                <TabsContent value="xero" className="mt-4">
                  <div className="space-y-6">
                    <div className="bg-card rounded-lg border shadow-sm p-6">
                      <h2 className="text-xl font-semibold mb-4">Xero Integration</h2>
                      <p className="text-muted-foreground mb-6">
                        Connect to Xero to manage invoices, purchase orders, and payments for your sites and work orders.
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            Status: <span className={isConnected ? "text-green-500" : "text-amber-500"}>
                              {isConnected ? "Connected" : "Not Connected"}
                            </span>
                          </p>
                        </div>
                        
                        <Button 
                          onClick={connectToXero} 
                          disabled={isLoading || isConnected}
                        >
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isConnected ? "Connected" : "Connect to Xero"}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-card rounded-lg border shadow-sm p-6">
                      <h2 className="text-xl font-semibold mb-4">Work Order Management</h2>
                      <p className="text-muted-foreground mb-6">
                        Use Xero to manage work orders, including generating purchase orders for suppliers and invoices for clients.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <h3 className="font-medium mb-2">Purchase Orders</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Create purchase orders for suppliers to perform work at your sites.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (!isConnected) {
                                toast.error("Please connect to Xero first");
                                return;
                              }
                              navigate('/workorders');
                            }}
                          >
                            Manage Purchase Orders
                          </Button>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h3 className="font-medium mb-2">Client Invoices</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Generate invoices for clients based on completed work orders.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (!isConnected) {
                                toast.error("Please connect to Xero first");
                                return;
                              }
                              navigate('/workorders');
                            }}
                          >
                            Manage Invoices
                          </Button>
                        </div>
                      </div>
                    </div>
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
