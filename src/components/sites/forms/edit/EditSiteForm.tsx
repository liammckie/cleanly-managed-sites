
import React from 'react';
import { SiteRecord } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { useSiteFormStepper } from '@/hooks/useSiteFormStepper';
import { SiteFormStepper } from '../SiteFormStepper';
import { SiteForm } from '../SiteForm';
import { useSiteForm } from '@/hooks/useSiteForm';
import { getInitialFormData } from '../types/initialFormData';
import { useNavigate } from 'react-router-dom';

interface EditSiteFormProps {
  site: SiteRecord;
}

export function EditSiteForm({ site }: EditSiteFormProps) {
  const navigate = useNavigate();
  const form = useForm();
  const stepper = useSiteFormStepper();
  
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
      navigate(`/sites/${site.id}`);
    }
  });

  // Create wrapper functions outside the destructuring
  const addReplenishableStock = () => addReplenishable('stock');
  const addReplenishableSupplies = () => addReplenishable('supplies');
  
  // Load site data on component mount
  React.useEffect(() => {
    if (site) {
      loadSiteData(site);
    }
  }, [site, loadSiteData]);

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
          handleSubmit={() => handleSubmit(site.id)}
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
