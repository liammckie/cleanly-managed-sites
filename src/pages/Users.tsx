
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '@/hooks/useUsers';
import { PlusCircle, Search, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { UsersList } from '@/components/users/UsersList';
import { UserRolesList } from '@/components/users/UserRolesList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewUserDialog } from '@/components/users/NewUserDialog';

const Users = () => {
  const navigate = useNavigate();
  const { users, isLoading, error } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewUserDialog, setShowNewUserDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  const filteredUsers = users?.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout>
      <div className="container px-4 py-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Users & Permissions</h1>
          <Button 
            onClick={() => setShowNewUserDialog(true)}
            className="flex items-center"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <UsersList 
              users={filteredUsers || []} 
              isLoading={isLoading} 
              onUserClick={(userId) => navigate(`/users/${userId}`)}
            />
          </TabsContent>
          
          <TabsContent value="roles">
            <UserRolesList />
          </TabsContent>
        </Tabs>
      </div>
      
      <NewUserDialog
        open={showNewUserDialog}
        onOpenChange={setShowNewUserDialog}
      />
    </PageLayout>
  );
};

export default Users;
