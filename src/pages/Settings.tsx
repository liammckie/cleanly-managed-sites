
import React from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { BusinessDetailsForm } from '@/components/settings/BusinessDetailsForm';
import { Settings as SettingsIcon, Building2 } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';

const Settings = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <main className="flex-1 overflow-y-auto py-6">
            <div className="container max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <SettingsIcon className="h-8 w-8" />
                    Settings
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Manage your account and business settings
                  </p>
                </div>
              </div>
              
              <Tabs defaultValue="business" className="space-y-6">
                <TabsList className="bg-card border">
                  <TabsTrigger value="business" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Business Details
                  </TabsTrigger>
                  {/* More tabs can be added here in the future */}
                </TabsList>
                
                <TabsContent value="business" className="space-y-8">
                  <BusinessDetailsForm />
                </TabsContent>
                
                {/* More tab content can be added here in the future */}
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
