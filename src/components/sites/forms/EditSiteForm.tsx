
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { SiteFormStep } from './SiteFormStep';
import { useSiteForm } from '@/hooks/useSiteForm';
import { useSiteFormStepper } from '@/hooks/useSiteFormStepper';
import { getStepsConfig } from './siteFormConfig';
import { FormProgressBar } from './FormProgressBar';
import { sitesApi, SiteRecord } from '@/lib/api';

interface EditSiteFormProps {
  site: SiteRecord;
}

export function EditSiteForm({ site }: EditSiteFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use the custom hooks
  const formHandlers = useSiteForm();
  
  // Initialize form with the site data
  useEffect(() => {
    if (site) {
      // Convert from API format to form format (flattening JSON fields)
      const formData = {
        ...site,
        securityDetails: site.security_details || formHandlers.formData.securityDetails,
        jobSpecifications: site.job_specifications || formHandlers.formData.jobSpecifications,
        periodicals: site.periodicals || formHandlers.formData.periodicals,
        replenishables: site.replenishables || formHandlers.formData.replenishables,
        contractDetails: site.contract_details || formHandlers.formData.contractDetails,
        billingDetails: site.billing_details || formHandlers.formData.billingDetails,
        subcontractors: site.subcontractors || formHandlers.formData.subcontractors,
      };
      
      formHandlers.setFormData(formData);
    }
  }, [site]);
  
  // Get steps configuration
  const steps = getStepsConfig(formHandlers);
  
  // Use stepper hook with validation
  const stepper = useSiteFormStepper({
    steps,
    validateStep: formHandlers.validateStep
  });
  
  // Handle submit
  const handleSubmit = async () => {
    // Final validation before submitting
    if (!formHandlers.validateStep(stepper.currentStep)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use the API to update the site
      await sitesApi.updateSite(site.id, formHandlers.formData);
      toast.success("Site has been updated successfully!");
      navigate(`/sites/${site.id}`);
    } catch (error) {
      console.error('Error updating site:', error);
      toast.error("Failed to update site. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Site: {site.name}</h1>
      
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
  );
}
