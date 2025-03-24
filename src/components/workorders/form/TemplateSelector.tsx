
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CheckIcon, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  getAllTemplates, 
  getTemplatesByActivityType, 
  processTemplateDescription 
} from '@/lib/templates/workOrderTemplates';
import { WorkOrderActivityType, WorkOrderTemplate } from '@/lib/api/workorders/types';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TemplateSelectorProps {
  onTemplateSelect: (template: WorkOrderTemplate) => void;
  siteName: string;
  dueDate?: string;
}

export const TemplateSelector = ({ onTemplateSelect, siteName, dueDate }: TemplateSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<WorkOrderTemplate | null>(null);
  const [activeTab, setActiveTab] = useState<WorkOrderActivityType>('cleaning');
  
  const templates = getTemplatesByActivityType(activeTab);
  
  const handleTemplateSelect = (template: WorkOrderTemplate) => {
    // Process the template description to replace placeholders
    const processedTemplate = {
      ...template,
      description: processTemplateDescription(
        template.description,
        siteName,
        dueDate
      )
    };
    
    setSelectedTemplate(processedTemplate);
    onTemplateSelect(processedTemplate);
    setOpen(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Work Order Templates</h3>
        <p className="text-sm text-muted-foreground">
          Select a template to pre-fill the work order details.
        </p>
      </div>
      
      <Tabs defaultValue="cleaning" value={activeTab} onValueChange={(value) => setActiveTab(value as WorkOrderActivityType)}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="cleaning">Cleaning</TabsTrigger>
          <TabsTrigger value="pest_control" disabled>Pest Control</TabsTrigger>
          <TabsTrigger value="grounds_maintenance" disabled>Grounds</TabsTrigger>
          <TabsTrigger value="waste_management" disabled>Waste</TabsTrigger>
          <TabsTrigger value="hygiene_services" disabled>Hygiene</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cleaning" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card 
                key={template.id} 
                className={cn(
                  "cursor-pointer transition-all hover:border-primary",
                  selectedTemplate?.id === template.id ? "border-2 border-primary" : ""
                )}
                onClick={() => handleTemplateSelect(template)}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-base">{template.title}</CardTitle>
                  <CardDescription className="text-xs">
                    Est. Cost: ${template.estimatedCost} | Billing: ${template.billingAmount}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm">{processTemplateDescription(
                    template.description,
                    siteName,
                    dueDate
                  )}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="pest_control">
          <div className="p-8 text-center text-muted-foreground">
            Pest control templates coming soon
          </div>
        </TabsContent>
        
        <TabsContent value="grounds_maintenance">
          <div className="p-8 text-center text-muted-foreground">
            Grounds maintenance templates coming soon
          </div>
        </TabsContent>
        
        <TabsContent value="waste_management">
          <div className="p-8 text-center text-muted-foreground">
            Waste management templates coming soon
          </div>
        </TabsContent>
        
        <TabsContent value="hygiene_services">
          <div className="p-8 text-center text-muted-foreground">
            Hygiene services templates coming soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
