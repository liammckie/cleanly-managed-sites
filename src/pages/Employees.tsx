import React, { useState } from 'react';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Card } from '@/components/ui/card';
import { ContactDialog } from '@/components/contacts/ContactDialog';
import { useContacts } from '@/hooks/useContacts';
import { ContactRecord } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Search, 
  Plus, 
  Briefcase, 
  Calendar, 
  Clock, 
  FileText 
} from 'lucide-react';
import { toast } from 'sonner';

const Employees = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('directory');
  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    contacts, 
    isLoading, 
    addContact,
    updateContact,
    deleteContact,
    setFilters
  } = useContacts({ entityType: 'internal' });

  const filteredEmployees = contacts?.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (employee.department && employee.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenDialog = (contact?: ContactRecord) => {
    setEditingContact(contact || null);
    setDialogOpen(true);
  };

  const handleSubmitContact = async (contactData: Partial<ContactRecord>): Promise<void> => {
    try {
      if (contactData.id) {
        await updateContact(contactData.id, contactData);
        toast.success('Employee updated successfully');
      } else {
        await addContact(contactData as Omit<ContactRecord, 'id' | 'created_at' | 'updated_at'>);
        toast.success('Employee added successfully');
      }
      setDialogOpen(false);
    } catch (error) {
      console.error('Error handling employee:', error);
      toast.error('Failed to save employee');
      throw error;
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteContact(id);
        toast.success('Employee deleted successfully');
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Failed to delete employee');
      }
    }
  };

  return (
    <PageLayout>
      <div className="container py-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Employee Management</h1>
            <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="directory" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Employee Directory
              </TabsTrigger>
              <TabsTrigger value="roster" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Roster
              </TabsTrigger>
              <TabsTrigger value="leave" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Leave Management
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="directory">
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search employees..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <Card>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Employment</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">Loading employees...</TableCell>
                        </TableRow>
                      ) : filteredEmployees && filteredEmployees.length > 0 ? (
                        filteredEmployees.map(employee => {
                          const services = employee.services as any || {};
                          return (
                            <TableRow key={employee.id}>
                              <TableCell className="font-medium">{employee.name}</TableCell>
                              <TableCell>{services.position || employee.role}</TableCell>
                              <TableCell>{employee.department || '-'}</TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  {employee.email && <span className="text-sm">{employee.email}</span>}
                                  {employee.phone && <span className="text-sm">{employee.phone}</span>}
                                </div>
                              </TableCell>
                              <TableCell>
                                {services.employmentType && (
                                  <span className="capitalize">{services.employmentType.replace('-', ' ')}</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleOpenDialog(employee)}
                                  >
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleDeleteContact(employee.id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            {searchQuery ? 'No employees match your search.' : 'No employees found.'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="roster">
              <Card className="p-6">
                <div className="flex items-center justify-center min-h-[300px]">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Roster Management</h3>
                    <p className="mt-2 text-muted-foreground max-w-md">
                      Create and manage employee schedules, shifts, and assignments. 
                      Assign Client Service Managers to sites.
                    </p>
                    <Button className="mt-4" disabled>Coming Soon</Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="leave">
              <Card className="p-6">
                <div className="flex items-center justify-center min-h-[300px]">
                  <div className="text-center">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Leave Management</h3>
                    <p className="mt-2 text-muted-foreground max-w-md">
                      Track and manage employee leave requests, approvals, and balances.
                      View leave history and plan for upcoming absences.
                    </p>
                    <Button className="mt-4" disabled>Coming Soon</Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card className="p-6">
                <div className="flex items-center justify-center min-h-[300px]">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Document Management</h3>
                    <p className="mt-2 text-muted-foreground max-w-md">
                      Upload, store, and manage employee documents such as contracts,
                      certifications, and performance reviews.
                    </p>
                    <Button className="mt-4" disabled>Coming Soon</Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <ContactDialog
          isOpen={open} 
          onClose={() => setOpen(false)}
          contact={selectedContact} 
          entityType="internal"
          onSubmit={handleSubmitContact}
          isSubmitting={isSubmitting}
          title="Add New Employee"
        />
      </div>
    </PageLayout>
  );
};

export default Employees;
