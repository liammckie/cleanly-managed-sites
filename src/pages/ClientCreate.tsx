
import React from 'react';
import { ClientForm } from '@/components/clients/ClientForm';

const ClientCreate = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Client</h1>
      <ClientForm mode="create" />
    </div>
  );
};

export default ClientCreate;
