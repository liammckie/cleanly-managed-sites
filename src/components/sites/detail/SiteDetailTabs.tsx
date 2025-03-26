
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SiteRecord } from '@/lib/types';
import { SiteOverview } from './SiteOverview';
import ContractDetails from '../contract/ContractDetails';

interface SiteDetailTabsProps {
  site: SiteRecord;
  isLoading: boolean;
  refetchSite: () => void;
}

export const SiteDetailTabs: React.FC<SiteDetailTabsProps> = ({
  site,
  isLoading,
  refetchSite
}) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="contract">Contract</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="contacts">Contacts</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <SiteOverview site={site} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="contract">
        <ContractDetails 
          contractDetails={site.contract_details}
          site={site}
          refetchSite={refetchSite}
        />
      </TabsContent>
      
      <TabsContent value="billing">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Billing details will be added here */}
          <div className="text-center p-8">
            <p className="text-muted-foreground">
              Billing details component to be implemented
            </p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="services">
        <div className="text-center p-8">
          <p className="text-muted-foreground">
            Services details component to be implemented
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="contacts">
        <div className="text-center p-8">
          <p className="text-muted-foreground">
            Contacts component to be implemented
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="documents">
        <div className="text-center p-8">
          <p className="text-muted-foreground">
            Documents component to be implemented
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};
