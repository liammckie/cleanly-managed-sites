
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function BillingAmountFields() {
  const form = useFormContext();
  const watchIsContractorPaymentOnly = form.watch('isContractorPaymentOnly');
  
  return (
    <div className="space-y-6">
      {!watchIsContractorPaymentOnly && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
          <FormField
            control={form.control}
            name="currentWeeklyBilling"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Weekly Billing to Client</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    disabled
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="newWeeklyBilling"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Weekly Billing to Client</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
        <FormField
          control={form.control}
          name="currentWeeklyContractorPayment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Weekly Payment to Contractor</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  disabled
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="newWeeklyContractorPayment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Weekly Payment to Contractor</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
