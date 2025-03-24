
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function ContractExtensionFields() {
  const form = useFormContext();
  const watchContractExtended = form.watch('contractExtended');
  
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="contractExtended"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Contract Extended</FormLabel>
              <FormDescription>
                Has the contract been extended as part of this variation?
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
      
      {watchContractExtended && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
          <FormField
            control={form.control}
            name="currentExpiryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Current Expiry Date</FormLabel>
                <Input
                  value={field.value ? format(field.value, "PPP") : "Not set"}
                  disabled
                />
                <FormMessage />
              </FormItem>
            )}
          />
          
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
                          <span>Pick a date</span>
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
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
