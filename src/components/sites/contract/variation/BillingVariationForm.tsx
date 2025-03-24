
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSite } from '@/hooks/useSite';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ArrowLeft, CalendarIcon, Save, Loader2 } from 'lucide-react';
import { contractHistoryApi } from '@/lib/api/sites/contractHistoryApi';
import { useSiteUpdate } from '@/hooks/useSiteUpdate';
import { BillingLine } from '@/components/sites/forms/types/billingTypes';

// Schema for the form validation
const BillingVariationSchema = z.object({
  isContractorPaymentOnly: z.boolean().default(false),
  reasonForVariation: z.string().min(5, 'Reason for variation is required'),
  variationDetails: z.string().optional(),
  effectiveDate: z.date({
    required_error: "Effective date is required",
  }),
  currentWeeklyBilling: z.number().nonnegative().optional(),
  newWeeklyBilling: z.number().nonnegative().optional(),
  currentWeeklyContractorPayment: z.number().nonnegative().optional(),
  newWeeklyContractorPayment: z.number().nonnegative().optional(),
  contractExtended: z.boolean().default(false),
  currentExpiryDate: z.date().optional(),
  newExpiryDate: z.date().optional(),
  updateBillingLines: z.boolean().default(false),
});

type BillingVariationFormValues = z.infer<typeof BillingVariationSchema>;

