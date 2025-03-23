
import React, { useState } from 'react';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ContactManagementTabs } from '@/components/contacts/ContactManagementTabs';
import { ContactDialog } from '@/components/contacts/ContactDialog';
import { useContacts } from '@/hooks/useContacts';
import { ContactRecord } from '@/lib/types';
import { 
  Search, 
  UserPlus, 
  Star, 
  Mail, 
  Phone,
  MoreHorizontal 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Contacts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const { 
    contacts, 
    isLoading, 
    error,
    addContact,
    updateContact,
    deleteContact,
    setPrimaryContact
  } = useContacts();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleAddContact = async (contactData: Partial<ContactRecord>) => {
    await addContact(contactData as any);
  };

  const handleSetPrimary = async (contact: ContactRecord) => {
    if (contact.id && contact.entity_id && contact.entity_type) {
      await setPrimaryContact(contact.id, contact.entity_id, contact.entity_type);
    }
  };

  const handleDeleteContact = async (id: string) => {
    await deleteContact(id);
  };

  const filteredContacts = React.useMemo(() => {
    let filtered = [...contacts];
    
    // Filter by tab (entity type)
    if (activeTab !== 'all') {
      filtered = filtered.filter(contact => contact.entity_type === activeTab);
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(contact => {
        return (
          (contact.name && contact.name.toLowerCase().includes(searchLower)) ||
          (contact.email && contact.email.toLowerCase().includes(searchLower)) ||
          (contact.role && contact.role.toLowerCase().includes(searchLower)) ||
          (contact.department && contact.department.toLowerCase().includes(searchLower))
        );
      });
    }
    
    return filtered;
  }, [contacts, activeTab, searchTerm]);

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
            <ContactDialog
              onSubmit={handleAddContact}
              title="Add New Contact"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search contacts..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <ContactManagementTabs onValueChange={handleTabChange} />
            
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact Details</TableHead>
                      <TableHead>Department/Role</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          Loading contacts...
                        </TableCell>
                      </TableRow>
                    ) : filteredContacts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No contacts found. Add your first contact to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredContacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {contact.name}
                              {contact.is_primary && (
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
                                <ContactDialog
                                  contact={contact}
                                  onSubmit={(data) => updateContact(contact.id, data)}
                                  trigger={
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                      Edit Contact
                                    </DropdownMenuItem>
                                  }
                                />
                                {!contact.is_primary && (
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
    </PageLayout>
  );
};

export default Contacts;
