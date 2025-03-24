import React from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Mail, Phone, User, UserCheck, UserX } from 'lucide-react';
import { SystemUser } from '@/lib/types';
import { toast } from 'sonner';
import { useUpdateUser } from '@/hooks/useUsers';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function UserDetail() {
  const { userId } = useParams<{ userId: string }>();
  const { user, isLoading, error, refetch: refetchUser } = useUser(userId);
  const { updateUser, isUpdating, setIsUpdating } = useUpdateUser();
  
  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner />
        </div>
      </PageLayout>
    );
  }
  
  if (error) {
    return (
      <PageLayout>
        <div className="text-center text-destructive">
          <h3 className="text-xl font-semibold mb-2">Error Loading User</h3>
          <p>{(error as any)?.message || 'Unable to load user details'}</p>
        </div>
      </PageLayout>
    );
  }
  
  if (!user) {
    return (
      <PageLayout>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">User Not Found</h3>
          <p>The requested user could not be found.</p>
        </div>
      </PageLayout>
    );
  }
  
  const handleUpdateUser = async (userData: Partial<SystemUser>) => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      
      // Create a valid object for update
      const updatedUserData = {
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        title: userData.title,
        avatar_url: userData.avatar_url,
        status: userData.status,
        role_id: userData.role_id,
        custom_id: userData.custom_id,
        note: userData.note,
        territories: userData.territories
        // Remove permissions from update data as it's not in the type
      };
      
      await updateUser(user.id, updatedUserData);
      toast.success('User updated successfully');
      
      // Refresh user data
      await refetchUser();
      
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user: ' + (error as Error).message);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <PageLayout>
      <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 mr-2" />
              User Details
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={user.avatar_url} alt={user.full_name || user.email} />
                <AvatarFallback>{user.first_name?.charAt(0)}{user.last_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="text-2xl font-semibold">{user.full_name || user.email}</h2>
                <p className="text-muted-foreground">{user.title}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-lg font-medium">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium">Phone</div>
                  <div className="text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {user.phone || 'Not specified'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-lg font-medium">Status & Role</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Status</div>
                  <div>
                    {user.status === 'active' && <Badge variant="outline"><UserCheck className="h-3 w-3 mr-1" /> Active</Badge>}
                    {user.status === 'pending' && <Badge variant="secondary">Pending</Badge>}
                    {user.status === 'inactive' && <Badge variant="destructive"><UserX className="h-3 w-3 mr-1" /> Inactive</Badge>}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium">Role</div>
                  <div className="text-muted-foreground">{user.role?.name || 'Not assigned'}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-lg font-medium">Additional Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Custom ID</div>
                  <div className="text-muted-foreground">{user.custom_id || 'Not specified'}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium">Territories</div>
                  <div className="text-muted-foreground">{user.territories?.join(', ') || 'Not specified'}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-lg font-medium">Notes</h4>
              <div className="text-muted-foreground">{user.note || 'No notes provided'}</div>
            </div>
            
            <Button 
              variant="secondary"
              onClick={() => {
                // Navigate to the edit user page
                window.location.href = `/users/${userId}/edit`;
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit User
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
