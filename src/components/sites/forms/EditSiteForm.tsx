
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { SiteFormStep } from './SiteFormStep';
import { useSiteForm } from '@/hooks/useSiteForm';
import { useSiteFormStepper } from '@/hooks/useSiteFormStepper';
import { getStepsConfig } from './siteFormConfig';
import { FormProgressBar } from './FormProgressBar';
import { sitesApi, SiteRecord } from '@/lib/api';
import { getInitialFormData } from './siteFormTypes';

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
        // Handle optional fields with fallbacks
        phone: site.phone || baseFormData.phone,
        email: site.email || baseFormData.email,
        // Merge JSON fields with defaults
        securityDetails: site.security_details || baseFormData.securityDetails,
        jobSpecifications: site.job_specifications || baseFormData.jobSpecifications,
        periodicals: site.periodicals || baseFormData.periodicals,
        replenishables: site.replenishables || baseFormData.replenishables,
        contractDetails: site.contract_details || baseFormData.contractDetails,
        billingDetails: site.billing_details || baseFormData.billingDetails,
        subcontractors: site.subcontractors || baseFormData.subcontractors,
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
