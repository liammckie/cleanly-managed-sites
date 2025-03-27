
import React from 'react';
import { SiteFormStepper } from './SiteFormStepper';
import { useSiteForm } from '@/hooks/useSiteForm';
import { SiteForm } from './SiteForm';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export function CreateSiteForm() {
  const navigate = useNavigate();
  
  const {
    formData,
    handleChange,
    handleNestedChange,
    handleDoubleNestedChange,
    handleLocationDetailsChange,
    handleContactChange,
    addContact,
    removeContact,
    handleBillingLineChange,
    addBillingLine,
    removeBillingLine,
    handleStatusChange,
    handleSubmit,
    isSubmitting,
    error
  } = useSiteForm();

  return (
    <Card>
      <CardContent className="pt-6">
        <SiteForm
          formData={formData}
          handleChange={handleChange}
          handleNestedChange={handleNestedChange}
          handleDoubleNestedChange={handleDoubleNestedChange}
          handleSubmit={() => handleSubmit('create')}
          isSubmitting={isSubmitting}
          error={error}
        />
      </CardContent>
    </Card>
  );
}
