
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

interface SiteDetailTabsProps {
  site: SiteRecord;
}

export function SiteDetailTabs({ site }: SiteDetailTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
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
        <OverviewTab site={site} />
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
  );
}
