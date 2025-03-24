
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ClipboardList } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { WorkOrderTemplate } from '@/lib/api/workorders/types';
import { getAllTemplates } from '@/lib/templates/workOrderTemplates';
import { SiteSelector } from '@/components/workorders/site-selection/SiteSelector';
import { SiteRecord } from '@/lib/types';

interface QuickActionsProps {
  sites: SiteRecord[];
}

export function QuickActions({ sites }: QuickActionsProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<WorkOrderTemplate | null>(null);
  
  // Get only the first few templates for quick actions
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
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium">Quick Actions</h3>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Templates
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {getAllTemplates()
                  .filter(template => template.activityType === 'cleaning')
                  .slice(0, 10)
                  .map((template) => (
                    <DropdownMenuItem 
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      {template.title}
                    </DropdownMenuItem>
                  ))
                }
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="sm" onClick={() => navigate('/workorders/create')}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Work Order
            </Button>
          </div>
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
              </CardContent>
            </Card>
          ))}
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
    </>
  );
}
