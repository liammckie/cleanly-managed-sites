
import React, { useState } from 'react';
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

interface WorkOrderFormProps {
  site: SiteRecord;
  onSuccess?: () => void;
}

export const WorkOrderForm = ({ site, onSuccess }: WorkOrderFormProps) => {
  const navigate = useNavigate();
  const { createWorkOrderMutation } = useWorkOrders();
  const { subcontractors = [], isLoading: isLoadingSubcontractors } = useSubcontractors(site.id);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const form = useForm<CreateWorkOrderData>({
    defaultValues: {
      title: '',
      description: '',
      site_id: site.id,
      priority: 'medium',
      requires_purchase_order: site.billing_details?.purchaseOrderRequired || false,
    },
  });

  const onSubmit = async (data: CreateWorkOrderData) => {
    // Format the date if selected
    if (selectedDate) {
      data.due_date = format(selectedDate, 'yyyy-MM-dd');
    }

    await createWorkOrderMutation.mutateAsync(data);
    if (onSuccess) {
      onSuccess();
    } else {
      navigate(`/sites/${site.id}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={() => navigate(`/sites/${site.id}`)}>
            Cancel
          </Button>
          <Button type="submit" disabled={createWorkOrderMutation.isPending}>
            {createWorkOrderMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Work Order
          </Button>
        </div>
      </form>
    </Form>
  );
};
