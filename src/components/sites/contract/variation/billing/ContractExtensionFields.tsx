
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function ContractExtensionFields() {
  const form = useFormContext();
  const { watch } = form;
  const contractExtended = watch('contractExtended');
  const currentExpiryDate = watch('currentExpiryDate');

  return (
    <div className="mt-8 mb-6 border rounded-lg p-5 bg-white">
      <h3 className="text-lg font-semibold mb-4">Contract Extension</h3>
      
      <FormField
        control={form.control}
        name="contractExtended"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Extend Contract End Date</FormLabel>
              <FormDescription>
                Set a new expiry date for the contract with this variation
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      {contractExtended && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <FormItem className="flex flex-col">
            <FormLabel>Current Expiry Date</FormLabel>
            <div className="flex h-10 w-full rounded-md border border-input bg-gray-100 px-3 py-2 text-sm text-muted-foreground">
              {currentExpiryDate ? format(currentExpiryDate, 'PPP') : 'Not set'}
            </div>
          </FormItem>
          
          <FormField
            control={form.control}
            name="newExpiryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>New Expiry Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Select a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
