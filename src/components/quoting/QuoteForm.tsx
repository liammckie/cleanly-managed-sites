
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { Quote } from '@/lib/award/types';
import { useCreateQuote, useUpdateQuote, useOverheadProfiles } from '@/hooks/useQuotes';
import { ShiftPlanner } from './ShiftPlanner';
import { SubcontractorSection } from './SubcontractorSection';
import { QuoteSummary } from './QuoteSummary';

interface QuoteFormProps {
  quoteId?: string;
  initialData?: Quote;
}

export function QuoteForm({ quoteId, initialData }: QuoteFormProps) {
  const navigate = useNavigate();
  const { mutateAsync: createQuote, isPending: isCreating } = useCreateQuote();
  const { mutateAsync: updateQuote, isPending: isUpdating } = useUpdateQuote();
  const { data: overheadProfiles = [] } = useOverheadProfiles();
  
  const [shifts, setShifts] = useState(initialData?.shifts || []);
  const [subcontractors, setSubcontractors] = useState(initialData?.subcontractors || []);
  const [activeTab, setActiveTab] = useState('details');
  
  const isEditMode = !!quoteId;
  const isPending = isCreating || isUpdating;
  
  const form = useForm<any>({
    defaultValues: {
      name: initialData?.name || '',
      clientName: initialData?.clientName || '',
      siteName: initialData?.siteName || '',
      status: initialData?.status || 'draft',
      startDate: initialData?.startDate ? new Date(initialData.startDate) : undefined,
      endDate: initialData?.endDate ? new Date(initialData.endDate) : undefined,
      expiryDate: initialData?.expiryDate ? new Date(initialData.expiryDate) : undefined,
      contractLength: initialData?.contractLength || 12,
      contractLengthUnit: initialData?.contractLengthUnit || 'months',
      overheadProfile: initialData?.overheadProfile || 'standard',
      overheadPercentage: initialData?.overheadPercentage || 15,
      marginPercentage: initialData?.marginPercentage || 20,
      notes: initialData?.notes || '',
    }
  });
  
  // Update end date when start date and contract length change
  useEffect(() => {
    const startDate = form.watch('startDate');
    const contractLength = form.watch('contractLength');
    const contractLengthUnit = form.watch('contractLengthUnit');
    
    if (startDate && contractLength) {
      const endDate = new Date(startDate);
      
      switch (contractLengthUnit) {
        case 'days':
          endDate.setDate(endDate.getDate() + contractLength);
          break;
        case 'weeks':
          endDate.setDate(endDate.getDate() + (contractLength * 7));
          break;
        case 'months':
          endDate.setMonth(endDate.getMonth() + contractLength);
          break;
        case 'years':
          endDate.setFullYear(endDate.getFullYear() + contractLength);
          break;
      }
      
      form.setValue('endDate', endDate);
    }
  }, [form.watch('startDate'), form.watch('contractLength'), form.watch('contractLengthUnit')]);
  
  // Update overhead percentage when profile changes
  useEffect(() => {
    const overheadProfileId = form.watch('overheadProfile');
    const selectedProfile = overheadProfiles.find(p => p.id === overheadProfileId);
    
    if (selectedProfile) {
      form.setValue('overheadPercentage', selectedProfile.laborPercentage);
    }
  }, [form.watch('overheadProfile'), overheadProfiles]);
  
  const onSubmit = async (data: any) => {
    try {
      // Calculate costs based on the shifts, subcontractors, and overhead/margin
      const laborCost = shifts.reduce((sum, shift) => sum + shift.estimatedCost, 0);
      const subcontractorCost = subcontractors.reduce((sum, sub) => sum + sub.cost, 0);
      const overheadCost = (laborCost * data.overheadPercentage) / 100;
      const totalCost = laborCost + subcontractorCost + overheadCost;
      const marginAmount = (totalCost * data.marginPercentage) / 100;
      const totalPrice = totalCost + marginAmount;
      
      const quoteData = {
        ...data,
        shifts,
        subcontractors,
        laborCost,
        overheadCost,
        subcontractorCost,
        totalCost,
        marginAmount,
        totalPrice,
        startDate: data.startDate ? format(data.startDate, 'yyyy-MM-dd') : undefined,
        endDate: data.endDate ? format(data.endDate, 'yyyy-MM-dd') : undefined,
        expiryDate: data.expiryDate ? format(data.expiryDate, 'yyyy-MM-dd') : undefined,
        createdBy: 'user1' // In a real app, this would be the current user's ID
      };
      
      if (isEditMode && initialData) {
        await updateQuote({
          ...initialData,
          ...quoteData
        });
        navigate(`/quoting/${quoteId}`);
      } else {
        const newQuote = await createQuote(quoteData as any);
        navigate(`/quoting/${newQuote.id}`);
      }
    } catch (error) {
      console.error('Error saving quote:', error);
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Quote' : 'Create New Quote'}</h1>
          <p className="text-muted-foreground">
            {isEditMode 
              ? 'Update quote details, shifts, and pricing' 
              : 'Create a new quote with shifts, overhead, and margin'}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/quoting')}>
            Cancel
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? 'Update Quote' : 'Create Quote'}
          </Button>
        </div>
      </div>
      
      <Tabs 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="details">Quote Details</TabsTrigger>
          <TabsTrigger value="shifts">Shifts & Labor</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Summary</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic details for this quote
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quote Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., XYZ Office Building Cleaning" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        A descriptive name for this quote
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Client name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Site or location name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
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
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="contractLength"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contract Length</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1} 
                              {...field} 
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contractLengthUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="days">Days</SelectItem>
                              <SelectItem value="weeks">Weeks</SelectItem>
                              <SelectItem value="months">Months</SelectItem>
                              <SelectItem value="years">Years</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date (Auto-calculated)</FormLabel>
                        <FormControl>
                          <Input 
                            disabled 
                            value={field.value ? format(field.value, "PPP") : ''} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Quote Expiry Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
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
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Additional notes or requirements" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate('/quoting')}>
                  Cancel
                </Button>
                <Button onClick={() => setActiveTab('shifts')}>
                  Continue to Shifts
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="shifts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Labor Planning</CardTitle>
                <CardDescription>
                  Plan cleaning shifts and add any subcontractors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Accordion 
                  type="single" 
                  collapsible
                  defaultValue="shifts"
                >
                  <AccordionItem value="shifts">
                    <AccordionTrigger>Shift Planner</AccordionTrigger>
                    <AccordionContent>
                      <ShiftPlanner
                        shifts={shifts}
                        onShiftsChange={setShifts}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="subcontractors">
                    <AccordionTrigger>Subcontractors</AccordionTrigger>
                    <AccordionContent>
                      <SubcontractorSection 
                        subcontractors={subcontractors}
                        onSubcontractorsChange={setSubcontractors}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('details')}>
                  Back to Details
                </Button>
                <Button onClick={() => setActiveTab('pricing')}>
                  Continue to Pricing
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Summary</CardTitle>
                <CardDescription>
                  Set overhead and margin for the quote
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="overheadProfile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overhead Profile</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select profile" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {overheadProfiles.map(profile => (
                              <SelectItem key={profile.id} value={profile.id}>
                                {profile.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Predefined overhead configurations
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="overheadPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overhead Percentage (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0} 
                            max={100} 
                            step={0.1}
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Percentage of labor cost to add as overhead
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="marginPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Margin Percentage (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0} 
                          max={100} 
                          step={0.1}
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Percentage of total cost (labor + overhead) to add as margin
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Quote Summary</h3>
                  <QuoteSummary 
                    shifts={shifts}
                    subcontractors={subcontractors}
                    overheadPercentage={form.watch('overheadPercentage')}
                    marginPercentage={form.watch('marginPercentage')}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('shifts')}>
                  Back to Shifts
                </Button>
                <Button 
                  onClick={form.handleSubmit(onSubmit)} 
                  disabled={isPending}
                >
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditMode ? 'Update Quote' : 'Create Quote'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Form>
      </Tabs>
    </div>
  );
}
