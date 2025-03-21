
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CreateWorkOrderData } from '@/lib/api/workorders/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface BasicFieldsProps {
  form: UseFormReturn<CreateWorkOrderData>;
}

export const BasicFields = ({ form }: BasicFieldsProps) => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export const PriorityAndAssignmentFields = ({ 
  form, 
  subcontractors 
}: BasicFieldsProps & { 
  subcontractors: { id: string; business_name: string }[] 
}) => {
  return (
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
  );
};

export const CostFields = ({ form }: BasicFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
};

export const PurchaseOrderFields = ({ form }: BasicFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="requires_purchase_order"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-2">
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
    </>
  );
};
