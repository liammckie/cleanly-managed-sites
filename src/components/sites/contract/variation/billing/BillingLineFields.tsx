
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { BillingLine } from '@/components/sites/forms/types/billingTypes';

interface BillingLineFieldsProps {
  billingLines: BillingLine[];
}

export function BillingLineFields({ billingLines }: BillingLineFieldsProps) {
  const form = useFormContext();
  const watchUpdateBillingLines = form.watch('updateBillingLines');
  
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="updateBillingLines"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Update Billing Lines</FormLabel>
              <FormDescription>
                Would you like to update the billing line descriptions or add new lines?
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
      
      {watchUpdateBillingLines && (
        <div className="p-4 border rounded-md">
          <h3 className="font-medium mb-4">Current Billing Lines</h3>
          
          {billingLines && billingLines.length > 0 ? (
            <div className="space-y-4">
              {billingLines.map((line, index) => (
                <div key={line.id || index} className="grid grid-cols-2 gap-4 p-2 border rounded">
                  <div>
                    <p className="font-medium">Description</p>
                    <p>{line.description}</p>
                  </div>
                  <div>
                    <p className="font-medium">Amount</p>
                    <p>${line.amount.toFixed(2)} ({line.frequency})</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No billing lines defined</p>
          )}
          
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // This is just a placeholder for now
                // In the future we would implement a billing line editor
                toast.info("Billing line editor not implemented yet");
              }}
            >
              Edit Billing Lines
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
