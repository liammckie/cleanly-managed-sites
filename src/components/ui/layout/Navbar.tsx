
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Search, HelpCircle, User, Settings, LogOut } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  
  // Get the current page title based on the path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/sites') return 'Sites';
    if (path.startsWith('/sites/') && path.includes('/edit')) return 'Edit Site';
    if (path.startsWith('/sites/') && path.includes('/create')) return 'Create Site';
    if (path.startsWith('/sites/')) return 'Site Details';
    if (path === '/subcontractors') return 'Subcontractors';
    if (path === '/reports') return 'Reports';
    if (path === '/schedule') return 'Schedule';
    if (path === '/settings') return 'Settings';
    return 'Dashboard';
  };

  return (
    <div className="glass-card h-16 px-4 flex items-center justify-between border-b border-border">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="glass-input pl-9 pr-4 py-2 w-[240px] text-sm focus:outline-none"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="rounded-full animate-hover">
          <Bell size={18} />
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full animate-hover">
          <HelpCircle size={18} />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full p-1 animate-hover">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <User size={16} />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Settings size={16} />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
              <LogOut size={16} />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
