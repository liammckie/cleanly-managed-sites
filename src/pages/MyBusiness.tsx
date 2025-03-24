
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

const MyBusiness = () => {
  const [activeTab, setActiveTab] = useState('locations');

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
                  <Button>
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
                  <BusinessLocationsContent />
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
        </div>
      </div>
    </SidebarProvider>
  );
};

// Location management tab content
const BusinessLocationsContent = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="overflow-hidden border border-border hover:border-primary/20 transition-colors">
        <div className="relative h-48 bg-muted">
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Building className="h-20 w-20 text-gray-400" />
          </div>
        </div>
        <CardHeader>
          <CardTitle>Head Office</CardTitle>
          <CardDescription>123 Business Ave, Sydney NSW 2000</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm">
            <span>8 Employees</span>
            <span>5 Documents</span>
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full">View Details</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden border border-border hover:border-primary/20 transition-colors">
        <div className="relative h-48 bg-muted flex items-center justify-center border-b border-dashed border-border">
          <Plus className="h-12 w-12 text-muted-foreground" />
        </div>
        <CardHeader>
          <CardTitle>Add New Location</CardTitle>
          <CardDescription>Create a new business location</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">Add Location</Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Employee management tab content
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

// Document management tab content with expiry warnings
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

// Calendar tab content
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

export default MyBusiness;
