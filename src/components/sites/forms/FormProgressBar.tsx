
import React from 'react';

interface FormProgressBarProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
}

export function FormProgressBar({ currentStep, totalSteps, progress }: FormProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Step {currentStep + 1} of {totalSteps}</span>
        <span className="text-sm text-muted-foreground">{progress}% Complete</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
