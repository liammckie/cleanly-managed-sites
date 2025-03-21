
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SiteFormStepProps = {
  title: string;
  description?: string;
  children: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  isSubmitting?: boolean;
  isLastStep?: boolean;
  isFirstStep?: boolean;
  className?: string;
};

export function SiteFormStep({
  title,
  description,
  children,
  onNext,
  onBack,
  isSubmitting = false,
  isLastStep = false,
  isFirstStep = false,
  className,
}: SiteFormStepProps) {
  return (
    <div className={cn("space-y-6 animate-fade-in", className)}>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      
      <div className="space-y-4">
        {children}
      </div>
      
      <div className="flex justify-between pt-6 border-t border-border">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          disabled={isFirstStep || isSubmitting}
        >
          Back
        </Button>
        
        <Button 
          type="button" 
          onClick={onNext}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : isLastStep ? (
            'Save Site'
          ) : (
            'Next Step'
          )}
        </Button>
      </div>
    </div>
  );
}
