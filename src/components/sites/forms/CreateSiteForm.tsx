
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { SiteFormStep } from './SiteFormStep';
import { SiteStatus } from '../SiteCard';
import { SiteFormData, getInitialFormData } from './siteFormTypes';

// Import step components
import { BasicInformationStep } from './steps/BasicInformationStep';
import { SubcontractorsStep } from './steps/SubcontractorsStep';
import { PeriodicalsStep } from './steps/PeriodicalsStep';
import { JobSpecificationsStep } from './steps/JobSpecificationsStep';
import { ReplenishablesStep } from './steps/ReplenishablesStep';
import { SecurityStep } from './steps/SecurityStep';
import { ReviewStep } from './steps/ReviewStep';

export function CreateSiteForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<SiteFormData>(getInitialFormData());
  
  // Handle basic field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle status change specifically for the Select component
  const handleStatusChange = (value: SiteStatus) => {
    handleChange({ target: { name: 'status', value } } as any);
  };
  
  // Handle nested field changes
  const handleNestedChange = (section: keyof SiteFormData, field: string, value: any) => {
    setFormData({
      ...formData,
      [section]: {
        ...(formData[section] as object),
        [field]: value
      }
    });
  };
  
  // Handle nested within nested field changes
  const handleDoubleNestedChange = (section: keyof SiteFormData, subsection: string, field: string, value: any) => {
    setFormData({
      ...formData,
      [section]: {
        ...(formData[section] as object),
        [subsection]: {
          ...((formData[section] as any)[subsection] as object),
          [field]: value
        }
      }
    });
  };
  
  // Handle array of objects field changes
  const handleSubcontractorChange = (index: number, field: string, value: string) => {
    const newSubcontractors = [...formData.subcontractors];
    newSubcontractors[index] = {
      ...newSubcontractors[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      subcontractors: newSubcontractors
    });
  };
  
  // Handle array field changes
  const handleStockChange = (index: number, value: string) => {
    const newStock = [...formData.replenishables.stock];
    newStock[index] = value;
    
    setFormData({
      ...formData,
      replenishables: {
        ...formData.replenishables,
        stock: newStock
      }
    });
  };
  
  // Add another subcontractor
  const addSubcontractor = () => {
    setFormData({
      ...formData,
      subcontractors: [
        ...formData.subcontractors,
        {
          businessName: '',
          contactName: '',
          email: '',
          phone: ''
        }
      ]
    });
  };
  
  // Remove a subcontractor
  const removeSubcontractor = (index: number) => {
    const newSubcontractors = [...formData.subcontractors];
    newSubcontractors.splice(index, 1);
    
    setFormData({
      ...formData,
      subcontractors: newSubcontractors
    });
  };
  
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
  
  // Steps configuration
  const steps = [
    {
      title: "Basic Information",
      description: "Enter the basic details about the site.",
      content: (
        <BasicInformationStep 
          formData={formData}
          handleChange={handleChange}
          handleStatusChange={handleStatusChange}
        />
      )
    },
    {
      title: "Subcontractor Details",
      description: "Add information about the subcontractors for this site.",
      content: (
        <SubcontractorsStep 
          formData={formData}
          handleSubcontractorChange={handleSubcontractorChange}
          addSubcontractor={addSubcontractor}
          removeSubcontractor={removeSubcontractor}
        />
      )
    },
    {
      title: "Periodical Inclusions",
      description: "Add information about periodical cleaning services.",
      content: (
        <PeriodicalsStep 
          formData={formData}
          handleDoubleNestedChange={handleDoubleNestedChange}
        />
      )
    },
    {
      title: "Job Specifications",
      description: "Add details about the cleaning job requirements.",
      content: (
        <JobSpecificationsStep 
          formData={formData}
          handleNestedChange={handleNestedChange}
        />
      )
    },
    {
      title: "Replenishables & Stock",
      description: "Add information about replenishable stock items.",
      content: (
        <ReplenishablesStep 
          formData={formData}
          handleStockChange={handleStockChange}
          handleNestedChange={handleNestedChange}
        />
      )
    },
    {
      title: "Security Details",
      description: "Add security and access information for the site.",
      content: (
        <SecurityStep 
          formData={formData}
          handleNestedChange={handleNestedChange}
        />
      )
    },
    {
      title: "Review & Submit",
      description: "Review your information before creating the site.",
      content: (
        <ReviewStep formData={formData} />
      )
    }
  ];
  
  // Next step handler
  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      handleSubmit();
      return;
    }
    
    setCurrentStep(prevStep => prevStep + 1);
    window.scrollTo(0, 0);
  };
  
  // Back step handler
  const handleBack = () => {
    setCurrentStep(prevStep => prevStep - 1);
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Step {currentStep + 1} of {steps.length}</span>
          <span className="text-sm text-muted-foreground">{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <SiteFormStep
        title={steps[currentStep].title}
        description={steps[currentStep].description}
        onNext={handleNext}
        onBack={handleBack}
        isSubmitting={isSubmitting}
        isLastStep={currentStep === steps.length - 1}
        isFirstStep={currentStep === 0}
      >
        {steps[currentStep].content}
      </SiteFormStep>
    </div>
  );
}
