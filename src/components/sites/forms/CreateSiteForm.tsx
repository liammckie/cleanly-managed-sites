
import React from 'react';
import { useSiteForm } from '@/hooks/useSiteForm';
import { SiteForm } from './SiteForm';
import { Card, CardContent } from '@/components/ui/card';

export function CreateSiteForm() {
  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleNestedChange,
    handleDoubleNestedChange,
    handleSubmit
  } = useSiteForm('create');

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
        />
      </CardContent>
    </Card>
  );
}
