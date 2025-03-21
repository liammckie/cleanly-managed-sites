
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { SiteFormStep } from './SiteFormStep';
import { useSiteForm } from '@/hooks/useSiteForm';
import { useSiteFormStepper } from '@/hooks/useSiteFormStepper';
import { getStepsConfig } from './siteFormConfig';
import { FormProgressBar } from './FormProgressBar';

export function CreateSiteForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use the custom hooks
  const formHandlers = useSiteForm();
  
  // Get steps configuration
  const steps = getStepsConfig(formHandlers);
  
  // Use stepper hook
  const stepper = useSiteFormStepper(steps);
  
  // Handle submit
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Site has been created successfully!");
      setIsSubmitting(false);
      navigate('/sites');
    }, 1500);
  };

  return (
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
  );
}
