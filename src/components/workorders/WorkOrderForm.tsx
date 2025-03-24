
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { CreateWorkOrderData } from '@/lib/api/workorders/types';
import { useWorkOrders } from '@/hooks/useWorkOrders';
import { useSubcontractors } from '@/hooks/useSubcontractors';
import { SiteRecord } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { format } from 'date-fns';
import { 
  BasicFields, 
  PriorityAndAssignmentFields, 
  CostFields,
  PurchaseOrderFields
} from './form/WorkOrderFormFields';
import { DateSelector } from './form/DateSelector';
import { FileAttachments } from './form/FileAttachments';
import { WorkOrderAttachment } from '@/hooks/useGoogleDriveFiles';
import { Checkbox } from '@/components/ui/checkbox';
import { WorkOrderTemplate } from '@/lib/api/workorders/types';
import { TemplateSelector } from './form/TemplateSelector';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getTemplateById } from '@/lib/templates/workOrderTemplates';
import { ErrorBoundary } from '@/components/ui/error-boundary/ErrorBoundary';

interface WorkOrderFormProps {
  site: SiteRecord;
  onSuccess?: () => void;
  templateId?: string;
}

export const WorkOrderForm = ({ site, onSuccess, templateId }: WorkOrderFormProps) => {
  const navigate = useNavigate();
  const { createWorkOrderMutation, createAndCompleteWorkOrderMutation } = useWorkOrders();
  const { subcontractors = [], isLoading: isLoadingSubcontractors } = useSubcontractors(site.id);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [attachments, setAttachments] = useState<WorkOrderAttachment[]>([]);
  const [markAsCompleted, setMarkAsCompleted] = useState(false);

  const form = useForm<CreateWorkOrderData>({
    defaultValues: {
      title: '',
      description: '',
      site_id: site.id,
      priority: 'medium',
      requires_purchase_order: site.billing_details?.purchaseOrderRequired || false,
    },
  });

  useEffect(() => {
    if (templateId) {
      const template = getTemplateById(templateId);
      if (template) {
        handleTemplateSelect(template);
      }
    }
  }, [templateId]);

  const handleTemplateSelect = (template: WorkOrderTemplate) => {
    form.setValue('title', template.title);
    form.setValue('description', template.description);
    
    if (template.priority) {
      form.setValue('priority', template.priority);
    }
    
    if (template.estimatedCost !== undefined) {
      form.setValue('estimated_cost', template.estimatedCost);
    }
    
    if (template.billingAmount !== undefined) {
      form.setValue('billing_amount', template.billingAmount);
    }
    
    if (template.requiresPurchaseOrder !== undefined) {
      form.setValue('requires_purchase_order', template.requiresPurchaseOrder);
    }
  };

  const onSubmit = async (data: CreateWorkOrderData) => {
    if (selectedDate) {
      data.due_date = format(selectedDate, 'yyyy-MM-dd');
    }

    if (attachments.length > 0) {
      data.attachments = attachments;
    }

    if (markAsCompleted) {
      await createAndCompleteWorkOrderMutation.mutateAsync(data);
    } else {
      await createWorkOrderMutation.mutateAsync(data);
    }
    
    if (onSuccess) {
      onSuccess();
    } else {
      navigate(`/sites/${site.id}`);
    }
  };

  const tempWorkOrderId = React.useMemo(() => crypto.randomUUID(), []);

  const isPending = createWorkOrderMutation.isPending || createAndCompleteWorkOrderMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ErrorBoundary>
          <TemplateSelector 
            onTemplateSelect={handleTemplateSelect} 
            siteName={site.name}
            dueDate={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined}
          />
        </ErrorBoundary>
        
        <Separator />
        
        <BasicFields form={form} />
        
        <PriorityAndAssignmentFields 
          form={form} 
          subcontractors={subcontractors} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateSelector 
            label="Due Date" 
            date={selectedDate} 
            onDateChange={setSelectedDate} 
          />
          
          <div className="space-y-2">
            {form.formState.errors.due_date && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.due_date.message}
              </p>
            )}
          </div>
        </div>
        
        <CostFields form={form} />
        
        <PurchaseOrderFields form={form} />
        
        <FileAttachments
          workOrderId={tempWorkOrderId}
          workOrderTitle={form.watch('title') || 'New Work Order'}
          attachments={attachments}
          onAttachmentsChange={setAttachments}
        />

        <div className="flex items-center space-x-2 py-2">
          <Checkbox 
            id="markAsCompleted" 
            checked={markAsCompleted} 
            onCheckedChange={(checked) => setMarkAsCompleted(checked === true)}
          />
          <label
            htmlFor="markAsCompleted"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            This job is already completed
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={() => navigate(`/sites/${site.id}`)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {markAsCompleted ? 'Create & Complete Work Order' : 'Create Work Order'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
