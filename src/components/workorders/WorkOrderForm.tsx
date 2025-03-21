
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { CreateWorkOrderData, WorkOrderPriority } from '@/lib/api/workorders/types';
import { useWorkOrders } from '@/hooks/useWorkOrders';
import { useSubcontractors } from '@/hooks/useSubcontractors';
import { SiteRecord } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

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
      requires_purchase_order: site.billingDetails?.purchaseOrderRequired || false,
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
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work Order Title</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Enter work order title" 
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Describe the work to be done"
                  rows={4}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assigned_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign To</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcontractor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {subcontractors.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.business_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <FormField
            control={form.control}
            name="estimated_cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Cost</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="billing_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billing Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requires_purchase_order"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-6">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Requires Purchase Order</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {form.watch('requires_purchase_order') && (
          <FormField
            control={form.control}
            name="purchase_order_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Order Number</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Enter Purchase Order number" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
