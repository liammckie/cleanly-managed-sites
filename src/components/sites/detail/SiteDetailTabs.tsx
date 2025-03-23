
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SiteRecord } from '@/lib/api';
import { OverviewTab } from './tabs/OverviewTab';
import { SubcontractorsTab } from './tabs/SubcontractorsTab';
import { PeriodicalsTab } from './tabs/PeriodicalsTab';
import { JobSpecificationsTab } from './tabs/JobSpecificationsTab';
import { SuppliesTab } from './tabs/SuppliesTab';
import { SecurityTab } from './tabs/SecurityTab';
import { ContractsTab } from './tabs/ContractsTab';
import { Button } from '@/components/ui/button';
import { ContactDialog } from '@/components/contacts/ContactDialog';
import { contactsApi } from '@/lib/api';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  FileText, 
  Package, 
  Shield, 
  FileContract, 
  UserPlus
} from 'lucide-react';

interface SiteDetailTabsProps {
  site: SiteRecord;
}

export function SiteDetailTabs({ site }: SiteDetailTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleContactSubmit = async (data: any) => {
    // Add entity_id and entity_type if not already set
    if (!data.entity_id) {
      data.entity_id = site.id;
    }
    if (!data.entity_type) {
      data.entity_type = 'site';
    }
    
    if (data.id) {
      // Update existing contact
      return contactsApi.updateContact(data.id, data);
    } else {
      // Create new contact
      return contactsApi.createContact(data);
    }
  };

  const refreshTabs = () => {
    setRefreshKey(prev => prev + 1);
  };

  const navigateToTab = (tab: string) => {
    setActiveTab(tab);
  };
  
  return (
    <div className="space-y-6" key={refreshKey}>
      {/* Quick Navigation Buttons */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1" 
          onClick={() => navigateToTab('overview')}
        >
          <Users size={16} />
          <span>Contacts</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1" 
          onClick={() => navigateToTab('subcontractors')}
        >
          <Briefcase size={16} />
          <span>Subcontractors</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1" 
          onClick={() => navigateToTab('periodicals')}
        >
          <Calendar size={16} />
          <span>Periodicals</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1" 
          onClick={() => navigateToTab('job')}
        >
          <FileText size={16} />
          <span>Job Specs</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1" 
          onClick={() => navigateToTab('supplies')}
        >
          <Package size={16} />
          <span>Supplies</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1" 
          onClick={() => navigateToTab('security')}
        >
          <Shield size={16} />
          <span>Security</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1" 
          onClick={() => navigateToTab('contracts')}
        >
          <FileContract size={16} />
          <span>Contracts</span>
        </Button>
        <ContactDialog
          entityType="site"
          entityId={site.id}
          onSubmit={handleContactSubmit}
          onSuccess={refreshTabs}
          trigger={
            <Button variant="default" size="sm" className="gap-1">
              <UserPlus size={16} />
              <span>Add Contact</span>
            </Button>
          }
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="glass-card grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subcontractors">Subcontractors</TabsTrigger>
          <TabsTrigger value="periodicals">Periodicals</TabsTrigger>
          <TabsTrigger value="job">Job Specs</TabsTrigger>
          <TabsTrigger value="supplies">Supplies</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0 animate-slide-in">
          <OverviewTab site={site} onContactAdded={refreshTabs} />
        </TabsContent>
        
        <TabsContent value="subcontractors" className="mt-0 animate-slide-in">
          <SubcontractorsTab site={site} />
        </TabsContent>
        
        <TabsContent value="periodicals" className="mt-0 animate-slide-in">
          <PeriodicalsTab site={site} />
        </TabsContent>
        
        <TabsContent value="job" className="mt-0 animate-slide-in">
          <JobSpecificationsTab site={site} />
        </TabsContent>
        
        <TabsContent value="supplies" className="mt-0 animate-slide-in">
          <SuppliesTab site={site} />
        </TabsContent>
        
        <TabsContent value="security" className="mt-0 animate-slide-in">
          <SecurityTab site={site} />
        </TabsContent>
        
        <TabsContent value="contracts" className="mt-0 animate-slide-in">
          <ContractsTab site={site} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
