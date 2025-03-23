
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { useSiteForm } from '@/hooks/useSiteForm';
import { SiteFormStep } from './SiteFormStep';
import { getSiteFormSteps } from './siteFormConfig';
import { FormProgressBar } from './FormProgressBar';
import { useSiteFormStepper } from '@/hooks/useSiteFormStepper';
import { toast } from 'sonner';
import { SiteFormData } from './siteFormTypes';
import { v4 as uuidv4 } from 'uuid';
import { BillingLine } from './types/billingTypes';

interface EditSiteFormProps {
  site: any; // Using any to avoid the SiteRecord import issue
}

export function EditSiteForm({ site }: EditSiteFormProps) {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  // Get form state and handlers from the useSiteForm hook
  const siteForm = useSiteForm();
  const { formData, setFormData, validateStep } = siteForm;
  
  // Define dummy handlers for missing functionality
  const handleArrayChange = (field: string, values: any[]) => {
    console.log(`Array change for ${field}:`, values);
  };
  
  const handleArrayUpdate = (field: string, index: number, value: any) => {
    console.log(`Array update for ${field} at index ${index}:`, value);
  };
  
  const addArrayItem = (field: string) => {
    console.log(`Adding item to ${field}`);
  };
  
  const removeArrayItem = (field: string, index: number) => {
    console.log(`Removing item from ${field} at index ${index}`);
  };
  
  const handleFileUpload = (field: string, file: File) => {
    console.log(`Uploading file for ${field}:`, file.name);
  };
  
  const handleFileRemove = (field: string, fileName: string) => {
    console.log(`Removing file ${fileName} from ${field}`);
  };
  
  // Initialize the stepper
  const steps = getSiteFormSteps(
    formData,
    (field: string, value: any) => siteForm.handleChange({ target: { name: field, value } } as any),
    siteForm.handleNestedChange,
    handleArrayChange,
    handleArrayUpdate,
    siteForm.handleDoubleNestedChange,
    addArrayItem,
    removeArrayItem,
    siteForm.addSubcontractor || (() => {}),
    siteForm.updateSubcontractor || ((index: number, field: string, value: any) => {}),
    siteForm.removeSubcontractor || ((index: number) => {}),
    siteForm.addReplenishable || (() => {}),
    siteForm.updateReplenishable || ((index: number, field: string, value: any) => {}),
    siteForm.removeReplenishable || ((index: number) => {}),
    siteForm.addBillingLine || (() => {}),
    siteForm.updateBillingLine || ((id: string, field: string, value: any) => {}),
    siteForm.removeBillingLine || ((id: string) => {}),
    siteForm.addContractTerm || (() => {}),
    siteForm.updateContractTerm || ((index: number, field: string, value: any) => {}),
    siteForm.removeContractTerm || ((index: number) => {}),
    siteForm.addAdditionalContract || (() => {}),
    siteForm.updateAdditionalContract || ((index: number, field: string, value: any) => {}),
    siteForm.removeAdditionalContract || ((index: number) => {}),
    handleFileUpload,
    handleFileRemove
  );
  
  // Use stepper hook with validation
  const stepper = useSiteFormStepper({
    steps,
    validateStep
  });
  
  // Prepare data for form when site data is loaded
  useEffect(() => {
    if (site) {
      // Create a new form data object using the site data
      const updatedFormData: SiteFormData = {
        ...formData,
        name: site.name || '',
        clientId: site.client_id || '',
        address: site.address || '',
        city: site.city || '',
        state: site.state || '',
        postcode: site.postcode || '',
        status: site.status || 'active',
        notes: site.notes || '',
        contractType: 'cleaning', // Default type
        // Add other fields from site as needed
      };
      
      // Add billing lines with unique IDs if available
      if (site.billingLines && site.billingLines.length > 0) {
        const formattedBillingLines: BillingLine[] = site.billingLines.map((line: any) => ({
          id: uuidv4(), // Generate unique ID for each line
          description: line.description || '',
          amount: line.amount || 0,
          frequency: line.frequency || 'monthly',
          isRecurring: line.is_recurring !== undefined ? line.is_recurring : true,
          onHold: line.on_hold || false,
          weeklyAmount: line.weekly_amount,
          monthlyAmount: line.monthly_amount,
          annualAmount: line.annual_amount,
          holdStartDate: line.hold_start_date,
          holdEndDate: line.hold_end_date,
          creditAmount: line.credit_amount,
          creditDate: line.credit_date,
          creditReason: line.credit_reason
        }));
        
        updatedFormData.billingDetails = {
          ...updatedFormData.billingDetails,
          billingLines: formattedBillingLines,
          totalWeeklyAmount: site.weekly_revenue || 0,
          totalAnnualAmount: site.annual_revenue || 0,
          totalMonthlyAmount: (site.weekly_revenue || 0) * 4.33, // Approximate monthly from weekly
        };
      }
      
      // Add additional contracts if available
      if (site.additionalContracts && site.additionalContracts.length > 0) {
        updatedFormData.additionalContracts = site.additionalContracts;
      }
      
      // Update the form data
      setFormData(updatedFormData);
    }
  }, [site]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      // Call API to update site data
      // const response = await updateSite(formData);
      
      // Show success message
      toast.success('Site updated successfully');
      
      // Navigate back to site details page
      navigate(`/sites/${site.id}`);
    } catch (error) {
      console.error('Error updating site:', error);
      toast.error('Failed to update site');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Site: {site.name}</h1>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/sites/${site.id}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Site
          </Button>
          
          <Button
            type="button"
            size="sm"
            disabled={isSaving}
            onClick={handleSubmit}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
      
      <FormProgressBar 
        currentStep={stepper.currentStep}
        totalSteps={stepper.totalSteps}
        progress={stepper.progress}
      />
      
      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <SiteFormStep
            title={stepper.steps[stepper.currentStep].title}
            description={stepper.steps[stepper.currentStep].description}
            onNext={() => stepper.handleNext()}
            onBack={stepper.handleBack}
            isSubmitting={isSaving}
            isLastStep={stepper.isLastStep}
            isFirstStep={stepper.isFirstStep}
          >
            {stepper.steps[stepper.currentStep].component}
          </SiteFormStep>
        </form>
      </Card>
    </div>
  );
}
