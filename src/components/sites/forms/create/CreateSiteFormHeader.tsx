
import React from 'react';
import { FormProgressBar } from '../FormProgressBar';

interface CreateSiteFormHeaderProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
}

export function CreateSiteFormHeader({ 
  currentStep, 
  totalSteps, 
  progress 
}: CreateSiteFormHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-2">Create New Site</h1>
      <p className="text-muted-foreground mb-4">Add a new site to your account by filling out the form below.</p>
      
      <FormProgressBar 
        currentStep={currentStep}
        totalSteps={totalSteps}
        progress={progress}
      />
    </div>
  );
}
