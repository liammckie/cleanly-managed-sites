
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Save, Loader2 } from 'lucide-react';

interface SiteFormStepProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  isLastStep: boolean;
  isFirstStep: boolean;
}

export function SiteFormStep({
  title,
  description,
  children,
  onNext,
  onBack,
  isSubmitting,
  isLastStep,
  isFirstStep
}: SiteFormStepProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
      </div>
      
      <div className="space-y-8">
        {children}
      </div>
      
      <div className="flex justify-between mt-8 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isFirstStep || isSubmitting}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="flex items-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isLastStep ? 'Saving...' : 'Processing...'}
            </>
          ) : isLastStep ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Create Site
            </>
          ) : (
            <>
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
