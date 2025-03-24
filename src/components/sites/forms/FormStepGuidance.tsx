
import React from 'react';
import { StepConfig } from './siteFormConfig';
import { Card } from '@/components/ui/card';
import { Check, Info } from 'lucide-react';

interface FormStepGuidanceProps {
  currentStep: number;
  stepsConfig: StepConfig[];
}

export function FormStepGuidance({ currentStep, stepsConfig }: FormStepGuidanceProps) {
  const currentStepConfig = stepsConfig[currentStep];
  
  // Generate guidance based on current step
  const getStepGuidance = () => {
    switch (currentStepConfig.id) {
      case 'basic-info':
        return 'Start by entering the basic site information. This establishes the foundation for your site.';
      case 'contacts':
        return 'Add contacts who will be associated with this site. The first contact you add will automatically be set as the primary contact.';
      case 'contract-details':
        return 'Define the contract details including start date, end date, and contract type. This information is essential for billing and operations.';
      case 'billing-details':
        return 'Configure how this site will be billed, including frequency and payment terms.';
      case 'job-specifications':
        return 'Specify the work requirements for this site, including schedules and cleaning instructions.';
      case 'security-details':
        return 'Add security information such as access codes and alarm instructions if needed.';
      case 'periodicals':
        return 'Set up recurring services like window cleaning or deep cleaning that occur on a periodic schedule.';
      case 'supplies':
        return 'List any supplies that will be provided to this site as part of the service agreement.';
      case 'subcontractors':
        return 'If work will be performed by subcontractors, add their information here.';
      case 'additional-contracts':
        return 'Add any additional contracts beyond the primary service agreement if applicable.';
      default:
        return 'Complete each section to create a comprehensive site profile.';
    }
  };
  
  return (
    <Card className="p-4 bg-blue-50 border-blue-200 mb-4">
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">
          <Info size={20} className="text-blue-500" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-blue-700 mb-1">Step {currentStep + 1} of {stepsConfig.length}: {currentStepConfig.title}</h3>
          <p className="text-sm text-blue-600">{getStepGuidance()}</p>
          
          {currentStepConfig.id === 'contacts' && (
            <div className="mt-2 p-2 bg-blue-100 rounded-md text-sm text-blue-700">
              <p><strong>Note:</strong> The first contact you add will automatically be set as the primary contact for this site. You can change the primary contact later.</p>
            </div>
          )}
          
          <div className="mt-2 flex flex-wrap gap-2">
            {stepsConfig.map((step, index) => (
              <div 
                key={step.id}
                className={`px-2 py-1 rounded-md text-xs font-medium ${
                  index === currentStep 
                    ? 'bg-blue-500 text-white' 
                    : index < currentStep 
                      ? 'bg-green-100 text-green-800 border border-green-300' 
                      : 'bg-gray-100 text-gray-500'
                }`}
              >
                {index < currentStep && (
                  <Check className="inline-block mr-1 h-3 w-3" />
                )}
                {index + 1}. {step.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
