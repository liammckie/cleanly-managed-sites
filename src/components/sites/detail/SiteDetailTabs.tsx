
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContractDetails from '../contract/ContractDetails';
import ContactsPanel from '../contacts/ContactsPanel';
import BillingPanel from '../billing/BillingPanel';
import PeriodicalSchedule from '../periodicals/PeriodicalSchedule';
import SubcontractorsList from '../subcontractors/SubcontractorsList';
import SecurityDetailsPanel from '../security/SecurityDetailsPanel';
import JobSpecificationsPanel from '../jobspec/JobSpecificationsPanel';
import ReplenishablesList from '../replenishables/ReplenishablesList';
import NotesPanel from '../notes/NotesPanel';
import WorkOrdersList from '../workorders/WorkOrdersList';
import ContractHistoryTable from '../contract/ContractHistoryTable';
import { useSiteContractHistory } from '@/hooks/useSiteContractHistory';

interface SiteDetailTabsProps {
  site: any;
  refetchSite: () => void;
}

export default function SiteDetailTabs({ site, refetchSite }: SiteDetailTabsProps) {
  const [activeTab, setActiveTab] = React.useState('overview');
  const { 
    history, 
    isLoading: isLoadingContractHistory, 
    currentContractDetails 
  } = useSiteContractHistory(site?.id);

  const getCompletionPercentage = () => {
    // Simple function to calculate how complete the site record is
    let completedSections = 0;
    let totalSections = 8; // Total number of sections to check
    
    if (site?.contract_details && Object.keys(site.contract_details).length > 0) completedSections++;
    if (site?.billing_details && Object.keys(site.billing_details).length > 0) completedSections++;
    if (site?.security_details && Object.keys(site.security_details).length > 0) completedSections++;
    if (site?.job_specifications && Object.keys(site.job_specifications).length > 0) completedSections++;
    if (site?.periodicals && Object.keys(site.periodicals).length > 0) completedSections++;
    if (site?.replenishables && Object.keys(site.replenishables).length > 0) completedSections++;
    if (site?.contacts && site.contacts.length > 0) completedSections++;
    if (site?.notes && site.notes.trim() !== '') completedSections++;
    
    return Math.floor((completedSections / totalSections) * 100);
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 w-full h-auto">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="contract">Contract</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="contacts">Contacts</TabsTrigger>
        <TabsTrigger value="periodicals">Periodicals</TabsTrigger>
        <TabsTrigger value="subcontractors">Subcontractors</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="replenishables">Supplies</TabsTrigger>
        <TabsTrigger value="workorders">Work Orders</TabsTrigger>
      </TabsList>
      
      <div className="mt-6">
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b">
                  <h3 className="text-lg font-medium">Completion Status</h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center">
                    <div className="flex-1 mr-4">
                      <div className="h-3 bg-gray-200 rounded-full">
                        <div 
                          className="h-3 bg-green-500 rounded-full" 
                          style={{ width: `${getCompletionPercentage()}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{getCompletionPercentage()}%</span>
                  </div>
                </div>
              </div>
              
              <NotesPanel site={site} refetchSite={refetchSite} />
            </div>
            
            <div className="space-y-6">
              <ContractDetails site={site} refetchSite={refetchSite} />
              <BillingPanel site={site} refetchSite={refetchSite} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="contract">
          <div className="space-y-6">
            <ContractDetails site={site} refetchSite={refetchSite} />
            <ContractHistoryTable 
              history={history} 
              isLoading={isLoadingContractHistory} 
              currentContractDetails={currentContractDetails} 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="billing">
          <BillingPanel site={site} refetchSite={refetchSite} />
        </TabsContent>
        
        <TabsContent value="contacts">
          <ContactsPanel site={site} refetchSite={refetchSite} />
        </TabsContent>
        
        <TabsContent value="periodicals">
          <PeriodicalSchedule site={site} refetchSite={refetchSite} />
        </TabsContent>
        
        <TabsContent value="subcontractors">
          <SubcontractorsList site={site} refetchSite={refetchSite} />
        </TabsContent>
        
        <TabsContent value="security">
          <SecurityDetailsPanel site={site} refetchSite={refetchSite} />
        </TabsContent>
        
        <TabsContent value="replenishables">
          <ReplenishablesList site={site} refetchSite={refetchSite} />
        </TabsContent>
        
        <TabsContent value="workorders">
          <WorkOrdersList siteId={site?.id} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
