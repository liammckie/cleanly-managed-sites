
import React, { useState } from 'react';
import { useSiteForm } from '@/hooks/useSiteForm';
import { SiteForm } from './SiteForm';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { siteFormSchema } from '@/lib/validation/siteSchema';

export function CreateSiteForm() {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleNestedChange,
    handleDoubleNestedChange,
    handleSubmit: submitForm
  } = useSiteForm('create');

  const handleSubmit = () => {
    // Reset validation errors
    setValidationErrors({});
    
    // Validate with Zod
    const result = siteFormSchema.safeParse(formData);
    
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
    submitForm();
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <SiteForm
          formData={formData}
          handleChange={handleChange}
          handleNestedChange={handleNestedChange}
          handleDoubleNestedChange={handleDoubleNestedChange}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={errors['general']}
          validationErrors={validationErrors}
        />
      </CardContent>
    </Card>
  );
}
