
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSite } from '@/hooks/useSite';
import { useContractors } from '@/hooks/useContractors';
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
import { Separator } from '@/components/ui/separator';
import { ContractorRecord } from '@/lib/types';

// Schema for the form validation
const ContractorChangeSchema = z.object({
  currentContractorId: z.string().optional(),
  newContractorId: z.string().min(1, 'New contractor is required'),
  transitionDate: z.date({
    required_error: "Transition date is required",
  }),
  reasonForChange: z.string().min(5, 'Reason for change is required'),
  weeklyPayment: z.number().nonnegative().optional(),
  additionalNotes: z.string().optional(),
});

type ContractorChangeFormValues = z.infer<typeof ContractorChangeSchema>;

export function ContractorChangeForm() {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const { site, isLoading } = useSite(siteId);
  const { contractors, isLoading: isLoadingContractors } = useContractors();
  const { updateSiteMutation } = useSiteUpdate();
  const [isSaving, setIsSaving] = useState(false);
  const [currentContractor, setCurrentContractor] = useState<ContractorRecord | null>(null);
  
  const form = useForm<ContractorChangeFormValues>({
    resolver: zodResolver(ContractorChangeSchema),
    defaultValues: {
      transitionDate: new Date(),
      reasonForChange: '',
      additionalNotes: ''
    }
  });
  
  // Pre-fill form with current site data
  useEffect(() => {
    if (site && contractors.length > 0) {
      let currentContractorId = site.subcontractors?.[0]?.contractor_id;
      let currentWeeklyPayment = site.job_specifications?.weeklyContractorCost || 0;
      
      // If the current contractor ID exists in the list, set more information
      if (currentContractorId) {
        const contractor = contractors.find(c => c.id === currentContractorId);
        if (contractor) {
          setCurrentContractor(contractor);
        }
      }
      
      form.reset({
        ...form.getValues(),
        currentContractorId: currentContractorId || '',
        weeklyPayment: currentWeeklyPayment
      });
    }
  }, [site, contractors, form]);
  
  const onSubmit = async (data: ContractorChangeFormValues) => {
    if (!siteId || !site) return;
    
    try {
      setIsSaving(true);
      
      // Find the new contractor details
      const newContractor = contractors.find(c => c.id === data.newContractorId);
      if (!newContractor) {
        throw new Error("Selected contractor not found");
      }
      
      // Create deep copy of existing data to avoid reference issues
      const updatedSite = JSON.parse(JSON.stringify(site));
      const updatedContractDetails = { ...(updatedSite.contract_details || {}) };
      const updatedJobSpecifications = { ...(updatedSite.job_specifications || {}) };
      
      // Update subcontractors array
      const newSubcontractors = updatedSite.subcontractors ? [...updatedSite.subcontractors] : [];
      
      // Update or add the new subcontractor
      const subcontractorExists = newSubcontractors.some(
        s => s.contractor_id === data.newContractorId
      );
      
      if (subcontractorExists) {
        // Update the existing subcontractor entry
        newSubcontractors.forEach(s => {
          if (s.contractor_id === data.newContractorId) {
            s.business_name = newContractor.business_name;
            s.contact_name = newContractor.contact_name;
            s.email = newContractor.email;
            s.phone = newContractor.phone;
          }
        });
      } else {
        // Add the new subcontractor
        newSubcontractors.push({
          contractor_id: newContractor.id,
          business_name: newContractor.business_name,
          contact_name: newContractor.contact_name,
          email: newContractor.email,
          phone: newContractor.phone
        });
      }
      
      // Format the variation notes for the history entry
      const variationNotes = `
        Contractor Change
        Previous Contractor: ${currentContractor?.business_name || 'None'}
        New Contractor: ${newContractor.business_name}
        Transition Date: ${format(data.transitionDate, 'yyyy-MM-dd')}
        Reason: ${data.reasonForChange}
        ${data.weeklyPayment ? `Weekly Payment: $${data.weeklyPayment}` : ''}
        ${data.additionalNotes ? `Additional Notes: ${data.additionalNotes}` : ''}
      `.trim();
      
      // Update contractor payment if provided
      if (data.weeklyPayment !== undefined && data.weeklyPayment > 0) {
        updatedJobSpecifications.weeklyContractorCost = data.weeklyPayment;
        updatedJobSpecifications.monthlyContractorCost = data.weeklyPayment * 52 / 12;
        updatedJobSpecifications.annualContractorCost = data.weeklyPayment * 52;
        updatedSite.monthly_cost = data.weeklyPayment * 52 / 12;
      }
      
      // Flag that this site has subcontractors
      updatedSite.has_subcontractors = true;
      updatedSite.subcontractors = newSubcontractors;
      
      // Save the current contract details as history first
      await contractHistoryApi.saveContractVersion(
        siteId, 
        site.contract_details || {}, 
        `Before contractor change: ${data.reasonForChange}`
      );
      
      // Update the site with new details
      updatedSite.job_specifications = updatedJobSpecifications;
      updatedSite.contract_details = updatedContractDetails;
      
      // Add contractor change date to contract details for record keeping
      if (!updatedContractDetails.contractorChanges) {
        updatedContractDetails.contractorChanges = [];
      }
      
      updatedContractDetails.contractorChanges.push({
        previousContractorId: data.currentContractorId,
        previousContractorName: currentContractor?.business_name || 'None',
        newContractorId: newContractor.id,
        newContractorName: newContractor.business_name,
        transitionDate: format(data.transitionDate, 'yyyy-MM-dd'),
        reason: data.reasonForChange
      });
      
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
      
      toast.success("Contractor change saved successfully");
      navigate(`/sites/${siteId}`);
    } catch (error) {
      console.error("Error saving contractor change:", error);
      toast.error("Failed to save contractor change");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading || isLoadingContractors) {
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
          <CardTitle>Change of Contractor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h2 className="text-xl font-semibold">{site.name}</h2>
            <p className="text-muted-foreground">Client: {site.client_name}</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Current Contractor</h3>
                {currentContractor ? (
                  <div className="p-4 border rounded-md bg-muted/20">
                    <p className="font-medium">{currentContractor.business_name}</p>
                    <p>{currentContractor.contact_name}</p>
                    <p>{currentContractor.email}</p>
                    <p>{currentContractor.phone}</p>
                    {site.job_specifications?.weeklyContractorCost && (
                      <p className="mt-2">Weekly Payment: ${site.job_specifications.weeklyContractorCost.toFixed(2)}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No current contractor assigned</p>
                )}
              </div>
              
              <Separator />
              
              <FormField
                control={form.control}
                name="newContractorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Contractor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a contractor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contractors
                          .filter(c => c.id !== form.getValues().currentContractorId) // Exclude current contractor
                          .map((contractor) => (
                            <SelectItem key={contractor.id} value={contractor.id}>
                              {contractor.business_name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="transitionDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Transition Date</FormLabel>
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
                    <FormDescription>
                      The date when the new contractor will take over
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reasonForChange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Change</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Performance issues, Contract expiry" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="weeklyPayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekly Payment to New Contractor</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="0.00"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Leave blank to keep the same payment amount
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional information about this change"
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                  Save Contractor Change
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
