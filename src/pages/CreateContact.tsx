
import React, { useState } from 'react';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { ContactDialog } from '@/components/contacts/ContactDialog';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '@/hooks/useContacts';
import { toast } from 'sonner';

const CreateContact = () => {
  const navigate = useNavigate();
  const { createContact } = useContacts();
  const [dialogOpen, setDialogOpen] = useState(true);
  
  const handleSuccess = () => {
    toast.success('Contact created successfully');
    navigate('/contacts');
  };
  
  const handleCancel = () => {
    navigate('/contacts');
  };
  
  // Create a wrapper function to handle the type mismatch
  const handleSubmit = async (contactData: any) => {
    try {
      await createContact(contactData);
      return true;
    } catch (error) {
      console.error('Error creating contact:', error);
      return false;
    }
  };
  
  // When dialog state changes
  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      handleCancel();
    }
  };
  
  return (
    <PageLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Create New Contact</h1>
        
        <ContactDialog 
          open={dialogOpen}
          onOpenChange={handleOpenChange}
          title="Contact"
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
        />
      </div>
    </PageLayout>
  );
};

export default CreateContact;
