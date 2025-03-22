
import React from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Save } from 'lucide-react';

interface FormSubmitButtonProps {
  isSubmitting: boolean;
  isUploading: boolean;
}

export const FormSubmitButton = ({ isSubmitting, isUploading }: FormSubmitButtonProps) => {
  return (
    <div className="flex justify-end">
      <Button 
        type="submit" 
        className="mt-4"
        disabled={isSubmitting || isUploading}
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner size="sm" />
            <span className="ml-2">Saving...</span>
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Save Details
          </>
        )}
      </Button>
    </div>
  );
};
