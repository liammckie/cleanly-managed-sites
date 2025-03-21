import React from 'react';
import { useParams } from 'react-router-dom';
import { ClientForm } from '@/components/clients/ClientForm';
import { useClientDetails } from '@/hooks/useClients';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { 
  Home, 
  Building, 
  Users,
  Calendar, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';

const EditClient = () => {
  const { id } = useParams<{ id: string }>();
  const { client, isLoading, error } = useClientDetails(id!);
  
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleSignOut = async () => {
    try {
      await authApi.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Sites', path: '/sites', icon: Building },
    // Disabled for now but will be implemented in the future
    // { name: 'Calendar', path: '/calendar', icon: Calendar },
    // { name: 'Settings', path: '/settings', icon: Settings },
  ];
  
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen w-full bg-background">
        <Sidebar variant="floating" collapsible="offcanvas">
          <SidebarContent>
            <div className="pt-6 md:pt-10 px-5 space-y-8">
              <div className="flex items-center justify-center md:justify-start">
                <h1 className="text-2xl font-bold">CleanSphere</h1>
              </div>
              
              <nav className="space-y-1">
                {navItems.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-md",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    )}
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="p-5 mb-6">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>
        
        <SidebarInset className="flex flex-col overflow-hidden">
          <div className="flex items-center p-4 border-b">
            <SidebarTrigger className="mr-2" />
            <Navbar />
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24">
            <div className="max-w-5xl mx-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <div className="rounded-lg p-8 text-center border border-border bg-card">
                  <p className="text-destructive">
                    Error loading client: {(error as any)?.message || 'Unknown error'}
                  </p>
                </div>
              ) : client ? (
                <ClientForm mode="edit" client={client} />
              ) : (
                <div className="rounded-lg p-8 text-center border border-border bg-card">
                  <p>Client not found.</p>
                </div>
              )}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default EditClient;
