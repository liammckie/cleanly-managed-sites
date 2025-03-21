
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useMobile } from '@/hooks/use-mobile';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';
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

export function Sidebar() {
  const navigate = useNavigate();
  const { isMobile, isOpen, setIsOpen } = useMobile();
  
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
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    if (isMobile) {
      return (
        <>
          <Button
            onClick={() => setIsOpen(true)}
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-40 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          {isOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
          )}
          
          <div className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border shadow-lg transform transition-transform duration-300 ease-in-out md:static md:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <div className="flex justify-end p-4 md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            {children}
          </div>
        </>
      );
    }
    
    return (
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-10 bg-card border-r border-border">
        {children}
      </div>
    );
  };
  
  return (
    <Wrapper>
      <div className="flex flex-col h-full justify-between overflow-y-auto">
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
      </div>
    </Wrapper>
  );
}
