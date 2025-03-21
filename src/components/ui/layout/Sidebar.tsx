
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { 
  Home, 
  Map, 
  Settings, 
  Users, 
  FileText, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  LogOut
} from 'lucide-react';

type SidebarItemProps = {
  icon: React.ElementType;
  title: string;
  path: string;
  isCollapsed: boolean;
  isActive: boolean;
};

const SidebarItem = ({ 
  icon: Icon, 
  title, 
  path, 
  isCollapsed, 
  isActive 
}: SidebarItemProps) => {
  return (
    <Link
      to={path}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium animate-hover",
        isActive 
          ? "bg-primary/10 text-primary" 
          : "text-foreground/70 hover:text-foreground hover:bg-accent/50",
        isCollapsed && "justify-center"
      )}
    >
      <Icon className={cn("flex-shrink-0", isActive ? "text-primary" : "text-foreground/60")} size={20} />
      {!isCollapsed && <span className="animate-fade-in">{title}</span>}
    </Link>
  );
};

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();

  const sidebarItems = [
    { icon: Home, title: 'Dashboard', path: '/dashboard' },
    { icon: Map, title: 'Sites', path: '/sites' },
    { icon: Users, title: 'Subcontractors', path: '/subcontractors' },
    { icon: FileText, title: 'Reports', path: '/reports' },
    { icon: Calendar, title: 'Schedule', path: '/schedule' },
    { icon: Settings, title: 'Settings', path: '/settings' },
  ];

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div
      className={cn(
        "h-screen flex flex-col border-r border-border transition-all duration-300 ease-in-out bg-background",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center animate-fade-in">
            <span className="text-lg font-semibold ml-2">CleanSites</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleSidebar}
          className={cn(
            "p-1 rounded-full ml-auto",
            isCollapsed && "mx-auto"
          )}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      <div className="flex-1 py-6 flex flex-col gap-1 overflow-y-auto">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.path}
            icon={item.icon}
            title={item.title}
            path={item.path}
            isCollapsed={isCollapsed}
            isActive={location.pathname.startsWith(item.path)}
          />
        ))}
      </div>
      
      <div className="mt-auto border-t border-border p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-foreground/70 hover:text-foreground",
            isCollapsed && "justify-center"
          )}
          onClick={handleLogout}
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}
