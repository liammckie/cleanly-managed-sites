import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { UsersList } from '@/components/users/UsersList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { NewUserDialog } from '@/components/users/NewUserDialog';

const Users = () => {
  const [showNewUserDialog, setShowNewUserDialog] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleOpenNewUserDialog = () => {
    setShowNewUserDialog(true);
  };

  const refreshUsers = () => {
    setRefresh(prev => !prev);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold">Users</h1>
              <Button onClick={handleOpenNewUserDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add New User
              </Button>
            </div>
            <UsersList refresh={refresh} />
          </div>
        </div>
      </div>
      <NewUserDialog 
        open={showNewUserDialog} 
        onOpenChange={setShowNewUserDialog} 
        onSuccess={refreshUsers}
      />
    </SidebarProvider>
  );
};

export default Users;
