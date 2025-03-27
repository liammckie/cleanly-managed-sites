
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '@/hooks/useUsers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DashboardLayout } from '@/components/ui/layout/DashboardLayout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { NewUserDialog } from '@/components/users/NewUserDialog';
import { UserTable } from '@/components/users/UserTable';
import { UserRole } from '@/lib/types';

const Users = () => {
  const { users, isLoading, error } = useUsers();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | UserRole | null>(null);
  
  // Extract unique roles from users
  const uniqueRoles = users && users.length > 0
    ? Array.from(new Set(users.map(user => 
        user.role?.name || 'No Role'
      )))
    : [];

  // Filter users based on search term and role filter
  const filteredUsers = users && users.length > 0
    ? users.filter(user => {
        // Search filter
        const matchesSearch = searchTerm === '' || 
          (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.role?.name && user.role.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // Role filter
        const matchesRole = !roleFilter || 
          (typeof roleFilter === 'string' 
            ? user.role?.name === roleFilter 
            : user.role?.id === roleFilter.id);
        
        return matchesSearch && matchesRole;
      })
    : [];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Users</h1>
          
          <Button onClick={() => setIsDialogOpen(true)}>
            Add New User
          </Button>
        </div>
        
        <div className="bg-card rounded-lg shadow mb-6">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Filters</h2>
          </div>
          
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Search</label>
                <Input
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-1/4">
                <label className="block text-sm font-medium mb-1">Role</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={typeof roleFilter === 'string' ? roleFilter : ''}
                  onChange={(e) => setRoleFilter(e.target.value || null)}
                >
                  <option value="">All Roles</option>
                  {uniqueRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center text-destructive">
            <h3 className="text-xl font-semibold mb-2">Error Loading Users</h3>
            <p>{error.message || 'Unable to load users'}</p>
          </div>
        ) : (
          <UserTable 
            users={filteredUsers} 
            onUserClick={(userId) => navigate(`/users/${userId}`)}
          />
        )}
      </div>
      
      <NewUserDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </DashboardLayout>
  );
};

export default Users;
