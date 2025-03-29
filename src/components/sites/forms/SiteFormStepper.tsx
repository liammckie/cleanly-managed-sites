
import React, { useState } from 'react';
import { SiteFormData } from './types/siteFormData';
import { siteFormSteps } from './siteFormConfig';

export interface SiteFormStepperProps {
  formData: SiteFormData;
  onChange: <K extends keyof SiteFormData>(field: K, value: SiteFormData[K]) => void; 
  onNestedChange: (section: string, field: string, value: any) => void;
  onDoubleNestedChange: (section: string, subsection: string, field: string, value: any) => void;
  mode: 'create' | 'edit';
}

export const SiteFormStepper: React.FC<SiteFormStepperProps> = ({
  formData,
  onChange,
  onNestedChange,
  onDoubleNestedChange,
  mode
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = siteFormSteps.length;

  const goToNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const CurrentStepComponent = siteFormSteps[currentStep].component;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold">
          {siteFormSteps[currentStep].title}
        </h2>
        <div className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {totalSteps}
        </div>
      </div>

      <div className="mb-8">
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-8">
        <CurrentStepComponent 
          formData={formData}
          handleChange={onChange}
          handleNestedChange={onNestedChange}
          handleDoubleNestedChange={onDoubleNestedChange}
        />
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={goToPrevStep}
          disabled={currentStep === 0}
          className="px-4 py-2 border rounded text-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        
        {currentStep < totalSteps - 1 ? (
          <button
            type="button"
            onClick={goToNextStep}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded"
          >
            {mode === 'create' ? 'Create Site' : 'Save Changes'}
          </button>
        )}
      </div>
    </div>
  );
};
