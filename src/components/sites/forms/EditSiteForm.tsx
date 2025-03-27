
import React, { useEffect, useState } from 'react';
import { SiteFormStepper } from './SiteFormStepper';
import { useSiteForm } from '@/hooks/useSiteForm';
import { SiteForm } from './SiteForm';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import { useSite } from '@/hooks/useSite';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { getInitialFormData } from './types/initialFormData';

export function EditSiteForm() {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const { site, isLoading } = useSite(siteId);
  const [isSiteLoaded, setIsSiteLoaded] = useState(false);
  
  const {
    formData,
    setFormData,
    step,
    setStep,
    errors,
    handleChange,
    handleNestedChange,
    handleDoubleNestedChange,
    handleClientChange,
    loadSiteData,
    validateStep,
    getCompletionPercentage,
    handleSubmit,
    isSubmitting,
    
    // Form handlers for specific sections
    addBillingLine,
    updateBillingLine,
    removeBillingLine,
    
    addSubcontractor,
    updateSubcontractor,
    removeSubcontractor,
    
    // Use the addReplenishable function directly
    addReplenishable,
    updateReplenishable,
    removeReplenishable,
    
    addContractTerm,
    updateContractTerm,
    removeContractTerm,
    
    addAdditionalContract,
    updateAdditionalContract,
    removeAdditionalContract,
  } = useSiteForm({
    initialFormData: getInitialFormData(),
    onSubmitSuccess: () => {
      navigate(`/sites/${siteId}`);
    }
  });

  // Create wrapper functions outside the destructuring
  const addReplenishableStock = () => addReplenishable('stock');
  const addReplenishableSupplies = () => addReplenishable('supplies');

  // Load site data when available
  useEffect(() => {
    if (site && !isSiteLoaded) {
      loadSiteData(site);
      setIsSiteLoaded(true);
    }
  }, [site, isSiteLoaded, loadSiteData]);

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
        <SiteFormStepper 
          step={step} 
          setStep={setStep} 
          validateStep={validateStep}
          completionPercentage={getCompletionPercentage()}
        />
        
        <SiteForm
          formData={formData}
          step={step}
          errors={errors}
          handleChange={handleChange}
          handleNestedChange={handleNestedChange}
          handleDoubleNestedChange={handleDoubleNestedChange}
          handleClientChange={handleClientChange}
          handleSubmit={() => handleSubmit(siteId)}
          isSubmitting={isSubmitting}
          
          // Pass down all the handlers
          addBillingLine={addBillingLine}
          updateBillingLine={updateBillingLine}
          removeBillingLine={removeBillingLine}
          
          addSubcontractor={addSubcontractor}
          updateSubcontractor={updateSubcontractor}
          removeSubcontractor={removeSubcontractor}
          
          addReplenishableStock={addReplenishableStock}
          addReplenishableSupplies={addReplenishableSupplies}
          updateReplenishable={updateReplenishable}
          removeReplenishable={removeReplenishable}
          
          addContractTerm={addContractTerm}
          updateContractTerm={updateContractTerm}
          removeContractTerm={removeContractTerm}
          
          addAdditionalContract={addAdditionalContract}
          updateAdditionalContract={updateAdditionalContract}
          removeAdditionalContract={removeAdditionalContract}
        />
      </CardContent>
    </Card>
  );
}
