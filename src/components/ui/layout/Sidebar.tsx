
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  ClipboardList, 
  Settings, 
  LogOut, 
  FileText,
  Boxes 
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile'; 
import { Button } from '@/components/ui/button';
import { SidebarContent } from '@/components/ui/sidebar/sidebar-sections';
import { BusinessBranding } from '@/components/BusinessBranding';

export function Sidebar() {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();

  const menuItems = [
    {
      href: '/dashboard',
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      active: pathname === '/dashboard'
    },
    {
      href: '/sites',
      icon: <Building2 size={20} />,
      label: 'Sites',
      active: pathname.startsWith('/sites')
    },
    {
      href: '/contracts',
      icon: <FileText size={20} />,
      label: 'Contracts',
      active: pathname.startsWith('/contracts')
    },
    {
      href: '/clients',
      icon: <Users size={20} />,
      label: 'Clients',
      active: pathname.startsWith('/clients')
    },
    {
      href: '/workorders',
      icon: <ClipboardList size={20} />,
      label: 'Work Orders',
      active: pathname.startsWith('/workorders')
    },
    {
      href: '/integrations',
      icon: <Boxes size={20} />,
      label: 'Integrations',
      active: pathname === '/integrations'
    },
    {
      href: '/settings',
      icon: <Settings size={20} />,
      label: 'Settings',
      active: pathname === '/settings'
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 mb-2">
        <BusinessBranding />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                item.active
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-primary/10'
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {user && (
        <div className="p-4 mt-auto border-t">
          <Button
            variant="ghost" 
            className="w-full justify-start text-sm" 
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      )}
    </div>
  );
}
