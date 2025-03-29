import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Card } from '@/components/ui/card';
import { ContactManagementTabs, ContactCounts } from '@/components/contacts/ContactManagementTabs';
import { ContactDialog } from '@/components/contacts/ContactDialog';
import { useContacts, ContactFilters } from '@/hooks/useContacts';
import { ContactRecord } from '@/lib/types';
import { 
  ContactsPageHeader,
  ContactsFiltersCard,
  ContactsTable
} from '@/components/contacts/page';

const Contacts = () => {
  const [filters, setFilters] = useState<ContactFilters>({
    entityType: 'all'
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactRecord | null>(null);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    contacts, 
    contactTypeCount,
    availableEntities,
    isLoading, 
    error,
    addContact,
    updateContact,
    deleteContact,
    setPrimaryContact,
    setFilters: setContactsFilters
  } = useContacts(filters);

  useEffect(() => {
    if (contacts && contacts.length > 0) {
      const roles = [...new Set(contacts.map(c => c.role).filter(Boolean))];
      const departments = [...new Set(contacts.map(c => c.department).filter(Boolean))];
      
      setAvailableRoles(roles as string[]);
      setAvailableDepartments(departments as string[]);
    }
  }, [contacts]);

  const handleTabChange = (value: string) => {
    console.log("Tab changed to:", value);
    
    const newFilters = {
      ...filters,
      entityType: value === 'all' ? undefined : value
    };
    
    setFilters(newFilters);
    setContactsFilters(newFilters);
  };

  const handleFilterChange = (newFilters: ContactFilters) => {
    const updatedFilters = {
      ...newFilters,
      entityType: filters.entityType
    };
    
    setFilters(updatedFilters);
    setContactsFilters(updatedFilters);
  };

  const handleOpenDialog = (contact?: ContactRecord) => {
    setEditingContact(contact || null);
    setDialogOpen(true);
  };

  const handleSubmitContact = async (contactData: Partial<ContactRecord>): Promise<void> => {
    try {
      if (contactData.id) {
        await updateContact(contactData.id, contactData);
      } else {
        await addContact(contactData as Omit<ContactRecord, 'id' | 'created_at' | 'updated_at'>);
      }
      setDialogOpen(false);
    } catch (error) {
      console.error('Error handling contact:', error);
      throw error;
    }
  };

  const handleSetPrimary = async (contact: ContactRecord) => {
    if (contact.id && contact.entity_id && contact.entity_type) {
      await setPrimaryContact(contact.id, contact.entity_id, contact.entity_type);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      await deleteContact(id);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Contacts</h1>
          <Button onClick={() => setOpen(true)}>Add Contact</Button>
        </div>
        
        <div className="flex flex-col gap-6">
          <ContactsPageHeader onAddContact={() => handleOpenDialog()} />

          <div className="flex flex-col gap-4">
            <ContactManagementTabs 
              onValueChange={handleTabChange} 
              defaultValue={filters.entityType || 'all'}
              counts={contactTypeCount as ContactCounts}
            />
            
            <ContactsFiltersCard 
              filters={filters}
              onFilterChange={handleFilterChange}
              availableRoles={availableRoles}
              availableDepartments={availableDepartments}
              availableEntities={availableEntities}
            />
            
            <Card>
              <div className="overflow-x-auto">
                <ContactsTable 
                  contacts={contacts}
                  isLoading={isLoading}
                  availableEntities={availableEntities}
                  onEditContact={handleOpenDialog}
                  onSetPrimary={handleSetPrimary}
                  onDeleteContact={handleDeleteContact}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      <ContactDialog 
        isOpen={open} 
        onClose={() => setOpen(false)}
        contact={selectedContact} 
        onSubmit={handleSubmitContact}
        isSubmitting={isSubmitting}
        title="Add New Contact"
      />
    </PageLayout>
  );
};

export default Contacts;
