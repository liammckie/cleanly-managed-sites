
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  Edit, 
  AlertTriangle, 
  CheckCircle2 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { UserForm } from '@/components/users/UserForm';

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading, error, updateUser } = useUser(id);
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container px-4 py-6 mx-auto">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/users')}
              className="mr-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Button>
            <h1 className="text-2xl font-bold">Loading User...</h1>
          </div>
          <div className="mt-6 h-64 animate-pulse bg-muted rounded-md"></div>
        </div>
      </PageLayout>
    );
  }

  if (error || !user) {
    return (
      <PageLayout>
        <div className="container px-4 py-6 mx-auto">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/users')}
              className="mr-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Button>
            <h1 className="text-2xl font-bold">User Not Found</h1>
          </div>
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-6">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <p className="text-lg font-medium mb-2">Error loading user</p>
                <p className="text-muted-foreground text-center">
                  {error?.message || 'The user could not be found or you do not have permission to view it.'}
                </p>
                <Button 
                  onClick={() => navigate('/users')}
                  className="mt-4"
                >
                  Return to Users List
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  const handleStatusChange = async (newStatus: 'active' | 'inactive') => {
    try {
      await updateUser({ ...user, status: newStatus });
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error(`Failed to update user status: ${error.message}`);
    }
  };

  return (
    <PageLayout>
      <div className="container px-4 py-6 mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/users')}
            className="mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
          <h1 className="text-2xl font-bold">User Details</h1>
        </div>

        {isEditing ? (
          <UserForm 
            user={user} 
            onCancel={() => setIsEditing(false)}
            onSuccess={() => {
              setIsEditing(false);
              toast.success("User updated successfully");
            }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>User Information</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
                <CardDescription>Manage user details and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-2">
                      <AvatarImage src={user.avatar_url} alt={user.full_name} />
                      <AvatarFallback className="text-2xl">
                        {user.full_name.split(' ').map(name => name[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Badge className={user.status === 'active' ? 'bg-green-600' : 'bg-red-600'}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="flex-grow">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Full Name
                        </dt>
                        <dd className="mt-1 text-base">{user.full_name}</dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center">
                          <Mail className="mr-2 h-4 w-4" />
                          Email
                        </dt>
                        <dd className="mt-1 text-base">{user.email}</dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center">
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Role
                        </dt>
                        <dd className="mt-1 text-base">
                          <Badge variant="outline" className="font-semibold">
                            {user.role.name}
                          </Badge>
                        </dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          Last Login
                        </dt>
                        <dd className="mt-1 text-base">
                          {user.last_login ? formatDate(user.last_login) : 'Never'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="flex justify-end gap-2 p-4">
                {user.status === 'active' ? (
                  <Button 
                    variant="destructive" 
                    onClick={() => handleStatusChange('inactive')}
                  >
                    Deactivate User
                  </Button>
                ) : (
                  <Button 
                    variant="default" 
                    onClick={() => handleStatusChange('active')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Activate User
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
                <CardDescription>User role and access rights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Role: {user.role.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {user.role.description || 'No description available'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Permissions:</h3>
                    <ul className="space-y-2">
                      {user.role.permissions.map((permission, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                          <span className="text-sm">{permission}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default UserDetail;
