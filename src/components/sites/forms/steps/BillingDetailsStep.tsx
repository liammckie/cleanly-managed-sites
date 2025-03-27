
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BillingLine } from '@/components/sites/forms/types/billingTypes';
import { BillingLineItem } from '@/components/sites/forms/steps/billing/BillingLineItem';

export function BillingDetailsStep() {
  const form = useFormContext();
  const billingDetails = form.watch('billingDetails') || {};
  
  const handleAddBillingLine = () => {
    // Extract the handler from the form context or props
    if (typeof form.handleAddBillingLine === 'function') {
      form.handleAddBillingLine();
    }
  };
  
  // Ensure billingLines is always initialized
  const billingLines = billingDetails.billingLines || [];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={form.control}
          name="billingDetails.useClientInfo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Use Client Billing Information</FormLabel>
                <FormDescription>
                  Use the client's information for billing purposes
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="billingDetails.clientPO"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client PO Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter client PO number" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="billingDetails.clientReference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Reference</FormLabel>
              <FormControl>
                <Input placeholder="Enter client reference" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="billingDetails.billingFrequency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Billing Frequency</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select billing frequency" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="fortnightly">Fortnightly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="billingDetails.paymentTerms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payment Terms</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="immediate">Due on receipt</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Billing Lines</h3>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleAddBillingLine}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Billing Line
          </Button>
        </div>
        
        {billingLines.length > 0 ? (
          <div className="space-y-4">
            {billingLines.map((line: BillingLine, index: number) => (
              <BillingLineItem 
                key={line.id} 
                line={line} 
                index={index} 
                form={form} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 border rounded-md bg-muted/20">
            <p className="text-sm text-muted-foreground">No billing lines have been added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
