
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { FormProvider } from "react-hook-form";
import { SiteFormStep } from './SiteFormStep';
import { useSiteForm } from '@/hooks/useSiteForm';
import { useSiteFormStepper } from '@/hooks/useSiteFormStepper';
import { getStepsConfig } from './siteFormConfig';
import { FormProgressBar } from './FormProgressBar';
import { sitesApi, SiteRecord } from '@/lib/api';
import { getInitialFormData } from './siteFormTypes';
import { convertContactRecordToSiteContact } from './types/contactTypes';
import { History } from 'lucide-react';
import { handleSiteAdditionalContracts } from '@/lib/api/sites/additionalContractsApi';
import { handleSiteBillingLines } from '@/lib/api/sites/billingLinesApi';

interface EditSiteFormProps {
  site: SiteRecord;
}

export function EditSiteForm({ site }: EditSiteFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab');
  const isContractVariation = queryParams.get('variation') === 'true';
  
  // Use the custom hooks
  const formHandlers = useSiteForm();
  
  // Initialize form with the site data
  useEffect(() => {
    if (site) {
      // Create a base form data with all required fields
      const baseFormData = getInitialFormData();
      
      // Convert from API format to form format (flattening JSON fields)
      const formData = {
        ...baseFormData,
        // Copy over basic fields
        name: site.name,
        address: site.address,
        city: site.city,
        state: site.state,
        postcode: site.postcode,
        status: site.status,
        representative: site.representative,
        clientId: site.client_id, // Ensure clientId is set
        // Handle optional fields with fallbacks
        phone: site.phone || baseFormData.phone,
        email: site.email || baseFormData.email,
        // Add weekly and annual revenue
        weeklyRevenue: site.weekly_revenue,
        monthlyRevenue: site.monthly_revenue,
        annualRevenue: site.annual_revenue,
        // Merge JSON fields with defaults
        securityDetails: site.security_details || baseFormData.securityDetails,
        jobSpecifications: site.job_specifications || baseFormData.jobSpecifications,
        periodicals: site.periodicals || baseFormData.periodicals,
        replenishables: site.replenishables || baseFormData.replenishables,
        contractDetails: site.contract_details || baseFormData.contractDetails,
        billingDetails: site.billing_details || baseFormData.billingDetails,
        subcontractors: site.subcontractors || baseFormData.subcontractors,
        // Convert ContactRecord[] to SiteContact[]
        contacts: site.contacts ? site.contacts.map(contact => convertContactRecordToSiteContact(contact)) : [],
        // Include additional contracts
        additionalContracts: site.additionalContracts || []
      };
      
      formHandlers.setFormData(formData);
      
      // Set the contacts in the contacts handler (also converted to the right type)
      if (site.contacts && site.contacts.length > 0) {
        formHandlers.setContacts(site.contacts.map(contact => convertContactRecordToSiteContact(contact)));
      }
    }
  }, [site]);
  
  // Get steps configuration
  const steps = getStepsConfig(formHandlers);
  
  // Find appropriate step index if tab parameter is provided
  const getInitialStepIndex = () => {
    if (!initialTab) return 0;
    
    // Map tab names to step indexes
    const tabToStepMap: Record<string, number> = {
      'basic': 0,
      'contract': 2, // Assuming contract details is the 3rd step (index 2)
      'billing': 3,  // Assuming billing is the 4th step (index 3)
      'contacts': 4  // Assuming contacts is the 5th step (index 4)
    };
    
    return tabToStepMap[initialTab] || 0;
  };
  
  // Use stepper hook with validation and initial step from URL
  const stepper = useSiteFormStepper({
    steps,
    validateStep: formHandlers.validateStep,
    initialStep: getInitialStepIndex()
  });
  
  // Show appropriate title based on whether this is a contract variation
  const getPageTitle = () => {
    if (isContractVariation) {
      return "Contract Variation: " + site.name;
    }
    return "Edit Site: " + site.name;
  };
  
  // Handle submit
  const handleSubmit = async () => {
    // Final validation before submitting
    if (!formHandlers.validateStep(stepper.currentStep)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use the API to update the site
      const updatedSite = await sitesApi.updateSite(site.id, formHandlers.formData);
      
      // Handle additional contracts if they exist
      if (formHandlers.formData.additionalContracts && 
          formHandlers.formData.additionalContracts.length > 0) {
        await handleSiteAdditionalContracts(
          site.id, 
          formHandlers.formData.additionalContracts,
          site.user_id
        );
      }
      
      // Handle billing lines if they exist
      if (formHandlers.formData.billingDetails && 
          formHandlers.formData.billingDetails.billingLines && 
          formHandlers.formData.billingDetails.billingLines.length > 0) {
        await handleSiteBillingLines(
          site.id, 
          formHandlers.formData.billingDetails.billingLines
        );
      }
      
      if (isContractVariation) {
        toast.success("Contract variation completed successfully!");
      } else {
        toast.success("Site has been updated successfully!");
      }
      
      navigate(`/sites/${site.id}`);
    } catch (error) {
      console.error('Error updating site:', error);
      toast.error("Failed to update site. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...formHandlers.form}>
      <Form {...formHandlers.form}>
        <form>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">{getPageTitle()}</h1>
            
            {isContractVariation && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <History className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      You are creating a contract variation. The previous version has been saved in the contract history.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <FormProgressBar 
              currentStep={stepper.currentStep}
              totalSteps={stepper.totalSteps}
              progress={stepper.progress}
            />
            
            <SiteFormStep
              title={steps[stepper.currentStep].title}
              description={steps[stepper.currentStep].description}
              onNext={() => stepper.handleNext(handleSubmit)}
              onBack={stepper.handleBack}
              isSubmitting={isSubmitting}
              isLastStep={stepper.isLastStep}
              isFirstStep={stepper.isFirstStep}
            >
              {steps[stepper.currentStep].component}
            </SiteFormStep>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
