import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserWithOperations } from '@/hooks/useUsers';
import { SystemUser } from '@/lib/types';
import { Loader2, ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const UserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user, isLoading, updateUser, isUpdating, deleteUser, isDeleting, refetch } = useUserWithOperations(userId || '');
  const [formData, setFormData] = useState<Partial<SystemUser>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (user && !isEditing) {
      setFormData(user);
    }
  }, [user, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!userId) return;
      
      await updateUser({ 
        userId, 
        userData: formData 
      });
      
      toast.success('User updated successfully');
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast.error('Failed to update user');
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (!userId) return;
      
      await deleteUser(userId);
      toast.success('User deleted successfully');
      navigate('/users');
    } catch (error) {
      toast.error('Failed to delete user');
      console.error('Error deleting user:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-10">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>User Not Found</CardTitle>
              <CardDescription>The requested user could not be found.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate('/users')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Users
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/users')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">User Details</h1>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isUpdating}>
                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the user
                      and remove their data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                      {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user.avatar_url} alt={user.full_name} />
              <AvatarFallback>{user.first_name?.[0]}{user.last_name?.[0]}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{user.full_name}</h2>
            <p className="text-muted-foreground">{user.title || 'No title'}</p>
            <div className="mt-4 w-full">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-medium ${
                  user.status === 'active' ? 'text-green-600' : 
                  user.status === 'pending' ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {user.status?.charAt(0).toUpperCase() + user.status?.slice(1)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Role</span>
                <span className="font-medium">{user.role || 'User'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Last Login</span>
                <span className="font-medium">
                  {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              {isEditing ? 'Edit user details below' : 'View user details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                {isEditing ? (
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="p-2 border rounded-md">{user.first_name}</div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                {isEditing ? (
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="p-2 border rounded-md">{user.last_name}</div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="p-2 border rounded-md">{user.email}</div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="p-2 border rounded-md">{user.phone || 'Not provided'}</div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                {isEditing ? (
                  <Input
                    id="title"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="p-2 border rounded-md">{user.title || 'Not provided'}</div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                {isEditing ? (
                  <Select
                    value={formData.status || 'active'}
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-2 border rounded-md">
                    {user.status?.charAt(0).toUpperCase() + user.status?.slice(1)}
                  </div>
                )}
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                {isEditing ? (
                  <Textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="p-2 border rounded-md min-h-[100px]">
                    {user.notes || 'No notes'}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDetail;
