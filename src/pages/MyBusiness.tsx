
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Users, 
  Building2, 
  FileText, 
  Settings,
  Briefcase 
} from 'lucide-react';
import { useBusinessLocations } from '@/hooks/useBusinessLocations';

const MyBusiness = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { locations } = useBusinessLocations();

  const handleEmployeesClick = () => {
    navigate('/employees');
  };

  return (
    <PageLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Business</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
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
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <BusinessOverview locations={locations} />
          </TabsContent>
          
          <TabsContent value="locations">
            <LocationsContent locations={locations} />
          </TabsContent>
          
          <TabsContent value="employees">
            <EmployeesContent onEmployeesClick={handleEmployeesClick} />
          </TabsContent>
          
          <TabsContent value="documents">
            <DocumentsContent />
          </TabsContent>
          
          <TabsContent value="settings">
            <BusinessSettingsContent />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

const BusinessOverview = ({ locations }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Summary</CardTitle>
          <CardDescription>Overview of your business operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Locations:</span>
              <span className="font-medium">{locations?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Locations:</span>
              <span className="font-medium">{locations?.filter(l => l.is_active)?.length || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
          <CardDescription>Frequently used business functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <Button variant="outline" className="justify-start" asChild>
              <a href="/employees">
                <Users className="mr-2 h-4 w-4" />
                Manage Employees
              </a>
            </Button>
            <Button variant="outline" className="justify-start">
              <Building2 className="mr-2 h-4 w-4" />
              Add New Location
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const LocationsContent = ({ locations }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Business Locations</h2>
        <Button>
          <Building2 className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>
      
      {locations && locations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location) => (
            <Card key={location.id}>
              <CardHeader>
                <CardTitle>{location.name}</CardTitle>
                <CardDescription>{location.type.replace('_', ' ')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{location.address}</p>
                  {location.city && (
                    <p className="text-sm">
                      {location.city}, {location.state} {location.postcode}
                    </p>
                  )}
                  {location.phone && <p className="text-sm">Phone: {location.phone}</p>}
                  
                  <div className="pt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
            <Building2 className="h-12 w-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground">No business locations found. Add your first location to get started.</p>
            <Button>
              <Building2 className="mr-2 h-4 w-4" />
              Add First Location
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const EmployeesContent = ({ onEmployeesClick }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
          <CardDescription>Manage your business employees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <p className="text-center text-muted-foreground max-w-md">
              Employee management is available on the dedicated Employees page. Click below to navigate to the full employee management system.
            </p>
            <Button onClick={onEmployeesClick}>
              <Users className="mr-2 h-4 w-4" />
              Go to Employees
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
      <Card>
        <CardHeader>
          <CardTitle>Business Documents</CardTitle>
          <CardDescription>Manage business licenses, insurances, and other important documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground max-w-md">
              Upload and manage your business documents, licenses, and certifications here.
            </p>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const BusinessSettingsContent = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Settings</CardTitle>
          <CardDescription>Configure your business settings and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Settings className="h-12 w-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground max-w-md">
              Configure your business details, branding, and preferences here.
            </p>
            <Button>
              <Settings className="mr-2 h-4 w-4" />
              Edit Business Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyBusiness;
