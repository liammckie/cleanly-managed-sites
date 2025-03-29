
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSiteForm } from '@/hooks/useSiteForm';
import { SiteForm } from './SiteForm';
import { Card, CardContent } from '@/components/ui/card';
import { useSite } from '@/hooks/useSite';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import { siteFormSchema } from '@/lib/validation/siteSchema';

export function EditSiteForm() {
  const { siteId } = useParams<{ siteId: string }>();
  const { site, isLoading } = useSite(siteId);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const {
    formState,
    errors,
    isSubmitting,
    handleChange,
    handleNestedChange,
    handleDoubleNestedChange,
    handleSubmit
  } = useSiteForm('edit', site);

  const onSubmit = () => {
    // Reset validation errors
    setValidationErrors({});
    
    // Validate with Zod
    const result = siteFormSchema.safeParse(formState);
    
    if (!result.success) {
      // Format Zod errors for field-level feedback
      const formattedErrors: Record<string, string> = {};
      result.error.errors.forEach(error => {
        const path = error.path.join('.');
        formattedErrors[path] = error.message;
      });
      
      setValidationErrors(formattedErrors);
      toast.error('Please fix the validation errors');
      return;
    }
    
    // If validation passes, proceed with form submission
    handleSubmit();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <SiteForm
          formData={formState}
          handleChange={handleChange}
          handleNestedChange={handleNestedChange}
          handleDoubleNestedChange={handleDoubleNestedChange}
          handleSubmit={onSubmit}
          isSubmitting={isSubmitting}
          error={errors['general']}
          validationErrors={validationErrors}
        />
      </CardContent>
    </Card>
  );
}
