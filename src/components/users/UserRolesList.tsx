
import React from 'react';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import UserRoleCard from '@/components/users/UserRoleCard';
import { EmptyState } from '@/components/ui/empty-state';
import { useNavigate } from 'react-router-dom';

export const UserRolesList: React.FC = () => {
  const { roles, isLoading, error, deleteRole } = useUserRoles();
  const navigate = useNavigate();

  const handleEdit = (roleId: string) => {
    navigate(`/user-roles/${roleId}`);
  };

  const handleDelete = async (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRole(roleId);
      } catch (error) {
        console.error('Failed to delete role:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-destructive">Error loading roles: {(error as Error).message}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Roles</h2>
        <Button onClick={() => navigate('/user-roles/new')}>
          <Plus className="mr-2 h-4 w-4" /> Create Role
        </Button>
      </div>
      
      {!roles || roles.length === 0 ? (
        <EmptyState
          title="No roles found"
          description="Create your first role to manage user permissions"
          icon={<Plus className="h-12 w-12" />}
          action={
            <Button onClick={() => navigate('/user-roles/new')}>
              <Plus className="mr-2 h-4 w-4" /> Create Role
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <UserRoleCard
              key={role.id}
              role={role}
              onEditClick={() => handleEdit(role.id)}
              onDeleteClick={() => handleDelete(role.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRolesList;
