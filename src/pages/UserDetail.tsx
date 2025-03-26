
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { UserForm } from '@/components/users/UserForm';
import { UserDetails } from '@/components/users/UserDetails';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Edit, Trash2 } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

export default function UserDetail() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { user, isLoading, isError, error, updateUser, deleteUser, isUpdating, isDeleting } = useUser(userId!);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex h-full items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </PageLayout>
    );
  }

  if (isError) {
    return (
      <PageLayout>
        <div className="flex h-full items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{(error as Error)?.message || 'An error occurred loading the user'}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/users')}
              >
                Back to Users
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout>
        <div className="flex h-full items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>User Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p>The requested user could not be found.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/users')}
              >
                Back to Users
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteUser();
      navigate('/users');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">{user.full_name}</h1>
          
          <div className="flex gap-2">
            {!editMode && (
              <>
                <Button 
                  variant="outline" 
                  className="flex items-center"
                  onClick={() => setEditMode(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                
                <Button 
                  variant="destructive"
                  className="flex items-center"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
        
        <Separator />
        
        {editMode ? (
          <UserForm 
            user={user} 
            onSubmit={async (formData) => {
              await updateUser(formData);
              setEditMode(false);
            }}
            onCancel={() => setEditMode(false)}
            isSubmitting={isUpdating}
          />
        ) : (
          <UserDetails user={user} />
        )}
        
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the user
                and remove their data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <>
                    <LoadingSpinner className="mr-2" size="sm" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageLayout>
  );
}
