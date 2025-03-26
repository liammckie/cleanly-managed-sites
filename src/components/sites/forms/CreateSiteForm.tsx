
import React from 'react';
import { SiteFormStepper } from './SiteFormStepper';
import { useSiteForm } from '@/hooks/useSiteForm';
import { SiteForm } from './SiteForm';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { getInitialFormData } from './types/initialFormData';
import { SiteFormData } from './types/siteFormData';

export function CreateSiteForm() {
  const navigate = useNavigate();
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
    
    // Create wrapper functions to handle the type mismatch
    addReplenishableStock: () => addReplenishable('stock'),
    addReplenishableSupplies: () => addReplenishable('supplies'),
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
    onSubmitSuccess: (siteId) => {
      navigate(`/sites/${siteId}`);
    }
  });

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
          handleSubmit={handleSubmit}
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
