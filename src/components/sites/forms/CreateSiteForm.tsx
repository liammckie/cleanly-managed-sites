
import React, { useState } from 'react';
import { useSiteForm } from '@/hooks/useSiteForm';
import { SiteForm } from './SiteForm';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { siteFormSchema } from '@/lib/validation/siteSchema';

export function CreateSiteForm() {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const {
    formState,
    errors,
    isSubmitting,
    handleChange,
    handleNestedChange,
    handleDoubleNestedChange,
    handleSubmit
  } = useSiteForm('create');

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
