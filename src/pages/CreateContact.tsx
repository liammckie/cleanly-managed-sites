
import React from 'react';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { ContactDialog } from '@/components/contacts/ContactDialog';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '@/hooks/useContacts';

const CreateContact = () => {
  const navigate = useNavigate();
  const { createContact } = useContacts();
  
  const handleSuccess = () => {
    navigate('/contacts');
  };
  
  return (
    <PageLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Create New Contact</h1>
        
        <ContactDialog 
          open={true}
          onOpenChange={() => navigate('/contacts')}
          title="Contact"
          onSubmit={createContact}
          onSuccess={handleSuccess}
        />
      </div>
    </PageLayout>
  );
};

export default CreateContact;
