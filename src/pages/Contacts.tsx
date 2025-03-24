
import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ContactManagementTabs, ContactCounts } from '@/components/contacts/ContactManagementTabs';
import { ContactDialog } from '@/components/contacts/ContactDialog';
import { ContactsFilter } from '@/components/contacts/ContactsFilter';
import { useContacts, ContactFilters } from '@/hooks/useContacts';
import { ContactRecord } from '@/lib/types';
import { 
  UserPlus, 
  Star, 
  Mail, 
  Phone,
  MoreHorizontal,
  Building,
  Store,
  Truck,
  Users,
  Globe
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Contacts = () => {
  const [filters, setFilters] = useState<ContactFilters>({
    entityType: 'all'
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactRecord | null>(null);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);
  
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

  const handleAddContact = async (contactData: Partial<ContactRecord>) => {
    try {
      await addContact(contactData as Omit<ContactRecord, 'id' | 'created_at' | 'updated_at'>);
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleUpdateContact = async (id: string, contactData: Partial<ContactRecord>) => {
    try {
      await updateContact(id, contactData);
    } catch (error) {
      console.error('Error updating contact:', error);
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

  const getEntityName = (contact: ContactRecord) => {
    if (contact.entity_id === 'all_sites') {
      return 'All Sites';
    }
    
    if (contact.entity_id === 'all_clients') {
      return 'All Clients';
    }
    
    const entity = availableEntities.find(e => e.id === contact.entity_id && e.type === contact.entity_type);
    return entity ? entity.name : '';
  };

  const getEntityIcon = (contact: ContactRecord) => {
    if (contact.entity_id === 'all_sites') {
      return <Globe className="h-4 w-4 mr-1" />;
    }
    
    if (contact.entity_id === 'all_clients') {
      return <Globe className="h-4 w-4 mr-1" />;
    }
    
    switch (contact.entity_type) {
      case 'client':
        return <Building className="h-4 w-4 mr-1" />;
      case 'site':
        return <Store className="h-4 w-4 mr-1" />;
      case 'supplier':
        return <Truck className="h-4 w-4 mr-1" />;
      case 'internal':
        return <Users className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <PageLayout>
      <div className="container py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
              <p className="text-muted-foreground">
                Manage your business contacts
              </p>
            </div>
            <Button 
              onClick={() => handleOpenDialog()}
              className="flex items-center gap-1"
            >
              <UserPlus className="h-4 w-4" />
              Add New Contact
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            <ContactManagementTabs 
              onValueChange={handleTabChange} 
              defaultValue={filters.entityType || 'all'}
              counts={contactTypeCount as ContactCounts}
            />
            
            <Card className="p-4">
              <ContactsFilter 
                filters={filters}
                onFilterChange={handleFilterChange}
                availableRoles={availableRoles}
                availableDepartments={availableDepartments}
                availableEntities={availableEntities}
              />
            </Card>
            
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact Details</TableHead>
                      <TableHead>Department/Role</TableHead>
                      <TableHead>Associated With</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Loading contacts...
                        </TableCell>
                      </TableRow>
                    ) : contacts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No contacts found. Add your first contact to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      contacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {contact.name}
                              {contact.is_primary && contact.entity_id !== 'all_sites' && contact.entity_id !== 'all_clients' && (
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {contact.email && (
                                <div className="flex items-center gap-1 text-sm">
                                  <Mail className="h-3.5 w-3.5" />
                                  <span>{contact.email}</span>
                                </div>
                              )}
                              {contact.phone && (
                                <div className="flex items-center gap-1 text-sm">
                                  <Phone className="h-3.5 w-3.5" />
                                  <span>{contact.phone}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{contact.role}</span>
                              {contact.department && (
                                <span className="text-sm text-muted-foreground">
                                  {contact.department}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getEntityIcon(contact)}
                              <span>
                                {getEntityName(contact) || (contact.entity_type === 'internal' ? 'Internal' : '')}
                                {contact.entity_id === 'all_sites' && (
                                  <Badge variant="outline" className="ml-2">Bulk Assignment</Badge>
                                )}
                                {contact.entity_id === 'all_clients' && (
                                  <Badge variant="outline" className="ml-2">Bulk Assignment</Badge>
                                )}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {contact.entity_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleOpenDialog(contact)}>
                                  Edit Contact
                                </DropdownMenuItem>
                                {!contact.is_primary && contact.entity_id && 
                                 contact.entity_id !== 'all_sites' && 
                                 contact.entity_id !== 'all_clients' && (
                                  <DropdownMenuItem onSelect={() => handleSetPrimary(contact)}>
                                    Set as Primary
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onSelect={() => handleDeleteContact(contact.id)}
                                >
                                  Delete Contact
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      <ContactDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        contact={editingContact || undefined}
        onSubmit={handleSubmitContact}
        isSubmitting={isLoading}
        title="Contact"
      />
    </PageLayout>
  );
};

export default Contacts;
