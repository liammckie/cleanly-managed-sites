
import React, { useState } from 'react';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { Button } from '@/components/ui/button';
import { getSiteFormSteps } from '@/components/sites/forms/siteFormConfig';

type Props = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: SiteFormData;
  handleChange: (field: keyof SiteFormData, value: any) => void;
  handleNestedChange: (section: string, field: string, value: any) => void;
  handleArrayChange: (field: string, values: any[]) => void;
  handleArrayUpdate: (field: string, index: number, value: any) => void;
  handleDoubleNestedChange: (section: string, subsection: string, field: string, value: any) => void;
  addArrayItem: (field: string) => void;
  removeArrayItem: (field: string, index: number) => void;
  addSubcontractor: () => void;
  updateSubcontractor: (index: number, field: string, value: any) => void;
  removeSubcontractor: (index: number) => void;
  addReplenishable: () => void;
  updateReplenishable: (index: number, field: string, value: any) => void;
  removeReplenishable: (index: number) => void;
  addBillingLine: () => void;
  updateBillingLine: (id: string, field: string, value: any) => void;
  removeBillingLine: (id: string) => void;
  addContractTerm: () => void;
  updateContractTerm: (index: number, field: string, value: any) => void;
  removeContractTerm: (index: number) => void;
  addAdditionalContract: () => void;
  updateAdditionalContract: (index: number, field: string, value: any) => void;
  removeAdditionalContract: (index: number) => void;
  handleFileUpload: (field: string, file: File) => void;
  handleFileRemove: (field: string, fileName: string) => void;
  errors: Record<string, string>;
};

export const useSiteFormStepper = (props: Props) => {
  const steps = getSiteFormSteps(
    props.formData,
    props.handleChange,
    props.handleNestedChange,
    props.handleArrayChange,
    props.handleArrayUpdate,
    props.handleDoubleNestedChange,
    props.addArrayItem,
    props.removeArrayItem,
    props.addSubcontractor,
    props.updateSubcontractor,
    props.removeSubcontractor,
    props.addReplenishable,
    props.updateReplenishable,
    props.removeReplenishable,
    props.addBillingLine,
    props.updateBillingLine,
    props.removeBillingLine,
    props.addContractTerm,
    props.updateContractTerm,
    props.removeContractTerm,
    props.addAdditionalContract,
    props.updateAdditionalContract,
    props.removeAdditionalContract,
    props.handleFileUpload,
    props.handleFileRemove,
    props.errors
  );

  const NextButton = () => (
    <Button 
      onClick={() => props.setCurrentStep(props.currentStep + 1)}
      disabled={props.currentStep >= steps.length - 1}
    >
      Next
    </Button>
  );

  const PreviousButton = () => (
    <Button 
      variant="outline"
      onClick={() => props.setCurrentStep(props.currentStep - 1)}
      disabled={props.currentStep <= 0}
    >
      Previous
    </Button>
  );

  const StepIndicator = () => (
    <div className="flex items-center justify-center space-x-1 my-4">
      {steps.map((_, index) => (
        <div
          key={index}
          className={`h-2 w-2 rounded-full ${
            index === props.currentStep ? "bg-primary" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return {
    steps,
    NextButton,
    PreviousButton,
    StepIndicator
  };
};
