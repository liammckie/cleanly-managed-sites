
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Building2, Users, FileText, Settings } from 'lucide-react';
import { useBusinessLocations } from '@/hooks/useBusinessLocations';

// Import our new component files
import { BusinessOverviewContent } from '@/components/business/BusinessOverviewContent';
import { LocationsContent } from '@/components/business/LocationsContent';
import { EmployeesContent } from '@/components/business/EmployeesContent';
import { DocumentsContent } from '@/components/business/DocumentsContent';
import { BusinessSettingsContent } from '@/components/business/SettingsContent';

const MyBusiness = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { locations } = useBusinessLocations();

  const handleEmployeesClick = () => {
    navigate('/employees');
  };

  const handleAwardEngineClick = () => {
    navigate('/award-engine');
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
            <BusinessOverviewContent 
              locations={locations} 
              onEmployeesClick={handleEmployeesClick}
              onAwardEngineClick={handleAwardEngineClick}
            />
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

export default MyBusiness;
