
import React, { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { UserTable } from '@/components/users/UserTable';
import { NewUserDialog } from '@/components/users/NewUserDialog';
import { SystemUser } from '@/lib/types/users';

const Users = () => {
  const { users, isLoading, error, refetch } = useUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter users based on search query
  const filteredUsers = users ? users.filter((user: SystemUser) => {
    const query = searchQuery.toLowerCase();
    return (
      user.full_name?.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.title?.toLowerCase().includes(query) ||
      user.role?.name?.toLowerCase().includes(query)
    );
  }) : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (error) {
    return (
      <SidebarProvider>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />
            <div className="flex-1 overflow-y-auto p-6">
              <div className="text-center py-8 text-destructive">
                <h3 className="text-xl font-semibold">Error Loading Users</h3>
                <p>{error.message || 'An unexpected error occurred'}</p>
                <Button onClick={() => refetch()} className="mt-4">
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <div className="flex-1 overflow-y-auto p-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-2xl font-bold">Users</CardTitle>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mb-4 relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery ? 'No users match your search criteria' : 'No users found'}
                  </div>
                ) : (
                  <UserTable users={filteredUsers} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <NewUserDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </SidebarProvider>
  );
};

export default Users;
