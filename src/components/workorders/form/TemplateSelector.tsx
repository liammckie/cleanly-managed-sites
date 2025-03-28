
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  getAllTemplates, 
  getTemplatesByActivityType, 
  processTemplateDescription 
} from '@/lib/templates/workOrderTemplates';
import { WorkOrderActivityType, WorkOrderTemplate } from '@/lib/api/workorders/types';
import { FormProvider, useForm } from 'react-hook-form';

interface TemplateSelectorProps {
  onTemplateSelect: (template: WorkOrderTemplate) => void;
  siteName: string;
  dueDate?: string;
}

export const TemplateSelector = ({ onTemplateSelect, siteName, dueDate }: TemplateSelectorProps) => {
  const [useTemplate, setUseTemplate] = useState(false);
  const [activityType, setActivityType] = useState<WorkOrderActivityType>('cleaning');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  
  // Create a form context to avoid React Hook Form errors
  const formMethods = useForm({});
  
  const templates = getTemplatesByActivityType(activityType);
  
  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      // Process the template description to replace placeholders
      const processedTemplate = {
        ...template,
        description: processTemplateDescription(
          template.description,
          siteName,
          dueDate
        )
      };
      
      setSelectedTemplateId(templateId);
      onTemplateSelect(processedTemplate);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="useTemplate" 
          checked={useTemplate} 
          onCheckedChange={(checked) => setUseTemplate(checked === true)}
        />
        <Label htmlFor="useTemplate" className="text-base">Use a template for this work order</Label>
      </div>
      
      {useTemplate && (
        <FormProvider {...formMethods}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activityType">Activity Type</Label>
              <Select 
                value={activityType} 
                onValueChange={(value) => setActivityType(value as WorkOrderActivityType)}
              >
                <SelectTrigger id="activityType" className="bg-background">
                  <SelectValue placeholder="Select Activity Type" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-50 bg-background border border-border shadow-md">
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="pest_control">Pest Control</SelectItem>
                  <SelectItem value="grounds_maintenance">Grounds Maintenance</SelectItem>
                  <SelectItem value="waste_management">Waste Management</SelectItem>
                  <SelectItem value="hygiene_services">Hygiene Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="templateId">Template</Label>
              <Select 
                value={selectedTemplateId} 
                onValueChange={handleTemplateSelect}
              >
                <SelectTrigger id="templateId" className="bg-background">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent 
                  position="popper" 
                  className="z-50 max-h-[300px] bg-background border border-border shadow-md"
                >
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedTemplateId && (
              <div className="rounded-md border p-4 bg-muted/50">
                <div className="text-sm">
                  {templates.find(t => t.id === selectedTemplateId)?.description}
                </div>
              </div>
            )}
          </div>
        </FormProvider>
      )}
    </div>
  );
};
