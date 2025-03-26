import React, { useEffect, useState } from 'react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar,
  Check,
  CircleHelp, 
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { SiteFormData } from '../types/siteFormTypes';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PeriodicalsStepProps {
  formData: SiteFormData;
  onUpdate: (data: Partial<SiteFormData>) => void;
}

interface PeriodicalsFormValues {
  glazing: boolean;
  ceilings: boolean;
  upholstery: boolean;
  sanitizing: boolean;
  pressureWashing: boolean;
  nextGlazingDate?: Date;
  nextCeilingsDate?: Date;
  nextUpholsteryDate?: Date;
  nextSanitizingDate?: Date;
  nextPressureWashingDate?: Date;
  glazingFrequency?: string;
  ceilingsFrequency?: string;
  upholsteryFrequency?: string;
  sanitizingFrequency?: string;
  pressureWashingFrequency?: string;
  notes?: string;
}

const DEFAULT_FORM_VALUES: PeriodicalsFormValues = {
  glazing: false,
  ceilings: false,
  upholstery: false,
  sanitizing: false,
  pressureWashing: false,
  glazingFrequency: 'quarterly',
  ceilingsFrequency: 'annually',
  upholsteryFrequency: 'biannually',
  sanitizingFrequency: 'monthly',
  pressureWashingFrequency: 'annually',
  notes: '',
};

const frequencyOptions = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'biannually', label: 'Bi-annually' },
  { value: 'annually', label: 'Annually' },
  { value: 'custom', label: 'Custom' },
];

