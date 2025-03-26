import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { UserDetails } from '@/components/users/UserDetails';
import { UserDetailSkeleton } from '@/components/users/UserDetailSkeleton';
import { DeleteUserModal } from '@/components/data/DeleteUserModal';
import { adaptSystemUser } from '@/utils/typeAdapters';
import { SystemUser } from '@/lib/types';

const UserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { user, isLoading, error } = useUser(userId!);

  const handleConfirmDelete = () => {
    // Implementation for confirming delete
    console.log('Confirm delete user', user);
    setIsDeleteModalOpen(false);
    navigate('/users');
  };

  const handleEditUser = () => {
    // Implementation for edit user functionality
    console.log('Edit user', user);
  };

  const handleDeleteUser = () => {
    // Implementation for delete user functionality
    console.log('Delete user', user);
  };

  return (
    <PageLayout>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col space-y-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowLeft 
                className="h-5 w-5 cursor-pointer" 
                onClick={() => navigate(-1)}
              />
              <h1 className="text-2xl font-semibold">User Details</h1>
            </div>
            
            {/* Only show actions if the user is loaded */}
            {user && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/users/${userId}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
          
          {isLoading ? (
            <UserDetailSkeleton />
          ) : error ? (
            <div className="text-center p-8">
              <p className="text-destructive text-lg">Error loading user</p>
              <p className="text-muted-foreground">
                {(error as Error)?.message || 'An unknown error occurred'}
              </p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => navigate('/users')}
              >
                Return to Users
              </Button>
            </div>
          ) : user ? (
            <UserDetails 
              user={user} 
              onEdit={handleEditUser} 
              onDelete={handleDeleteUser} 
            />
          ) : (
            <div className="text-center p-8">
              <p className="text-lg">User not found</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => navigate('/users')}
              >
                Return to Users
              </Button>
            </div>
          )}
        </div>
        
        {/* Delete confirmation modal */}
        {isDeleteModalOpen && (
          <DeleteUserModal
            isOpen={isDeleteModalOpen}
            userName={user.full_name || user.email}
            onConfirm={handleConfirmDelete}
            onCancel={() => setIsDeleteModalOpen(false)}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default UserDetail;
