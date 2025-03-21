
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';
import { 
  Home, 
  Building, 
  Users,
  LogOut,
} from 'lucide-react';

export function Sidebar() {
  const navigate = useNavigate();
  const { openMobile, setOpenMobile } = useSidebar();
  
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
  ];
  
  return (
    <SidebarComponent variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center h-16 px-4">
          <h1 className="text-xl font-bold">CleanSphere</h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {navItems.map(item => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild isActive={location.pathname.startsWith(item.path)}>
                <NavLink 
                  to={item.path}
                  onClick={() => setOpenMobile(false)}
                  className={({ isActive }) => cn(
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
}
