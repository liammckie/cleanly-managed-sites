
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Users, 
  History,
  PencilRuler,
  FileText, 
  Package, 
  UserPlus,
  FileCog,
  Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { contractHistoryApi } from '@/lib/api/sites/contractHistoryApi';
import { ContractHistoryTable } from '../contract/ContractHistoryTable';
import { useContractHistory } from '@/hooks/useContractHistory';

interface SiteDetailTabsProps {
  site: SiteRecord;
}

export function SiteDetailTabs({ site }: SiteDetailTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);
  const [contractHistoryOpen, setContractHistoryOpen] = useState(false);
  const [contractVariationOpen, setContractVariationOpen] = useState(false);
  const navigate = useNavigate();
  const { history, isLoading: isLoadingHistory } = useContractHistory(site.id);
  
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

  const navigateToEditSite = () => {
    navigate(`/sites/${site.id}/edit`);
  };
  
  const createContractVariation = async (notes: string) => {
    try {
      // Only save if we have contract details to save
      if (site.contract_details) {
        await contractHistoryApi.saveContractVersion(site.id, site.contract_details, notes);
        toast.success("Contract variation recorded successfully");
        refreshTabs();
        setContractVariationOpen(false);
      } else {
        toast.error("No contract details available to record");
      }
    } catch (error) {
      console.error("Error saving contract variation:", error);
      toast.error("Failed to record contract variation");
    }
  };
  
  return (
    <div className="space-y-6" key={refreshKey}>
      {/* Functional Action Buttons */}
      <div className="flex flex-wrap gap-2 mt-4">
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
        
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1" 
          onClick={() => setContractHistoryOpen(true)}
        >
          <History size={16} />
          <span>Contract History</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1" 
          onClick={() => setContractVariationOpen(true)}
        >
          <Layers size={16} />
          <span>Record Contract Variation</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1" 
          onClick={navigateToEditSite}
        >
          <FileCog size={16} />
          <span>Edit Site Details</span>
        </Button>
      </div>
      
      {/* Contract History Dialog */}
      <Dialog open={contractHistoryOpen} onOpenChange={setContractHistoryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Contract Version History</DialogTitle>
          </DialogHeader>
          <ContractHistoryTable 
            history={history} 
            isLoading={isLoadingHistory}
            currentContractDetails={site.contract_details}
          />
        </DialogContent>
      </Dialog>
      
      {/* Contract Variation Dialog */}
      <Dialog open={contractVariationOpen} onOpenChange={setContractVariationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Contract Variation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              This will save the current contract details as a new version in the history.
              You can then make changes to the contract by editing the site.
            </p>
            
            <div className="space-y-2">
              <label htmlFor="variation-notes" className="text-sm font-medium">
                Variation Notes
              </label>
              <textarea
                id="variation-notes"
                className="w-full min-h-[100px] p-2 border rounded"
                placeholder="Describe the reason for this contract variation..."
              />
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={() => setContractVariationOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  const notes = (document.getElementById('variation-notes') as HTMLTextAreaElement).value;
                  createContractVariation(notes);
                }}
              >
                Save Version & Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
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
    </div>
  );
}