export function BillingVariationForm() {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const { site, isLoading } = useSite(siteId);
  const { updateSiteMutation } = useSiteUpdate();
  const [isSaving, setIsSaving] = useState(false);
  const [billingLines, setBillingLines] = useState<BillingLine[]>([]);
  
  const form = useForm<BillingVariationFormValues>({
    resolver: zodResolver(BillingVariationSchema),
    defaultValues: {
      isContractorPaymentOnly: false,
      reasonForVariation: '',
      variationDetails: '',
      contractExtended: false,
      updateBillingLines: false,
    }
  });
  
  // Pre-fill form with current site data
  useEffect(() => {
    if (site) {
      // Set billing lines
      if (site.billing_details?.billingLines) {
        setBillingLines(site.billing_details.billingLines);
      }
      
      // Extract weekly amounts
      const currentWeeklyBilling = site.weekly_revenue || 0;
      const currentWeeklyContractorPayment = 
        site.job_specifications?.weeklyContractorCost || 
        (site.monthly_cost ? site.monthly_cost / 4 : 0);
      
      // Extract dates
      const currentExpiryDate = site.contract_details?.endDate 
        ? new Date(site.contract_details.endDate) 
        : undefined;
      
      form.reset({
        ...form.getValues(),
        currentWeeklyBilling,
        newWeeklyBilling: currentWeeklyBilling,
        currentWeeklyContractorPayment,
        newWeeklyContractorPayment: currentWeeklyContractorPayment,
        currentExpiryDate,
        effectiveDate: new Date(),
      });
    }
  }, [site, form]);
  
  const watchIsContractorPaymentOnly = form.watch('isContractorPaymentOnly');
  const watchContractExtended = form.watch('contractExtended');
  const watchUpdateBillingLines = form.watch('updateBillingLines');
  
  const calculateMonthlyAmount = (weeklyAmount: number) => {
    return weeklyAmount * 52 / 12;
  };
  
  const calculateAnnualAmount = (weeklyAmount: number) => {
    return weeklyAmount * 52;
  };
  
  const onSubmit = async (data: BillingVariationFormValues) => {
    if (!siteId || !site) return;
    
    try {
      setIsSaving(true);
      
      // Create deep copy of existing data to avoid reference issues
      const updatedSite = JSON.parse(JSON.stringify(site));
      const updatedContractDetails = { ...(updatedSite.contract_details || {}) };
      const updatedBillingDetails = { ...(updatedSite.billing_details || {}) };
      const updatedJobSpecifications = { ...(updatedSite.job_specifications || {}) };
      
      // Format the variation notes for the history entry
      const variationNotes = `
        Billing Variation: ${data.reasonForVariation}
        Effective Date: ${format(data.effectiveDate, 'yyyy-MM-dd')}
        ${data.variationDetails ? `Details: ${data.variationDetails}` : ''}
        ${!data.isContractorPaymentOnly ? 
          `Weekly Client Billing: ${data.currentWeeklyBilling} → ${data.newWeeklyBilling}` : ''}
        Weekly Contractor Payment: ${data.currentWeeklyContractorPayment} → ${data.newWeeklyContractorPayment}
        ${data.contractExtended ? 
          `Contract Expiry: ${data.currentExpiryDate ? format(data.currentExpiryDate, 'yyyy-MM-dd') : 'N/A'} → ${data.newExpiryDate ? format(data.newExpiryDate, 'yyyy-MM-dd') : 'N/A'}` : ''}
      `.trim();
      
      // Update billing amounts
      if (!data.isContractorPaymentOnly && data.newWeeklyBilling !== undefined) {
        updatedSite.weekly_revenue = data.newWeeklyBilling;
        updatedSite.monthly_revenue = calculateMonthlyAmount(data.newWeeklyBilling);
        updatedSite.annual_revenue = calculateAnnualAmount(data.newWeeklyBilling);
      }
      
      // Update contractor payment
      if (data.newWeeklyContractorPayment !== undefined) {
        updatedJobSpecifications.weeklyContractorCost = data.newWeeklyContractorPayment;
        updatedJobSpecifications.monthlyContractorCost = 
          calculateMonthlyAmount(data.newWeeklyContractorPayment);
        updatedJobSpecifications.annualContractorCost = 
          calculateAnnualAmount(data.newWeeklyContractorPayment);
        updatedSite.monthly_cost = calculateMonthlyAmount(data.newWeeklyContractorPayment);
      }
      
      // Update contract expiry if extended
      if (data.contractExtended && data.newExpiryDate) {
        updatedContractDetails.endDate = format(data.newExpiryDate, 'yyyy-MM-dd');
      }
      
      // Save the current contract details as history first
      await contractHistoryApi.saveContractVersion(
        siteId, 
        site.contract_details || {}, 
        `Before billing variation: ${data.reasonForVariation}`
      );
      
      // Update the site with new details
      updatedSite.job_specifications = updatedJobSpecifications;
      updatedSite.contract_details = updatedContractDetails;
      updatedSite.billing_details = updatedBillingDetails;
      
      // Save the updated site
      await updateSiteMutation.mutateAsync({
        id: siteId,
        data: updatedSite
      });
      
      // Save the new contract details as history
      await contractHistoryApi.saveContractVersion(
        siteId,
        updatedContractDetails,
        variationNotes
      );
      
      toast.success("Contract variation saved successfully");
      navigate(`/sites/${siteId}`);
    } catch (error) {
      console.error("Error saving contract variation:", error);
      toast.error("Failed to save contract variation");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!site) {
    return (
      <div className="text-center py-8">
        <p>Site not found</p>
        <Button onClick={() => navigate('/sites')} className="mt-4">
          Return to Sites
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate(`/sites/${siteId}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Site
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Contract Billing Variation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h2 className="text-xl font-semibold">{site.name}</h2>
            <p className="text-muted-foreground">Client: {site.client_name}</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="isContractorPaymentOnly"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Contractor Payment Variation Only</FormLabel>
                      <FormDescription>
                        Check this if you're only updating the contractor payment and not the client billing
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reasonForVariation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Variation</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Annual price increase, Scope change" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="variationDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Details of Variation</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the changes in detail. Note if additional areas have been added to scope, cleaning days changed, etc."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="effectiveDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Effective Date of Variation</FormLabel>
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
              
              <div className="pt-6 flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/sites/${siteId}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Variation
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
