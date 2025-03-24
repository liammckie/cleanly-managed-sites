
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSite } from '@/hooks/useSite';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { contractHistoryApi } from '@/lib/api/sites/contractHistoryApi';
import { useSiteUpdate } from '@/hooks/useSiteUpdate';
import { BillingLine } from '@/components/sites/forms/types/billingTypes';

// Import our new components
import { BillingVariationHeader } from './BillingVariationHeader';
import { GeneralVariationFields } from './GeneralVariationFields';
import { BillingAmountFields } from './BillingAmountFields';
import { ContractExtensionFields } from './ContractExtensionFields';
import { BillingLineFields } from './BillingLineFields';

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
      <BillingVariationHeader 
        siteName={site.name} 
        clientName={site.client_name}
        siteId={siteId!} 
      />
      
      <CardContent>
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{site.name}</h2>
          <p className="text-muted-foreground">Client: {site.client_name}</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <GeneralVariationFields />
            <BillingAmountFields />
            <ContractExtensionFields />
            <BillingLineFields billingLines={billingLines} />
            
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
    </div>
  );
}
