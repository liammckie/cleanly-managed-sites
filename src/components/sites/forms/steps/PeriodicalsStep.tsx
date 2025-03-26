
import React, { useEffect, useState } from 'react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useForm, useFormContext } from "react-hook-form";
import { Periodicals } from '../types/periodicalTypes';
import { SiteFormData } from '../types/siteFormData';

export interface PeriodicalsStepProps {
  formData: SiteFormData;
  handleDoubleNestedChange: (section: string, subsection: string, field: string, value: any) => void;
}

export const PeriodicalsStep: React.FC<PeriodicalsStepProps> = ({
  formData,
  handleDoubleNestedChange
}) => {
  const [selectedTab, setSelectedTab] = useState("glazing");
  const form = useFormContext();
  
  // Initialize periodicals if not present
  useEffect(() => {
    if (!formData.periodicals) {
      handleDoubleNestedChange('periodicals', '', 'notes', '');
    }
  }, [formData, handleDoubleNestedChange]);
  
  // Frequency options
  const frequencyOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "fortnightly", label: "Fortnightly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "biannual", label: "Bi-Annual" },
    { value: "annual", label: "Annual" },
    { value: "custom", label: "Custom" }
  ];
  
  // Handle changes to periodical services
  const handlePeriodicalChange = (field: string, value: boolean) => {
    handleDoubleNestedChange('periodicals', '', field, value);
  };
  
  // Handle changes to nested periodical fields
  const handleNestedPeriodicalChange = (section: string, field: string, value: any) => {
    handleDoubleNestedChange('periodicals', section, field, value);
  };
  
  // Handle frequency selection
  const handleFrequencyChange = (service: string, value: string) => {
    handleDoubleNestedChange('periodicals', '', `${service}Frequency`, value);
  };
  
  // Handle next date changes
  const handleDateChange = (service: string, date: Date) => {
    handleDoubleNestedChange(
      'periodicals', 
      '', 
      `next${service.charAt(0).toUpperCase() + service.slice(1)}Date`, 
      date ? format(date, "yyyy-MM-dd") : null
    );
  };
  
  // Get current values
  const periodicals = formData.periodicals || {};
  const glazing = periodicals.glazing || false;
  const ceilings = periodicals.ceilings || false;
  const upholstery = periodicals.upholstery || false;
  const sanitizing = periodicals.sanitizing || false;
  const pressureWashing = periodicals.pressureWashing || false;
  const nextGlazingDate = periodicals.nextGlazingDate ? new Date(periodicals.nextGlazingDate) : undefined;
  const nextCeilingsDate = periodicals.nextCeilingsDate ? new Date(periodicals.nextCeilingsDate) : undefined;
  const nextUpholsteryDate = periodicals.nextUpholsteryDate ? new Date(periodicals.nextUpholsteryDate) : undefined;
  const nextSanitizingDate = periodicals.nextSanitizingDate ? new Date(periodicals.nextSanitizingDate) : undefined;
  const nextPressureWashingDate = periodicals.nextPressureWashingDate ? new Date(periodicals.nextPressureWashingDate) : undefined;
  const glazingFrequency = periodicals.glazingFrequency || '';
  const ceilingsFrequency = periodicals.ceilingsFrequency || '';
  const upholsteryFrequency = periodicals.upholsteryFrequency || '';
  const sanitizingFrequency = periodicals.sanitizingFrequency || '';
  const pressureWashingFrequency = periodicals.pressureWashingFrequency || '';
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Periodical Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="glazing" 
                  checked={glazing} 
                  onCheckedChange={(checked) => handlePeriodicalChange('glazing', checked === true)}
                />
                <label htmlFor="glazing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Glazing
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="ceilings" 
                  checked={ceilings} 
                  onCheckedChange={(checked) => handlePeriodicalChange('ceilings', checked === true)}
                />
                <label htmlFor="ceilings" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Ceilings
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="upholstery" 
                  checked={upholstery}
                  onCheckedChange={(checked) => handlePeriodicalChange('upholstery', checked === true)}
                />
                <label htmlFor="upholstery" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Upholstery
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sanitizing" 
                  checked={sanitizing}
                  onCheckedChange={(checked) => handlePeriodicalChange('sanitizing', checked === true)}
                />
                <label htmlFor="sanitizing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Sanitizing
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="pressureWashing" 
                  checked={pressureWashing}
                  onCheckedChange={(checked) => handlePeriodicalChange('pressureWashing', checked === true)}
                />
                <label htmlFor="pressureWashing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Pressure Washing
                </label>
              </div>
            </div>
            
            {(glazing || ceilings || upholstery || sanitizing || pressureWashing) && (
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full">
                  {glazing && (
                    <TabsTrigger value="glazing">Glazing</TabsTrigger>
                  )}
                  {ceilings && (
                    <TabsTrigger value="ceilings">Ceilings</TabsTrigger>
                  )}
                  {upholstery && (
                    <TabsTrigger value="upholstery">Upholstery</TabsTrigger>
                  )}
                  {sanitizing && (
                    <TabsTrigger value="sanitizing">Sanitizing</TabsTrigger>
                  )}
                  {pressureWashing && (
                    <TabsTrigger value="pressureWashing">Pressure Washing</TabsTrigger>
                  )}
                </TabsList>
                
                {glazing && (
                  <TabsContent value="glazing" className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <FormField
                          control={form.control}
                          name="periodicals.glazingFrequency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Frequency</FormLabel>
                              <Select
                                value={glazingFrequency}
                                onValueChange={(value) => handleFrequencyChange('glazing', value)}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {frequencyOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="periodicals.nextGlazingDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Next Scheduled Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {nextGlazingDate ? (
                                        format(nextGlazingDate, "PPP")
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
                                    selected={nextGlazingDate}
                                    onSelect={(date) => handleDateChange('glazing', date as Date)}
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
                  </TabsContent>
                )}
                
                {ceilings && (
                  <TabsContent value="ceilings" className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <FormField
                          control={form.control}
                          name="periodicals.ceilingsFrequency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Frequency</FormLabel>
                              <Select
                                value={ceilingsFrequency}
                                onValueChange={(value) => handleFrequencyChange('ceilings', value)}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {frequencyOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="periodicals.nextCeilingsDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Next Scheduled Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {nextCeilingsDate ? (
                                        format(nextCeilingsDate, "PPP")
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
                                    selected={nextCeilingsDate}
                                    onSelect={(date) => handleDateChange('ceilings', date as Date)}
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
                  </TabsContent>
                )}
                
                {upholstery && (
                  <TabsContent value="upholstery" className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <FormField
                          control={form.control}
                          name="periodicals.upholsteryFrequency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Frequency</FormLabel>
                              <Select
                                value={upholsteryFrequency}
                                onValueChange={(value) => handleFrequencyChange('upholstery', value)}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {frequencyOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="periodicals.nextUpholsteryDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Next Scheduled Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {nextUpholsteryDate ? (
                                        format(nextUpholsteryDate, "PPP")
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
                                    selected={nextUpholsteryDate}
                                    onSelect={(date) => handleDateChange('upholstery', date as Date)}
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
                  </TabsContent>
                )}
                
                {sanitizing && (
                  <TabsContent value="sanitizing" className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <FormField
                          control={form.control}
                          name="periodicals.sanitizingFrequency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Frequency</FormLabel>
                              <Select
                                value={sanitizingFrequency}
                                onValueChange={(value) => handleFrequencyChange('sanitizing', value)}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {frequencyOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="periodicals.nextSanitizingDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Next Scheduled Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {nextSanitizingDate ? (
                                        format(nextSanitizingDate, "PPP")
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
                                    selected={nextSanitizingDate}
                                    onSelect={(date) => handleDateChange('sanitizing', date as Date)}
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
                  </TabsContent>
                )}
                
                {pressureWashing && (
                  <TabsContent value="pressureWashing" className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <FormField
                          control={form.control}
                          name="periodicals.pressureWashingFrequency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Frequency</FormLabel>
                              <Select
                                value={pressureWashingFrequency}
                                onValueChange={(value) => handleFrequencyChange('pressureWashing', value)}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {frequencyOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="periodicals.nextPressureWashingDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Next Scheduled Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {nextPressureWashingDate ? (
                                        format(nextPressureWashingDate, "PPP")
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
                                    selected={nextPressureWashingDate}
                                    onSelect={(date) => handleDateChange('pressureWashing', date as Date)}
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
                  </TabsContent>
                )}
              </Tabs>
            )}
            
            <div>
              <FormField
                control={form.control}
                name="periodicals.notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter any notes about periodical services..." 
                        className="min-h-[120px]"
                        value={periodicals.notes || ''}
                        onChange={(e) => handleDoubleNestedChange('periodicals', '', 'notes', e.target.value)}
                      />
                    </FormControl>
                    <FormDescription>
                      Add any special instructions or additional information about periodical services.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
