
import React from 'react';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Helmet } from 'react-helmet-async';
import { EditRoleDialog } from '@/components/users/EditRoleDialog';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useUserRoles } from '@/hooks/useUserRoles';

const UserRoleEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { roles, isLoading } = useUserRoles();
  
  const role = roles.find(r => r.id === id);
  
  const handleSuccess = () => {
    navigate('/user-roles');
  };
  
  const handleCancel = () => {
    navigate('/user-roles');
  };
  
  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }
  
  if (!role) {
    return (
      <PageLayout>
        <div className="container mx-auto p-4">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              className="mr-4" 
              onClick={() => navigate('/user-roles')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Roles
            </Button>
            <h1 className="text-2xl font-bold">Role Not Found</h1>
          </div>
          <p>The role you're looking for doesn't exist or has been deleted.</p>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <Helmet>
        <title>Edit User Role | CleanMap</title>
      </Helmet>
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-4" 
            onClick={() => navigate('/user-roles')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Roles
          </Button>
          <h1 className="text-2xl font-bold">Edit User Role: {role.name}</h1>
        </div>
        
        <EditRoleDialog 
          open={true}
          role={role}
          onOpenChange={() => handleCancel()}
          onSuccess={handleSuccess}
          standalone={true}
        />
      </div>
    </PageLayout>
  );
};

export default UserRoleEdit;
