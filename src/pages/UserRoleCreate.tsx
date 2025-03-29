
import React from 'react';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Helmet } from 'react-helmet-async';
import { NewRoleDialog } from '@/components/users/NewRoleDialog';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const UserRoleCreate: React.FC = () => {
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    navigate('/user-roles');
  };
  
  const handleCancel = () => {
    navigate('/user-roles');
  };
  
  return (
    <PageLayout>
      <Helmet>
        <title>Create User Role | CleanMap</title>
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
          <h1 className="text-2xl font-bold">Create New User Role</h1>
        </div>
        
        <NewRoleDialog 
          open={true}
          onOpenChange={() => handleCancel()}
          onSuccess={handleSuccess}
          standalone={true}
        />
      </div>
    </PageLayout>
  );
};

export default UserRoleCreate;
