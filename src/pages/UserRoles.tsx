
import React from 'react';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Helmet } from 'react-helmet-async';
import { UserRolesList } from '@/components/users/UserRolesList';

const UserRoles: React.FC = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>User Roles | CleanMap</title>
      </Helmet>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">User Roles</h1>
        <UserRolesList />
      </div>
    </PageLayout>
  );
};

export default UserRoles;