export const PeriodicalsStep: React.FC<PeriodicalsStepProps> = ({ formData, onUpdate }) => {
  const form = useForm<PeriodicalsFormValues>({
    defaultValues: DEFAULT_FORM_VALUES,
  });
  
  useEffect(() => {
    if (formData.periodicals) {
      const periodicals = formData.periodicals;
      form.reset({
        glazing: periodicals.glazing || false,
        ceilings: periodicals.ceilings || false,
        upholstery: periodicals.upholstery || false,
        sanitizing: periodicals.sanitizing || false,
        pressureWashing: periodicals.pressureWashing || false,
        nextGlazingDate: periodicals.nextGlazingDate ? new Date(periodicals.nextGlazingDate) : undefined,
        nextCeilingsDate: periodicals.nextCeilingsDate ? new Date(periodicals.nextCeilingsDate) : undefined,
        nextUpholsteryDate: periodicals.nextUpholsteryDate ? new Date(periodicals.nextUpholsteryDate) : undefined,
        nextSanitizingDate: periodicals.nextSanitizingDate ? new Date(periodicals.nextSanitizingDate) : undefined,
        nextPressureWashingDate: periodicals.nextPressureWashingDate ? new Date(periodicals.nextPressureWashingDate) : undefined,
        glazingFrequency: periodicals.glazingFrequency || 'quarterly',
        ceilingsFrequency: periodicals.ceilingsFrequency || 'annually',
        upholsteryFrequency: periodicals.upholsteryFrequency || 'biannually',
        sanitizingFrequency: periodicals.sanitizingFrequency || 'monthly',
        pressureWashingFrequency: periodicals.pressureWashingFrequency || 'annually',
        notes: periodicals.notes || '',
      });
    }
  }, [formData.periodicals, form]);

  const watchValues = form.watch();
  const [showForm, setShowForm] = useState(
    watchValues.glazing || 
    watchValues.ceilings || 
    watchValues.upholstery || 
    watchValues.sanitizing || 
    watchValues.pressureWashing
  );
  
  useEffect(() => {
    setShowForm(
      watchValues.glazing || 
      watchValues.ceilings || 
      watchValues.upholstery || 
      watchValues.sanitizing || 
      watchValues.pressureWashing
    );
  }, [
    watchValues.glazing, 
    watchValues.ceilings, 
    watchValues.upholstery, 
    watchValues.sanitizing, 
    watchValues.pressureWashing
  ]);
  
  useEffect(() => {
    const { 
      glazing, ceilings, upholstery, sanitizing, pressureWashing,
      nextGlazingDate, nextCeilingsDate, nextUpholsteryDate, nextSanitizingDate, nextPressureWashingDate,
      glazingFrequency, ceilingsFrequency, upholsteryFrequency, sanitizingFrequency, pressureWashingFrequency,
      notes
    } = form.getValues();
    
    onUpdate({
      periodicals: {
        glazing,
        ceilings,
        upholstery,
        sanitizing,
        ...(pressureWashing && { pressureWashing }),
        
        ...(nextGlazingDate && { nextGlazingDate: nextGlazingDate.toISOString().split('T')[0] }),
        ...(nextCeilingsDate && { nextCeilingsDate: nextCeilingsDate.toISOString().split('T')[0] }),
        ...(nextUpholsteryDate && { nextUpholsteryDate: nextUpholsteryDate.toISOString().split('T')[0] }),
        ...(nextSanitizingDate && { nextSanitizingDate: nextSanitizingDate.toISOString().split('T')[0] }),
        ...(nextPressureWashingDate && { nextPressureWashingDate: nextPressureWashingDate.toISOString().split('T')[0] }),
        
        glazingFrequency,
        ceilingsFrequency,
        upholsteryFrequency,
        sanitizingFrequency,
        pressureWashingFrequency,
        
        notes
      }
    });
  }, [watchValues, onUpdate, form]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Periodic Tasks & Services</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name="glazing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between gap-2 space-y-0">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Glazing/Window Cleaning</FormLabel>
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <CircleHelp className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-medium">Glazing/Window Cleaning</h4>
                          <p className="text-sm text-muted-foreground">
                            Regular cleaning of windows, glass doors, partitions, and other glass surfaces.
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name="ceilings"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between gap-2 space-y-0">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Ceiling/High Dusting</FormLabel>
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <CircleHelp className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-medium">Ceiling/High Dusting</h4>
                          <p className="text-sm text-muted-foreground">
                            Cleaning of ceiling fixtures, vents, high shelves, and other hard-to-reach areas.
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name="upholstery"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between gap-2 space-y-0">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Carpet/Upholstery Cleaning</FormLabel>
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <CircleHelp className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-medium">Carpet/Upholstery Cleaning</h4>
                          <p className="text-sm text-muted-foreground">
                            Deep cleaning of carpets, rugs, chairs, sofas, and other upholstered furniture.
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name="sanitizing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between gap-2 space-y-0">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Sanitizing/Disinfection</FormLabel>
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <CircleHelp className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-medium">Sanitizing/Disinfection</h4>
                          <p className="text-sm text-muted-foreground">
                            Thorough disinfection of high-touch surfaces and spaces to reduce pathogens.
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name="pressureWashing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between gap-2 space-y-0">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Pressure Washing</FormLabel>
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <CircleHelp className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-medium">Pressure Washing</h4>
                          <p className="text-sm text-muted-foreground">
                            Cleaning of exterior surfaces, walkways, and building facades using high-pressure water.
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
            
            {showForm && (
              <Accordion type="single" collapsible defaultValue="service-details">
                <AccordionItem value="service-details">
                  <AccordionTrigger>Service Details & Scheduling</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6 mt-4">
                      {watchValues.glazing && (
                        <div className="rounded-md border p-4">
                          <h3 className="font-medium mb-4">Glazing/Window Cleaning Details</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Frequency</Label>
                              <Select
                                value={form.watch('glazingFrequency')}
                                onValueChange={val => form.setValue('glazingFrequency', val)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                  {frequencyOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Next Scheduled Date</Label>
                              <FormField
                                control={form.control}
                                name="nextGlazingDate"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
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
                                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
                                          mode="single"
                                          selected={field.value}
                                          onSelect={field.onChange}
                                          disabled={(date) =>
                                            date < new Date(new Date().setHours(0, 0, 0, 0))
                                          }
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {watchValues.ceilings && (
                        <div className="rounded-md border p-4">
                          <h3 className="font-medium mb-4">Ceiling/High Dusting Details</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Frequency</Label>
                              <Select
                                value={form.watch('ceilingsFrequency')}
                                onValueChange={val => form.setValue('ceilingsFrequency', val)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                  {frequencyOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Next Scheduled Date</Label>
                              <FormField
                                control={form.control}
                                name="nextCeilingsDate"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
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
                                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
                                          mode="single"
                                          selected={field.value}
                                          onSelect={field.onChange}
                                          disabled={(date) =>
                                            date < new Date(new Date().setHours(0, 0, 0, 0))
                                          }
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </FormItem>
                                  )}
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {watchValues.upholstery && (
                        <div className="rounded-md border p-4">
                          <h3 className="font-medium mb-4">Carpet/Upholstery Cleaning Details</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Frequency</Label>
                              <Select
                                value={form.watch('upholsteryFrequency')}
                                onValueChange={val => form.setValue('upholsteryFrequency', val)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                  {frequencyOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Next Scheduled Date</Label>
                              <FormField
                                control={form.control}
                                name="nextUpholsteryDate"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
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
                                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
                                          mode="single"
                                          selected={field.value}
                                          onSelect={field.onChange}
                                          disabled={(date) =>
                                            date < new Date(new Date().setHours(0, 0, 0, 0))
                                          }
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </FormItem>
                                  )}
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {watchValues.sanitizing && (
                        <div className="rounded-md border p-4">
                          <h3 className="font-medium mb-4">Sanitizing/Disinfection Details</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Frequency</Label>
                              <Select
                                value={form.watch('sanitizingFrequency')}
                                onValueChange={val => form.setValue('sanitizingFrequency', val)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                  {frequencyOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Next Scheduled Date</Label>
                              <FormField
                                control={form.control}
                                name="nextSanitizingDate"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
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
                                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
                                          mode="single"
                                          selected={field.value}
                                          onSelect={field.onChange}
                                          disabled={(date) =>
                                            date < new Date(new Date().setHours(0, 0, 0, 0))
                                          }
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </FormItem>
                                  )}
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {watchValues.pressureWashing && (
                        <div className="rounded-md border p-4">
                          <h3 className="font-medium mb-4">Pressure Washing Details</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Frequency</Label>
                              <Select
                                value={form.watch('pressureWashingFrequency')}
                                onValueChange={val => form.setValue('pressureWashingFrequency', val)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                  {frequencyOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Next Scheduled Date</Label>
                              <FormField
                                control={form.control}
                                name="nextPressureWashingDate"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
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
                                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
                                          mode="single"
                                          selected={field.value}
                                          onSelect={field.onChange}
                                          disabled={(date) =>
                                            date < new Date(new Date().setHours(0, 0, 0, 0))
                                          }
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </FormItem>
                                  )}
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  placeholder="Any additional information about periodic services..."
                                  className="min-h-24"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            
            {!showForm && (
              <div className="flex items-center justify-center p-8 border border-dashed rounded-md">
                <div className="text-center space-y-2">
                  <Info className="w-8 h-8 mx-auto text-muted-foreground" />
                  <h3 className="font-medium">No Periodic Services Selected</h3>
                  <p className="text-sm text-muted-foreground">
                    Toggle the switches above to add periodic cleaning services.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};
