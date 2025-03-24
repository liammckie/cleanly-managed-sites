
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ClientDashboard } from '@/components/clients/ClientDashboard';
import { ContractValueMetrics } from '@/components/contracts/ContractValueMetrics';
import { ContractorsDashboard } from '@/components/contractors/ContractorsDashboard';
import { WorkOrderMetrics } from '@/components/workorders/WorkOrderMetrics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { WorkOrderTemplate } from '@/lib/api/workorders/types';
import { getAllTemplates } from '@/lib/templates/workOrderTemplates';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSites } from '@/hooks/useSites';
import { SiteSelector } from '@/components/workorders/site-selection/SiteSelector';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const navigate = useNavigate();
  const { sites } = useSites();
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<WorkOrderTemplate | null>(null);
  
  const popularTemplates = getAllTemplates()
    .filter(template => template.activityType === 'cleaning')
    .slice(0, 4);
  
  const handleTemplateSelect = (template: WorkOrderTemplate) => {
    setSelectedTemplate(template);
    setOpen(true);
  };
  
  const handleSiteSelect = (site: any) => {
    setOpen(false);
    
    // Navigate to create work order page with template data
    navigate(`/workorders/create?site=${site.id}&template=${selectedTemplate?.id}`);
  };
  
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
            <p className="text-muted-foreground mb-6">
              Welcome to your dashboard. This is where you can manage your business data.
            </p>
            
            <div className="space-y-8">
              <ContractValueMetrics />
              
              <WorkOrderMetrics />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium">Quick Actions</h3>
                  <Button variant="outline" size="sm" onClick={() => navigate('/workorders/create')}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Work Order
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {popularTemplates.map((template) => (
                    <Card 
                      key={template.id} 
                      className="cursor-pointer hover:border-primary transition-all"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{template.title}</CardTitle>
                          <Badge variant="outline">Cleaning</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <CardDescription className="line-clamp-2 h-10">
                          {template.description}
                        </CardDescription>
                        <div className="mt-2 flex justify-between text-xs">
                          <span>Est. Cost: ${template.estimatedCost}</span>
                          <span>Billing: ${template.billingAmount}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ClientDashboard />
                <ContractorsDashboard />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select a site for {selectedTemplate?.title}</DialogTitle>
          </DialogHeader>
          <SiteSelector sites={sites} onSiteSelect={handleSiteSelect} />
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Dashboard;
