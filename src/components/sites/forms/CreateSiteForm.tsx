
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { SiteFormStep } from './SiteFormStep';
import { useSiteForm } from '@/hooks/useSiteForm';
import { useSiteFormStepper } from '@/hooks/useSiteFormStepper';
import { getStepsConfig } from './siteFormConfig';
import { FormProgressBar } from './FormProgressBar';
import { sitesApi } from '@/lib/api';

export function CreateSiteForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use the custom hooks
  const formHandlers = useSiteForm();
  
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
      // Use the actual API to create the site
      await sitesApi.createSite(formHandlers.formData);
      toast.success("Site has been created successfully!");
      navigate('/sites');
    } catch (error) {
      console.error('Error creating site:', error);
      toast.error("Failed to create site. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...formHandlers.form}>
      <div className="max-w-4xl mx-auto">
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
    </Form>
  );
}
