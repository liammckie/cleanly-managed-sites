
import React, { useState } from 'react';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { useContacts } from '@/hooks/useContacts'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter, MoreHorizontal, User, Building2, Briefcase, Users } from 'lucide-react';
import { ContactManagementTabs } from '@/components/contacts/ContactManagementTabs';

const Contacts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isNewContactDialogOpen, setIsNewContactDialogOpen] = useState(false);

  return (
    <PageLayout>
      <div className="container py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Contacts Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage all your contacts across clients, sites, suppliers, and internal staff
              </p>
            </div>
            
            <Button onClick={() => setIsNewContactDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Contact
            </Button>
          </div>

          <ContactManagementTabs />

          <div className="flex flex-col md:flex-row gap-4 mb-6 mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Filter by</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contacts</SelectItem>
                <SelectItem value="client">Client Contacts</SelectItem>
                <SelectItem value="site">Site Contacts</SelectItem>
                <SelectItem value="supplier">Supplier Contacts</SelectItem>
                <SelectItem value="internal">Internal Contacts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader className="px-6 py-4">
              <CardTitle>All Contacts</CardTitle>
              <CardDescription>
                View and manage all your contacts in one place
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role / Position</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Example client contact */}
                  <TableRow>
                    <TableCell className="font-medium">Jane Smith</TableCell>
                    <TableCell>Operations Manager</TableCell>
                    <TableCell>Acme Corporation</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center w-fit gap-1">
                        <Building2 className="h-3 w-3" />
                        Client
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">jane.smith@acme.com</span>
                        <span className="text-xs text-muted-foreground">+1 (555) 123-4567</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                          <DropdownMenuItem>Delete Contact</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {/* Example site contact */}
                  <TableRow>
                    <TableCell className="font-medium">John Doe</TableCell>
                    <TableCell>Site Manager</TableCell>
                    <TableCell>Downtown Location</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center w-fit gap-1">
                        <Building2 className="h-3 w-3" />
                        Site
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">john.doe@acme.com</span>
                        <span className="text-xs text-muted-foreground">+1 (555) 987-6543</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                          <DropdownMenuItem>Delete Contact</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {/* Example supplier contact */}
                  <TableRow>
                    <TableCell className="font-medium">Robert Johnson</TableCell>
                    <TableCell>Sales Representative</TableCell>
                    <TableCell>Supplier Co.</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center w-fit gap-1">
                        <Briefcase className="h-3 w-3" />
                        Supplier
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">robert@supplier.com</span>
                        <span className="text-xs text-muted-foreground">+1 (555) 333-4444</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                          <DropdownMenuItem>Delete Contact</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {/* Example internal contact */}
                  <TableRow>
                    <TableCell className="font-medium">Emily Williams</TableCell>
                    <TableCell>HR Manager</TableCell>
                    <TableCell>Internal Staff</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center w-fit gap-1">
                        <Users className="h-3 w-3" />
                        Internal
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">emily@company.com</span>
                        <span className="text-xs text-muted-foreground">+1 (555) 777-8888</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                          <DropdownMenuItem>Delete Contact</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* New Contact Dialog */}
          <Dialog open={isNewContactDialogOpen} onOpenChange={setIsNewContactDialogOpen}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
                <DialogDescription>
                  Create a new contact and associate it with a client, site, supplier, or internal staff.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="first-name" className="text-sm font-medium">
                      First Name
                    </label>
                    <Input id="first-name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="last-name" className="text-sm font-medium">
                      Last Name
                    </label>
                    <Input id="last-name" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" type="email" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone
                  </label>
                  <Input id="phone" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">
                    Role / Position
                  </label>
                  <Input id="role" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-type" className="text-sm font-medium">
                    Contact Type
                  </label>
                  <Select defaultValue="client">
                    <SelectTrigger id="contact-type">
                      <SelectValue placeholder="Select contact type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client Contact</SelectItem>
                      <SelectItem value="site">Site Contact</SelectItem>
                      <SelectItem value="supplier">Supplier Contact</SelectItem>
                      <SelectItem value="internal">Internal Contact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="entity" className="text-sm font-medium">
                    Associated Entity
                  </label>
                  <Select defaultValue="">
                    <SelectTrigger id="entity">
                      <SelectValue placeholder="Select entity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entity1">Acme Corporation</SelectItem>
                      <SelectItem value="entity2">Downtown Location</SelectItem>
                      <SelectItem value="entity3">Supplier Co.</SelectItem>
                      <SelectItem value="entity4">Internal Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewContactDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Contact</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </PageLayout>
  );
};

export default Contacts;
