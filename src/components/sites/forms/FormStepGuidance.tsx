
import React from 'react';
import { Card } from '@/components/ui/card';
import { Info, CheckCircle2 } from 'lucide-react';
import { StepConfig } from './siteFormConfig';

interface FormStepGuidanceProps {
  currentStep: number;
  stepsConfig: StepConfig[];
}

// Step-specific guidance messages
const stepGuidance: Record<string, string> = {
  'basic-info': 'Start by entering the basic information about your site, including name, address, and client. This establishes the core identity of the site.',
  'contacts': 'Add contacts who will be associated with this site. Make sure to designate a primary contact who will be the main point of communication.',
  'contract-details': 'Set up the contract details including start date, end date, and contract number. This information is crucial for tracking contract renewals and compliance.',
  'billing-details': 'Configure how this site will be billed, including rates, frequency, and payment terms. Add specific billing line items for different services provided.',
  'job-specs': 'Define the job specifications that detail exactly what work will be performed at this site, how often, and any special requirements.',
  'periodicals': 'Set up recurring tasks that need to be performed periodically, such as window cleaning or steam cleaning.',
  'replenishables': 'Specify what supplies need to be replenished at this site and how they should be managed.',
  'security': 'Document any security protocols, access codes, or special instructions for accessing the site.',
  'subcontractors': 'If this site is serviced by subcontractors, add their details here. Specify whether work is delivered internally or by contractors.',
  'review': 'Review all the information provided before creating the site. Check for any missing or incorrect information.',
};

// Service delivery guidance
const serviceDeliveryGuidance = {
  'contract-details': 'Specify whether this contract applies CPI increases and if there are any special contract clauses that should be noted.',
  'job-specs': 'Indicate if the work is being delivered internally by your staff or via external contractors. This affects billing and scheduling.',
  'subcontractors': 'For contractor-delivered services, ensure you specify all costs and billing arrangements to maintain accurate financial projections.',
};

export function FormStepGuidance({ currentStep, stepsConfig }: FormStepGuidanceProps) {
  const currentStepConfig = stepsConfig[currentStep];
  const stepId = currentStepConfig?.id || '';
  const guidance = stepGuidance[stepId] || 'Complete this step to continue with the site creation process.';
  const deliveryGuidance = serviceDeliveryGuidance[stepId];
  
  return (
    <Card className="p-4 bg-blue-50 border-blue-200">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <Info className="h-5 w-5 text-blue-500" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-blue-800">{currentStepConfig?.title} Guidance</h4>
          <p className="text-sm text-blue-700 mt-1">{guidance}</p>
          
          {deliveryGuidance && (
            <div className="mt-3 flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-700">{deliveryGuidance}</p>
            </div>
          )}
          
          {stepId === 'review' && (
            <div className="mt-3 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Verify contact information is correct</li>
                <li>Confirm contract dates and terms</li>
                <li>Check that all billing details are accurate</li>
                <li>Ensure service delivery method is specified</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
