
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSiteForm } from '@/hooks/useSiteForm';
import { SiteForm } from './SiteForm';
import { Card, CardContent } from '@/components/ui/card';
import { useSite } from '@/hooks/useSite';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function EditSiteForm() {
  const { siteId } = useParams<{ siteId: string }>();
  const { site, isLoading } = useSite(siteId);
  
  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleNestedChange,
    handleDoubleNestedChange,
    handleSubmit
  } = useSiteForm('edit', site);

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
