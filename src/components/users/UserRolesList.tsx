import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Search, Trash2, Edit, Users, Shield } from 'lucide-react';
import { UserRole } from '@/types/users';
import UserRoleCard from './UserRoleCard';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';

interface UserRolesListProps {
  roles?: UserRole[];
  isLoading?: boolean;
  onRoleClick?: (role: UserRole) => void;
  onAddClick?: (role: Partial<UserRole>) => void;
  onDeleteClick?: (role: UserRole) => void;
  onEditClick?: (role: UserRole) => void;
}

const UserRolesList = ({ roles = [], isLoading, onRoleClick, onAddClick, onDeleteClick, onEditClick }: UserRolesListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  // Fix the async/await issue
  const handleAddRole = () => {
    // Create a properly typed name field
    const newRole = {
      name: 'New Role', // Required field
      description: 'Role description'
    };
    onAddClick(newRole);
  };

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRoleClick = (role: UserRole) => {
    setSelectedRoleId(role.id);
    if (onRoleClick) {
      onRoleClick(role);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">User Roles</h2>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Add Role
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">User Roles</h2>
        <Button onClick={handleAddRole}>
          <Plus className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </div>

      {roles.length > 0 && (
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search roles..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {filteredRoles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoles.map((role) => (
            <UserRoleCard
              key={role.id}
              role={role}
              onClick={handleRoleClick}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
              isActive={role.id === selectedRoleId}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Shield className="h-12 w-12 text-muted-foreground" />}
          title="No roles found"
          description={
            searchTerm
              ? "No roles match your search criteria"
              : "Get started by adding your first user role"
          }
          action={
            searchTerm ? (
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear search
              </Button>
            ) : (
              <Button onClick={handleAddRole}>
                <Plus className="mr-2 h-4 w-4" />
                Add Role
              </Button>
            )
          }
        />
      )}
    </div>
  );
};

export default UserRolesList;
