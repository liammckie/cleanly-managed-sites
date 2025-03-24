import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Building, 
  Users, 
  FileText, 
  AlertTriangle, 
  Calendar,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useBusinessLocations } from '@/hooks/useBusinessLocations';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const MyBusiness = () => {
  const [activeTab, setActiveTab] = useState('locations');
  const { 
    locations, 
    isLoading, 
    isAddDialogOpen, 
    handleOpenAddDialog, 
    closeAddDialog,
    handleCreateLocation,
    handleDeleteLocation
  } = useBusinessLocations();

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <main className="flex-1 overflow-y-auto py-6">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Building className="h-8 w-8" />
                    My Business
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Manage your business locations, employees, and documents
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleOpenAddDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Location
                  </Button>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-card border">
                  <TabsTrigger value="locations" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Locations
                  </TabsTrigger>
                  <TabsTrigger value="employees" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Employees
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documents
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Calendar
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="locations">
                  <BusinessLocationsContent 
                    locations={locations}
                    isLoading={isLoading}
                    onAddLocation={handleOpenAddDialog}
                    onDeleteLocation={handleDeleteLocation}
                  />
                </TabsContent>
                
                <TabsContent value="employees">
                  <EmployeesContent />
                </TabsContent>
                
                <TabsContent value="documents">
                  <DocumentsContent />
                </TabsContent>
                
                <TabsContent value="calendar">
                  <CalendarContent />
                </TabsContent>
              </Tabs>
            </div>
          </main>

          <AddLocationDialog 
            isOpen={isAddDialogOpen} 
            onClose={closeAddDialog} 
            onSave={handleCreateLocation} 
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

const BusinessLocationsContent = ({ 
  locations = [], 
  isLoading = false,
  onAddLocation,
  onDeleteLocation
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {locations.map((location) => (
        <Card 
          key={location.id}
          className="overflow-hidden border border-border hover:border-primary/20 transition-colors"
        >
          <div className="relative h-48 bg-muted">
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <Building className="h-20 w-20 text-gray-400" />
            </div>
          </div>
          <CardHeader>
            <CardTitle>{location.name}</CardTitle>
            <CardDescription>
              {location.address}, {location.city} {location.state} {location.postcode}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm">
              <span>{location.type}</span>
              <span>{location.documents?.length || 0} Documents</span>
            </div>
            <div className="mt-4 space-y-2">
              <Button variant="outline" className="w-full">View Details</Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full" 
                onClick={() => onDeleteLocation(location.id)}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Card className="overflow-hidden border border-border hover:border-primary/20 transition-colors">
        <div className="relative h-48 bg-muted flex items-center justify-center border-b border-dashed border-border">
          <Plus className="h-12 w-12 text-muted-foreground" />
        </div>
        <CardHeader>
          <CardTitle>Add New Location</CardTitle>
          <CardDescription>Create a new business location</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={onAddLocation}>Add Location</Button>
        </CardContent>
      </Card>
    </div>
  );
};

const EmployeesContent = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
          <CardDescription>Manage your business employees</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">
            Employee list will be displayed here. This tab will integrate with the existing employee management system.
          </p>
          <div className="flex justify-center">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DocumentsContent = () => {
  return (
    <div className="space-y-6">
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-red-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Expiring Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex justify-between p-2 bg-white rounded border border-red-200">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-red-500" />
                <span>Business Insurance Policy</span>
              </div>
              <span className="text-red-600 font-medium">Expires in 15 days</span>
            </li>
            <li className="flex justify-between p-2 bg-white rounded border border-red-200">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-red-500" />
                <span>Workers Compensation</span>
              </div>
              <span className="text-red-600 font-medium">Expires in 30 days</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Business Documents</CardTitle>
          <CardDescription>Manage your business documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            <div className="py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Business Registration</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Valid until Dec 31, 2024</span>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </div>
            <div className="py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Public Liability Insurance</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Valid until Oct 15, 2024</span>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </div>
            <div className="py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Tax File Number Certificate</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Never expires</span>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Upload New Document
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const CalendarContent = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Calendar</CardTitle>
          <CardDescription>Important dates and reminders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted rounded flex items-center justify-center">
            <p className="text-muted-foreground">Calendar functionality will be integrated here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AddLocationDialog = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'branch',
    address: '',
    city: '',
    state: '',
    postcode: '',
    country: 'Australia',
    phone: '',
    email: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      type: 'branch',
      address: '',
      city: '',
      state: '',
      postcode: '',
      country: 'Australia',
      phone: '',
      email: '',
      notes: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleReset}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Business Location</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Location Name *</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">Location Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="head_office">Head Office</option>
                <option value="branch">Branch</option>
                <option value="warehouse">Warehouse</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">Address *</label>
              <input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">City</label>
                <input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium">State</label>
                <input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="postcode" className="text-sm font-medium">Postcode</label>
                <input
                  id="postcode"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium">Country</label>
                <input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  type="email"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full p-2 border rounded h-20"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleReset}>
              Cancel
            </Button>
            <Button type="submit">
              Save Location
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MyBusiness;
